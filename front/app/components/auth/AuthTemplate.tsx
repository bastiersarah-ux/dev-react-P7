'use client';

import { useAuth } from '@front/context/AuthContext';
import { useNotification } from '@front/context/NotificationContext';
import AbricotIcon from '@front/public/logo-abricot.svg';
import { fetchAPI, ValidationError } from '@front/services/fetch-api';
import { LoginForm, RegisterForm, TokenResponse } from '@front/types/api-types';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './AuthTemplate.module.css';

type AuthTemplateProps = {
	isLogin: boolean;
};

type FieldErrors = Record<string, string>;

export default function AuthTemplate({ isLogin }: AuthTemplateProps) {
	const router = useRouter();
	const { login, isAuthenticated } = useAuth();
	const { showError } = useNotification();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

	useEffect(() => {
		if (isAuthenticated) {
			router.replace('/dashboard');
		}
	}, [isAuthenticated, router]);

	async function handleSubmit(e: React.SubmitEvent) {
		e.preventDefault();
		setFieldErrors({});

		if (![null, undefined, ''].includes(email?.trim()) && ![null, undefined, ''].includes(password?.trim())) {
			try {
				const endpoint = isLogin ? '/auth/login' : '/auth/register';
				const body = isLogin ? ({ email, password } as LoginForm) : ({ email, password, name: '' } as RegisterForm);

				const res = await fetchAPI<TokenResponse>(endpoint, {
					method: 'POST',
					body: JSON.stringify(body),
				});

				if (res) {
					login(res.user);
				}
			} catch (error) {
				if (error instanceof ValidationError) {
					const errors: FieldErrors = {};
					error.errors.forEach((err) => {
						errors[err.field] = err.message;
					});
					setFieldErrors(errors);
				} else if (error instanceof Error) {
					showError(error.message);
				}
			}
		}
	}

	return (
		<div className={`${styles['page-content']} max-md:flex-col`}>
			<section className={styles['left-section']}>
				<Image src={AbricotIcon} alt='Logo Abricot' width={252.57} height={32.17} />
				<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
					<h1>{isLogin ? 'Connexion' : 'Inscription'}</h1>

					<fieldset className='fieldset'>
						<label className='label' htmlFor='email'>
							Email
						</label>
						<input
							id='email'
							type='text'
							className={`input ${fieldErrors.email ? 'input-error' : ''}`}
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
								if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
							}}
						/>
						{fieldErrors.email && <span className='text-error-content text-sm'>{fieldErrors.email}</span>}
					</fieldset>

					<fieldset className='fieldset'>
						<label htmlFor='password' className='label'>
							Mot de passe
						</label>
						<input
							id='password'
							className={`input ${fieldErrors.password ? 'input-error' : ''}`}
							type='password'
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
								if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
							}}
						/>
						{fieldErrors.password && <span className='text-error-content text-sm'>{fieldErrors.password}</span>}
					</fieldset>

					<button className='btn btn-gray' type='submit'>
						{isLogin ? 'Se connecter' : "S'inscrire"}
					</button>
					{isLogin && <Link href='#'>Mot de passe oublié ?</Link>}
				</form>
				<p className='flex gap-2'>
					{isLogin ? (
						<>
							Pas encore de compte ?<Link href='/auth/register'>Créer un compte</Link>
						</>
					) : (
						<>
							Déjà inscrit ?<Link href='/auth/login'>Se connecter</Link>
						</>
					)}
				</p>
			</section>

			<section className={styles['right-section']}>
				<Image src='/connexion.jpg' alt='Image connexion' className={styles['img']} fill />
			</section>
		</div>
	);
}
