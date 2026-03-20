'use client';

import { useAuth } from '@front/context/AuthContext';
import { getInitials } from '@front/services/userService';
import { User } from '@front/types/api-types';
import { UserButtonVariant } from '@front/types/props';
import styles from './UserInitialsButton.module.css';

type UserInitialsButtonProps = {
	user?: User;
	variant?: UserButtonVariant;
	showFull?: boolean;
	size?: string;
	fullNameAlt?: boolean;
};

export default function UserInitialsButton({ user, variant, showFull, size, fullNameAlt }: UserInitialsButtonProps) {
	const { user: currentUser } = useAuth();
	if (!currentUser || !user) return null;

	const cssClass = !!variant ? styles[`userIcon${variant}`] : '';
	const cssClassFull = variant == 'Variant2' ? styles[`userIcon${variant}`] : '';

	const fullName = currentUser.id == user.id && showFull && fullNameAlt ? 'Propriétaire' : user.name;

	if (showFull) {
		return (
			<div
				className={`flex flex-wrap items-center gap-3 justify-center h-full text-inherit`}
				style={{ '--initial-size': size ?? '100%' } as React.CSSProperties}>
				<span className={`btn btn-circle border-none ${styles.initial} ${styles.userIcon} ${cssClass} h-full`}>
					{getInitials(user!.name ?? '')}
				</span>
				<span className={`btn btn-circle border-none ${styles.userIcon} w-auto px-5 ${cssClassFull} capitalize! h-full`}>{fullName}</span>
			</div>
		);
	}

	return (
		<span
			style={{ '--initial-size': size ?? '100%' } as React.CSSProperties}
			className={`btn btn-circle border-none ${styles.initial} ${styles.userIcon} ${cssClass} h-full`}>
			{getInitials(user!.name ?? '')}
		</span>
	);
}
