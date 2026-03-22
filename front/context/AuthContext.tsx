'use client';

import { fetchAPI } from '@front/services/fetch-api';
import { User } from '@front/types/api-types';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

/** Type du contexte d'authentification */
type AuthContextType = {
	user: User | null;
	login: (userData: User) => void;
	logout: () => Promise<void>;
	refreshUser: () => Promise<void>;
	isAuthenticated: boolean;
	isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Provider pour gérer l'authentification */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();
	const pathname = usePathname();

	const fetchUser = async () => {
		try {
			setIsLoading(true);
			const res = await fetchAPI<{ user: User }>('/auth/profile');
			if (res?.user) {
				setUser(res.user);
			} else {
				setUser(null);
			}
		} catch (error) {
			console.error('Erreur de récupération du profil:', error);
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		// Ne pas appeler le profil sur les pages d'auth
		if (pathname?.startsWith('/auth/')) {
			setIsLoading(false);
			return;
		}
		fetchUser();
	}, [pathname]);

	const login = (userData: User) => {
		setUser(userData);
	};

	const logout = async () => {
		try {
			await fetch('/api/auth/logout', { method: 'POST' });
		} catch (error) {
			console.error('Erreur lors de la déconnexion:', error);
		} finally {
			setUser(null);
			router.push('/auth/login');
		}
	};

	const isAuthenticated = !!user;

	/** Rafraîchit les données utilisateur depuis l'API */
	const refreshUser = async () => {
		await fetchUser();
	};

	return <AuthContext.Provider value={{ user, login, logout, refreshUser, isAuthenticated, isLoading }}>{children}</AuthContext.Provider>;
};

/** Hook pour accéder au contexte d'auth */
export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) throw new Error('useAuth doit être utilisé à l’intérieur d’un AuthProvider.');
	return context;
};
