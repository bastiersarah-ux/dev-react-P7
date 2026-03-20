'use client';

import { useNotification } from '@front/context/NotificationContext';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type ConfirmDeleteProps = {
	title: string;
	message: string;
	onConfirm: () => Promise<void> | void;
};

export default function ConfirmDelete({ title, message, onConfirm }: ConfirmDeleteProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [isLoading, setIsLoading] = useState(false);
	const { showError } = useNotification();

	const showModal = () => {
		dialogRef.current?.showModal();
	};

	const closeModal = () => {
		dialogRef.current?.close();
	};

	const handleConfirm = async () => {
		setIsLoading(true);
		try {
			await onConfirm();
			closeModal();
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Erreur lors de la suppression';
			showError(message);
		} finally {
			setIsLoading(false);
		}
	};

	const modalContent = (
		<dialog ref={dialogRef} className='modal'>
			<div className='modal-box relative'>
				{isLoading && (
					<div className='absolute inset-0 z-10 flex items-center justify-center bg-neutral-500/50 rounded-2xl'>
						<span className='loading loading-spinner loading-lg text-white' aria-label='Suppression en cours' />
					</div>
				)}
				<h3 className='font-bold text-lg'>{title}</h3>
				<p className='py-4'>{message}</p>
				<div className='modal-action'>
					<button className='btn' onClick={closeModal} disabled={isLoading}>
						Annuler
					</button>
					<button className='btn btn-error' onClick={handleConfirm} disabled={isLoading}>
						Supprimer
					</button>
				</div>
			</div>
			<form method='dialog' className='modal-backdrop'>
				<button disabled={isLoading}>close</button>
			</form>
		</dialog>
	);

	return (
		<>
			<button className='p-4 text-left w-full' onClick={showModal}>
				Supprimer
			</button>
			{typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent}
		</>
	);
}
