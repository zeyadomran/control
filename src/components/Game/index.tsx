'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './Game.module.css';

class Tile {
	control: 'neutral' | 'player1' | 'player2';
	constructor() {
		this.control = 'neutral';
	}
}
const Game = () => {
	const [tiles, setTiles] = useState<Tile[]>([]);
	const [turn, setTurn] = useState<'player1' | 'player2'>('player1');

	/**
	 * Change who controls a tile and switch player turns
	 * @param index the index of the clicked tile
	 */
	const tileControlled = (index: number) => {
		setTiles((t) => {
			t[index].control = turn;
			return t;
		});
		setTurn((t) => (t === 'player1' ? 'player2' : 'player1'));
	};

	/**
	 * Init tiles
	 */
	useEffect(() => {
		setTiles([...new Array(100)].map(() => new Tile()));
	}, []);

	return (
		<div className={styles.game}>
			<div className={styles.header}>
				<div className={styles.turn}>
					<div className={`${styles[turn]} ${styles.display}`}></div>
					<h1>{turn === 'player1' ? 'Player 1' : 'Player 2'}</h1>
				</div>
				<div className={styles.score}>
					<p>
						Player 1 tiles:{' '}
						{tiles.filter((tile) => tile.control === 'player1').length}/
						{tiles.length}
					</p>
					<p>
						Player 2 tiles:{' '}
						{tiles.filter((tile) => tile.control === 'player2').length}/
						{tiles.length}
					</p>
				</div>
			</div>
			<div className={styles.container}>
				{tiles.map((tile, index) => {
					return (
						<div
							key={index}
							className={`${styles.tile} ${styles[tile.control]}`}
							onClick={() => tileControlled(index)}
						>
							<p>{tile.control === 'player1' ? 'Player 1' : 'Player 2'}</p>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Game;
