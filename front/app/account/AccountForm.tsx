'use client';

import { useAuth } from '@front/context/AuthContext';
import { useNotification } from '@front/context/NotificationContext';
import { updatePassword, updateProfile } from '@front/services/userService';
import { useMemo, useState } from 'react';
import styles from './Account.module.css';

export default function AccountForm() {
	const { user } = useAuth();
	const { showSuccess, showError } = useNotification();

	const initialValues = useMemo(() => {
		const parts = user?.name?.split(' ') ?? [];
		return {
			firstName: parts[0] ?? '',
			lastName: parts.slice(1).join(' '),
			email: user?.email ?? '',
		};
	}, [user]);

	const [lastName, setLastName] = useState(initialValues.lastName);
	const [firstName, setFirstName] = useState(initialValues.firstName);
	const [email, setEmail] = useState(initialValues.email);
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState<{ newPassword?: string }>({});

	const validateForm = (): boolean => {
		const newErrors: { newPassword?: string } = {};

		if (currentPassword && !newPassword) {
			newErrors.newPassword = 'Veuillez saisir un nouveau mot de passe';
		}
		if (newPassword && !currentPassword) {
			newErrors.newPassword = 'Veuillez saisir le mot de passe actuel';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);

		try {
			const name = `${firstName} ${lastName}`.trim();
			const profileUpdated = await updateProfile({ name, email });

			if (!profileUpdated) {
				showError('Erreur lors de la mise à jour du profil');
				return;
			}

			if (currentPassword && newPassword) {
				const passwordUpdated = await updatePassword({
					currentPassword,
					newPassword,
				});

				if (!passwordUpdated) {
					showError('Erreur lors de la mise à jour du mot de passe');
					return;
				}

				setCurrentPassword('');
				setNewPassword('');
			}

			showSuccess('Profil mis à jour avec succès');
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Erreur lors de la mise à jour';
			showError(message);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div className={`${styles['page-content']} max-md:flex-col px-25 flex justify-center items-center`}>
			<div className='card card-border border-gray-200 w-full bg-base-200'>
				<div className='card-body'>
					<h3 className='card-title'>Mon compte</h3>
					<p className='text-base mb-4'>
						{firstName} {lastName}
					</p>

					<form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full'>
						<fieldset className='fieldset'>
							<label className='label text-black' htmlFor='lastName'>
								Nom
							</label>
							<input
								id='lastName'
								type='text'
								className='input input-bordered'
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
							/>
						</fieldset>

						<fieldset className='fieldset'>
							<label className='label text-black' htmlFor='firstName'>
								Prénom
							</label>
							<input
								id='firstName'
								type='text'
								className='input input-bordered'
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
							/>
						</fieldset>

						<fieldset className='fieldset'>
							<label className='label text-black' htmlFor='email'>
								Email
							</label>
							<input id='email' type='text' className='input input-bordered' value={email} onChange={(e) => setEmail(e.target.value)} />
						</fieldset>

						<fieldset className='fieldset'>
							<label htmlFor='currentPassword' className='label text-black'>
								Mot de passe actuel
							</label>
							<input
								id='currentPassword'
								type='password'
								className='input input-bordered'
								value={currentPassword}
								onChange={(e) => setCurrentPassword(e.target.value)}
							/>
						</fieldset>

						<fieldset className='fieldset'>
							<label htmlFor='newPassword' className='label text-black'>
								Nouveau mot de passe
							</label>
							<input
								id='newPassword'
								type='password'
								className={`input input-bordered ${errors.newPassword ? 'input-error' : ''}`}
								value={newPassword}
								onChange={(e) => {
									setNewPassword(e.target.value);
									if (errors.newPassword) setErrors({});
								}}
							/>
							{errors.newPassword && <span className='text-error-content text-sm'>{errors.newPassword}</span>}
						</fieldset>

						<button
							className='btn self-start bg-black text-white mt-2 text-[14px] py-7 px-8 font-normal'
							type='submit'
							disabled={isSubmitting}>
							{isSubmitting ? <span className='loading loading-spinner loading-sm'></span> : 'Modifier les informations'}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
