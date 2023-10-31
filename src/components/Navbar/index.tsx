'use client';
import { useState } from 'react';
import styles from './Navbar.module.css';

const Navbar = () => {
	const [showRules, setShowRules] = useState(false);

	return (
		<>
			<nav className={styles.nav}>
				<div className={styles.logoContainer}>
					<h1 className={styles.logo}>Control</h1>
				</div>
				<ul className={styles.actionsContainer}>
					<li
						className={`${styles.action} ${showRules ? styles.active : ''}`}
						onClick={() => setShowRules(!showRules)}
					>
						How to play
					</li>
				</ul>
			</nav>
			{showRules && (
				<div className={styles.popup}>
					<h2>Rules</h2>
					<ul>
						<li>Click on a tile when it is your turn.</li>
						<li>
							You can only select a tile if it neighbors one of your controlled
							tiles. &#40;1 tile away in all directions&#41;
						</li>
						<li>
							You can select the other player&apos;s tile, however there will be
							a random challenge to complete for a successful takeover.
						</li>
						<li>
							Once all tiles are selected, the player with the most tiles wins.
						</li>
						<li>If a player has no valid moves, they lose.</li>
					</ul>
				</div>
			)}
		</>
	);
};

export default Navbar;
