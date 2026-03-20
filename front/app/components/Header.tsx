'use client';

import { useAuth } from '@front/context/AuthContext';
import Image from 'next/image';
import styles from './Header.module.css';
import NavMenu from './NavMenu';
import UserMenu from './users/UserMenu';

const Header = () => {
	const { isAuthenticated } = useAuth();

	if (!isAuthenticated) return <></>;

	return (
		<header className={styles.header}>
			<nav className='navbar bg-base-200 h-23.5'>
				<div className='navbar-start gap-4'>
					<label htmlFor='drawer-toggle' className='btn-drawer-toggle btn btn-ghost lg:hidden'>
						<svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
						</svg>
					</label>
					<Image className={styles.navbarStart} src='/logo-abricot.svg' alt='Logo Abricot' width={147} height={18.72} />
				</div>
				<div className='navbar-center max-lg:hidden'>
					<NavMenu />
				</div>
				<div className='navbar-end'>
					<UserMenu />
				</div>
			</nav>
		</header>
	);
};

export default Header;
