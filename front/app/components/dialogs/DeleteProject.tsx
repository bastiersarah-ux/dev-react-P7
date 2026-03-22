'use client';

import { useNotification } from '@front/context/NotificationContext';
import { deleteProject } from '@front/services/projectsService';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/** Props de la modale suppression projet */
type DeleteProjectProps = {
	projectId: string;
	projectName: string;
};

/** Modale de suppression d'un projet */
export default function DeleteProject({ projectId, projectName }: DeleteProjectProps) {
	const router = useRouter();
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [isLoading, setIsLoading] = useState(false);
	const { showSuccess, showError } = useNotification();

	const showModal = () => {
		dialogRef.current?.showModal();
	};

	const closeModal = () => {
		dialogRef.current?.close();
	};

	const handleConfirm = async () => {
		setIsLoading(true);
		try {
			await deleteProject(projectId);
			showSuccess('Projet supprimé avec succès');
			closeModal();
			router.push('/projects');
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
				<h3 className='font-bold text-lg'>Supprimer le projet</h3>
				<p className='py-4'>
					Êtes-vous sûr de vouloir supprimer le projet <strong>{projectName}</strong> ? Cette action est irréversible.
				</p>
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
			<button className='btn btn-link text-error-content font-normal px-4 py-1' onClick={showModal}>
				Supprimer
			</button>
			{typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent}
		</>
	);
}
