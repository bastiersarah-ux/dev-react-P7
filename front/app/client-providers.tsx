'use client';

import { AuthProvider } from '@front/context/AuthContext';
import { NotificationProvider } from '@front/context/NotificationContext';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
	return (
		<NotificationProvider>
			<AuthProvider>{children}</AuthProvider>
		</NotificationProvider>
	);
}
