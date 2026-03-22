'use client';

import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

/** Types de notification possibles */
type NotificationType = 'success' | 'error' | 'warning' | 'info';

/** Structure d'une notification */
type Notification = {
	id: string;
	type: NotificationType;
	message: string;
};

/** Type du contexte de notification */
type NotificationContextType = {
	notifications: Notification[];
	showSuccess: (message: string) => void;
	showError: (message: string) => void;
	showWarning: (message: string) => void;
	showInfo: (message: string) => void;
	dismiss: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

/** Provider pour afficher des notifications toast */
export function NotificationProvider({ children }: { children: ReactNode }) {
	const [notifications, setNotifications] = useState<Notification[]>([]);

	const addNotification = useCallback((type: NotificationType, message: string) => {
		const id = Date.now().toString();
		setNotifications((prev) => [...prev, { id, type, message }]);

		// Auto-dismiss après 5 secondes
		setTimeout(() => {
			setNotifications((prev) => prev.filter((n) => n.id !== id));
		}, 5000);
	}, []);

	const dismiss = useCallback((id: string) => {
		setNotifications((prev) => prev.filter((n) => n.id !== id));
	}, []);

	const showSuccess = useCallback((message: string) => addNotification('success', message), [addNotification]);
	const showError = useCallback((message: string) => addNotification('error', message), [addNotification]);
	const showWarning = useCallback((message: string) => addNotification('warning', message), [addNotification]);
	const showInfo = useCallback((message: string) => addNotification('info', message), [addNotification]);

	return (
		<NotificationContext.Provider value={{ notifications, showSuccess, showError, showWarning, showInfo, dismiss }}>
			{children}
			<NotificationContainer notifications={notifications} onDismiss={dismiss} />
		</NotificationContext.Provider>
	);
}

/** Hook pour afficher des notifications */
export function useNotification() {
	const context = useContext(NotificationContext);
	if (!context) {
		throw new Error('useNotification doit être utilisé dans un NotificationProvider');
	}
	return context;
}

// Composant d'affichage des notifications
function NotificationContainer({ notifications, onDismiss }: { notifications: Notification[]; onDismiss: (id: string) => void }) {
	if (notifications.length === 0) return null;

	const alertClass: Record<NotificationType, string> = {
		success: 'alert-success',
		error: 'alert-error',
		warning: 'alert-warning',
		info: 'alert-info',
	};

	return (
		<div className='toast toast-top toast-end z-9999'>
			{notifications.map((notification) => (
				<div key={notification.id} className={`alert ${alertClass[notification.type]} shadow-lg`}>
					<span>{notification.message}</span>
					<button className='btn btn-ghost btn-xs' onClick={() => onDismiss(notification.id)}>
						✕
					</button>
				</div>
			))}
		</div>
	);
}
