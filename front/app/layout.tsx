import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import ClientProviders from './client-providers';
import DrawerOverlay from './components/DrawerOverlay';
import Footer from './components/Footer';
import Header from './components/Header';
import NavMenu from './components/NavMenu';
import './globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Abricot.co',
	description: 'SaaS de gestion de projet collaboratif',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='fr' data-theme='abricot'>
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				{/* Input toggle doit être directement sous body */}
				<h1 className='hidden'>Abricot</h1>
				<ClientProviders>
					<div className='drawer drawer-mobile h-full'>
						<input id='drawer-toggle' type='checkbox' className='drawer-toggle' aria-label='Menu de navigation' />
						<div className='drawer-content flex flex-col'>
							<Header />
							{children}
							<Footer />
						</div>

						<div className='drawer-side'>
							<DrawerOverlay />
							<div className='p-4 w-64 h-full bg-base-200 text-base-content'>
								<NavMenu vertical />
							</div>
						</div>
					</div>
				</ClientProviders>
			</body>
		</html>
	);
}
