import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';
import './global.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const rubik = Rubik({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Control',
	description: 'SENG 513 - A3 - Zeyad Omran - 30096692',
};

/**
 * Shared layout for all pages
 */
const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html lang="en">
			<body className={rubik.className}>
				<Navbar />
				{children}
				<Footer />
			</body>
		</html>
	);
};

export default RootLayout;
