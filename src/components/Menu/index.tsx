import Link from 'next/link';
import styles from './Menu.module.css';

const Menu = () => {
	return (
		<div className={styles.container}>
			<Link href="/game" className={styles.button}>
				Start Game
			</Link>
		</div>
	);
};

export default Menu;
