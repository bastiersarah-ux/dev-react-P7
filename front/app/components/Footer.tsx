'use client';

import { useAuth } from '@front/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
	const { isAuthenticated } = useAuth();

	if (!isAuthenticated) return null;

	return (
		<footer className='footer footer-center bg-base-200 h-17 p-4'>
			<div className='md:place-self-center md:justify-self-start'>
				<Image className={styles.img} src='/logo-noir.svg' alt='Logo Abricot noir' width={101} height={12.86} />
			</div>
			<div className='md:place-self-center md:justify-self-end'>
				<Link className={styles.link} href='#'>
					Abricot 2025
				</Link>
			</div>
		</footer>
	);
};

export default Footer;
