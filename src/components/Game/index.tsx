'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Game.module.css';

class Tile {
	control: 'neutral' | 'player1' | 'player2';
	valid: boolean;
	powerup: string;
	constructor() {
		this.control = 'neutral';
		this.valid = false;
		const powerups = [
			'none',
			'bomb',
			'none',
			'none',
			'turn',
			'none',
			'none',
			'none',
			'none',
			'destroy',
		];
		this.powerup = powerups[Math.floor(Math.random() * powerups.length)];
	}
}
const Game = () => {
	const [tiles, setTiles] = useState<Tile[]>([]);
	const [turn, setTurn] = useState<'player1' | 'player2'>('player1');
	const [width, setWidth] = useState(0);
	const [destroy, setDestroy] = useState(false);
	const [powerup, setPowerup] = useState('none');
	const [firstTileSelected, setFirstTileSelected] = useState(false);
	const [winner, setWinner] = useState<string | undefined>(undefined);

	const ref = useRef<HTMLDivElement>(null);

	/**
	 * Change who controls a tile and switch player turns
	 * @param index the index of the clicked tile
	 */
	const tileControlled = (index: number) => {
		if (isValid(index, destroy, firstTileSelected, turn, tiles)) {
			if (destroy) {
				setDestroy(false);
				setPowerup('none');
			}
			setTiles((t) => {
				t[index].control = turn;
				checkBomb(t, index);
				return t;
			});
			const tilesCopy = [...tiles];
			checkBomb(tilesCopy, index);
			tilesCopy[index].control = turn;

			if (tiles[index].powerup === 'destroy' && firstTileSelected) {
				setDestroy(true);
			}
			if (
				tiles[index].powerup === 'none' ||
				tiles[index].powerup === 'bomb' ||
				!firstTileSelected
			) {
				setTurn((t) => (t === 'player1' ? 'player2' : 'player1'));
			}
			if (firstTileSelected && tiles[index].powerup !== 'bomb') {
				setPowerup(tiles[index].powerup);
			}
			if (tiles.filter((tile) => tile.control !== 'neutral').length > 1) {
				setFirstTileSelected(true);
			}

			const movesAvailable1 = [...tilesCopy].map((tile, index) => ({
				...tile,
				valid: isValid(index, false, firstTileSelected, 'player1', tilesCopy),
			}));
			const movesAvailable2 = [...tilesCopy].map((tile, index) => ({
				...tile,
				valid: isValid(
					index,
					false,
					firstTileSelected ||
						tiles.filter((tile) => tile.control !== 'neutral').length > 1,
					'player2',
					tilesCopy
				),
			}));
			if (
				firstTileSelected &&
				(tilesCopy.filter((tile) => tile.control === 'neutral').length === 0 ||
					movesAvailable1.filter((tile) => tile.valid).length === 0 ||
					movesAvailable2.filter((tile) => tile.valid).length === 0)
			) {
				const player1Tiles = tiles.filter((tile) => tile.control === 'player1');
				const player2Tiles = tiles.filter((tile) => tile.control === 'player2');
				setWinner(
					player2Tiles > player1Tiles
						? 'player2'
						: player1Tiles > player2Tiles
						? 'player1'
						: 'tie'
				);
			}
		}
	};

	// check for bomb powerup and do effect
	const checkBomb = (t: Tile[], index: number) => {
		if (t.length > 0 && t[index].powerup === 'bomb' && firstTileSelected) {
			const leftTile = getCellByRowCol(getRow(index), getCol(index) - 1);
			const rightTile = getCellByRowCol(getRow(index), getCol(index) + 1);
			const leftTopTile = getCellByRowCol(
				getRow(index) - 1,
				getCol(index) + (getRow(index) % 2 === 1 ? 0 : -1)
			);
			const rightTopTile = getCellByRowCol(
				getRow(index) - 1,
				getCol(index) + (getRow(index) % 2 === 1 ? 1 : 0)
			);
			const leftBottomTile = getCellByRowCol(
				getRow(index) + 1,
				getCol(index) + (getRow(index) % 2 === 1 ? 0 : -1)
			);
			const rightBottomTile = getCellByRowCol(
				getRow(index) + 1,
				getCol(index) + (getRow(index) % 2 === 1 ? 1 : 0)
			);
			if (
				getCol(leftTile) >= 0 &&
				getCol(leftTile) <= getCol(index) &&
				t[leftTile] !== undefined &&
				leftTile >= 0 &&
				leftTile < t.length
			) {
				t[leftTile].control = turn;
			}
			if (
				getCol(rightTile) !== getTilesPerRow() &&
				getCol(rightTile) >= getCol(index) &&
				t[rightTile] !== undefined &&
				rightTile >= 0 &&
				rightTile < t.length
			) {
				t[rightTile].control = turn;
			}
			if (
				(getRow(index) % 2 === 1 || getCol(index) > 0) &&
				t[leftTopTile] !== undefined &&
				leftTopTile >= 0 &&
				leftTopTile < t.length
			) {
				t[leftTopTile].control = turn;
			}
			if (
				(getRow(index) % 2 === 1 || getCol(index) > 0) &&
				t[leftBottomTile] !== undefined &&
				leftBottomTile >= 0 &&
				leftBottomTile < t.length
			) {
				t[leftBottomTile].control = turn;
			}
			console.log(
				getRow(index) % 2 === 0,
				getCol(index) < getTilesPerRow() - 1,
				t[rightTopTile] !== undefined,
				rightTopTile >= 0,
				rightTopTile < t.length
			);
			if (
				(getRow(index) % 2 === 0 || getCol(index) < getTilesPerRow() - 1) &&
				t[rightTopTile] !== undefined &&
				rightTopTile >= 0 &&
				rightTopTile < t.length
			) {
				t[rightTopTile].control = turn;
			}
			if (
				(getRow(index) % 2 === 0 || getCol(index) < getTilesPerRow() - 1) &&
				t[rightBottomTile] !== undefined &&
				rightBottomTile >= 0 &&
				rightBottomTile < t.length
			) {
				t[rightBottomTile].control = turn;
			}
		}
	};

	// helper functions
	const getTilesPerRow = useCallback(
		(w?: number) => Math.floor((w ?? width) / 128),
		[width]
	);

	const getRow = useCallback(
		(index: number) => Math.floor(index / getTilesPerRow()),
		[getTilesPerRow]
	);

	const getCol = useCallback(
		(index: number) => index % getTilesPerRow(),
		[getTilesPerRow]
	);
	const getCellByRowCol = useCallback(
		(row: number, col: number) => row * getTilesPerRow() + col,
		[getTilesPerRow]
	);

	// check if a cell should be selectable
	const isValid = useCallback(
		(
			index: number,
			destroy: boolean,
			firstTileSelected: boolean,
			turn: 'player1' | 'player2',
			tiles: Tile[]
		) => {
			const leftTile = getCellByRowCol(getRow(index), getCol(index) - 1);
			const rightTile = getCellByRowCol(getRow(index), getCol(index) + 1);
			const leftTopTile = getCellByRowCol(
				getRow(index) - 1,
				getCol(index) + (getRow(index) % 2 === 1 ? 0 : -1)
			);
			const rightTopTile = getCellByRowCol(
				getRow(index) - 1,
				getCol(index) + (getRow(index) % 2 === 1 ? 1 : 0)
			);
			const leftBottomTile = getCellByRowCol(
				getRow(index) + 1,
				getCol(index) + (getRow(index) % 2 === 1 ? 0 : -1)
			);
			const rightBottomTile = getCellByRowCol(
				getRow(index) + 1,
				getCol(index) + (getRow(index) % 2 === 1 ? 1 : 0)
			);
			if (
				destroy &&
				tiles[index].control !== turn &&
				tiles[index].control !== 'neutral'
			) {
				return true;
			} else if (!firstTileSelected && tiles[index]?.control === 'neutral') {
				return true;
			} else if (
				tiles[index]?.control !== 'neutral' ||
				tiles[index]?.control === turn
			) {
				return false;
			} else if (
				getCol(leftTile) >= 0 &&
				getCol(leftTile) <= getCol(index) &&
				tiles[leftTile]?.control === turn &&
				!destroy
			) {
				return true;
			} else if (
				getCol(rightTile) !== getTilesPerRow() &&
				getCol(rightTile) >= getCol(index) &&
				tiles[rightTile]?.control === turn &&
				!destroy
			) {
				return true;
			} else if (
				(getRow(index) % 2 === 1 || getCol(index) > 0) &&
				tiles[leftTopTile]?.control === turn &&
				!destroy
			) {
				return true;
			} else if (
				(getRow(index) % 2 === 1 || getCol(index) > 0) &&
				tiles[leftBottomTile]?.control === turn &&
				!destroy
			) {
				return true;
			} else if (
				(getRow(index) % 2 === 0 || getCol(index) < getTilesPerRow() - 1) &&
				tiles[rightTopTile]?.control === turn &&
				!destroy
			) {
				return true;
			} else if (
				(getRow(index) % 2 === 0 || getCol(index) < getTilesPerRow() - 1) &&
				tiles[rightBottomTile]?.control === turn &&
				!destroy
			) {
				return true;
			} else {
				return false;
			}
		},
		[getCellByRowCol, getCol, getRow, getTilesPerRow]
	);

	// helper method
	const computeIsValid = useCallback(
		(t: Tile[]) =>
			t.map((tile, index) => ({
				...tile,
				valid: isValid(index, destroy, firstTileSelected, turn, tiles),
			})),
		[isValid, tiles, turn, firstTileSelected, destroy]
	);

	/**
	 * Init tiles
	 */
	useEffect(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			setWidth(entries[0].contentRect.width);
			const tilesPerRow = getTilesPerRow(entries[0].contentRect.width);
			setTiles((t) =>
				t?.length === 0
					? [
							...new Array(
								(Math.floor(entries[0].contentRect.height / 100) + 1) *
									tilesPerRow
							),
					  ].map((i) => ({
							...new Tile(),
							valid: isValid(i, destroy, firstTileSelected, turn, tiles),
					  }))
					: computeIsValid(t)
			);
		});

		if (ref.current) {
			resizeObserver.observe(ref.current);
		}

		return () => resizeObserver.disconnect();
	}, [
		ref,
		getTilesPerRow,
		computeIsValid,
		isValid,
		firstTileSelected,
		tiles,
		turn,
		destroy,
	]);

	return (
		<div className={styles.game} ref={ref}>
			{winner && (
				<div className={styles.popup}>
					<h2>
						{winner === 'player1'
							? 'Player 1 wins!'
							: winner === 'player2'
							? 'Player 2 wins!'
							: 'Tie!'}
					</h2>
				</div>
			)}
			<div className={styles.header}>
				<div className={`${styles.turn} ${styles[turn]}`}>
					<h1>{turn === 'player1' ? 'Player 1' : 'Player 2'}</h1>
					<div className={`${styles.progressbar}`}>
						<div
							className={`${styles['progressbar-section']} ${styles.player1}`}
							style={{
								width: `${
									(100 *
										tiles.filter((tile) => tile.control === 'player1').length) /
									tiles.length
								}%`,
							}}
						>
							{tiles.filter((tile) => tile.control === 'player1').length}
						</div>
						<div
							className={`${styles['progressbar-section']} ${styles.neutral}`}
							style={{
								width: `${
									(100 *
										tiles.filter((tile) => tile.control === 'neutral').length) /
									tiles.length
								}%`,
							}}
						>
							{tiles.filter((tile) => tile.control === 'neutral').length}
						</div>
						<div
							className={`${styles['progressbar-section']} ${styles.player2}`}
							style={{
								width: `${
									(100 *
										tiles.filter((tile) => tile.control === 'player2').length) /
									tiles.length
								}%`,
							}}
						>
							{tiles.filter((tile) => tile.control === 'player2').length}
						</div>
					</div>
					<p className={`${styles.powerup}`}>
						Powerup:{' '}
						{powerup
							.split(' ')
							.map((w) => w[0]?.toUpperCase() + w.substring(1).toLowerCase())
							.join(' ')}
					</p>
				</div>
			</div>
			<div className={styles.container}>
				{tiles.map((tile, index) => {
					return (
						<div
							key={index + tile.control}
							className={`${styles.tile} ${
								firstTileSelected &&
								tile.control !== 'neutral' &&
								tile.powerup !== 'none'
									? styles.powerupTile
									: ''
							} ${styles[tile.control]} ${
								!isValid(index, destroy, firstTileSelected, turn, tiles)
									? styles.invalid
									: ''
							}`}
							onClick={() => tileControlled(index)}
						>
							<p>
								({getRow(index)}, {getCol(index)})
							</p>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Game;
