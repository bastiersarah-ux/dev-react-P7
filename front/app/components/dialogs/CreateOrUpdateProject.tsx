'use client';

import { useNotification } from '@front/context/NotificationContext';
import { addContributor, createProject, removeContributor, updateProject } from '@front/services/projectsService';
import { Project, ProjectInput, User } from '@front/types/api-types';
import { useRouter } from 'next/navigation';
import { SubmitEvent, useEffect, useMemo, useState } from 'react';
import UserSelector from '../users/UserSelector';

type CreateOrUpdateProjectProp = {
	projectToEdit?: Project | null;
};

export default function CreateOrUpdateProject({ projectToEdit }: CreateOrUpdateProjectProp) {
	const router = useRouter();
	const { showSuccess, showError } = useNotification();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const initialMembers = useMemo(() => {
		return (
			projectToEdit?.members
				?.filter((m) => m.role !== 'OWNER')
				.map((m) => m.user!)
				.filter(Boolean) ?? []
		);
	}, [projectToEdit]);

	const myModal = () => document.querySelector<HTMLDialogElement>('#' + id);

	const resetForm = () => {
		if (projectToEdit) {
			setTitle(projectToEdit.name);
			setDescription(projectToEdit.description || '');
			setSelectedUsers(initialMembers);
		} else {
			setTitle('');
			setDescription('');
			setSelectedUsers([]);
		}
	};

	const showModal = () => {
		myModal()?.showModal();
	};

	const dismissModal = (shouldReset = true) => {
		if (shouldReset) resetForm();
		myModal()?.close();
	};

	useEffect(() => {
		if (projectToEdit) {
			setTitle(projectToEdit.name);
			setDescription(projectToEdit.description || '');
		}
	}, [projectToEdit]);

	useEffect(() => {
		if (projectToEdit) {
			setTitle(projectToEdit.name);
			setDescription(projectToEdit.description || '');
			setSelectedUsers(initialMembers);
		}
	}, [projectToEdit, initialMembers]);

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			if (projectToEdit) {
				const input: ProjectInput = {
					name: title,
					description,
				};

				const res = await updateProject(projectToEdit.id, input);
				if (!res) {
					showError("Erreur lors de l'enregistrement du projet");
					return;
				}

				const toRemove = initialMembers.filter((m) => !selectedUsers.some((s) => s.id === m.id));
				const toAdd = selectedUsers.filter((s) => !initialMembers.some((m) => m.id === s.id));

				for (const user of toRemove) {
					await removeContributor(projectToEdit.id, user.id);
				}

				for (const user of toAdd) {
					await addContributor(projectToEdit.id, {
						userId: parseInt(user.id),
						projectId: parseInt(projectToEdit.id),
						email: user.email,
						name: user.name,
						role: 'CONTRIBUTOR',
					});
				}

				showSuccess('Projet modifié avec succès');
				router.refresh();
			} else {
				const input: ProjectInput = {
					name: title,
					description,
					contributors: selectedUsers.map((user) => user.email) ?? [],
				};

				const res = await createProject(input);
				if (!res) {
					showError("Erreur lors de l'enregistrement du projet");
					return;
				}

				showSuccess('Projet créé avec succès');
				router.push(`/projects/${res.id}`);
			}

			dismissModal(false);
			resetForm();
		} catch (error) {
			const message = error instanceof Error ? error.message : "Erreur lors de l'enregistrement du projet";
			showError(message);
		} finally {
			setIsSubmitting(false);
		}
	};

	const isEditMode = !!projectToEdit;
	const id = projectToEdit ? `project-modal-${projectToEdit.id}` : 'project-modal-new';

	return (
		<>
			<button
				className={`btn ${isEditMode ? 'btn-link text-primary' : 'bg-black text-white h-12.5!'} font-normal px-4 py-1 rounded-[10px]`}
				onClick={showModal}>
				{isEditMode ? 'Modifier' : '+ Créer un projet'}
			</button>

			<dialog id={id} className='modal'>
				<div className='modal-box w-11/12 max-w-lg relative'>
					{isSubmitting && (
						<div className='absolute inset-0 z-10 flex items-center justify-center bg-neutral-500/50'>
							<span className='loading loading-spinner loading-lg text-white' aria-label='Enregistrement en cours' />
						</div>
					)}
					<form method='dialog'>
						<button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2' onClick={() => resetForm()}>
							✕
						</button>
					</form>

					<h3 className='font-bold text-lg mb-4'>{isEditMode ? 'Modifier un projet' : 'Créer un projet'}</h3>

					<form className='space-y-4' onSubmit={(e) => handleSubmit(e)}>
						<div className='form-control w-full'>
							<fieldset className='fieldset'>
								<legend className='fieldset-legend'>Titre*</legend>
								<input
									type='text'
									required
									className='input input-bordered w-full'
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									aria-label='Titre du projet'
								/>
							</fieldset>

							<fieldset className='fieldset'>
								<legend className='fieldset-legend'>Description*</legend>
								<input
									type='text'
									required
									className='input input-bordered w-full'
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									aria-label='Description du projet'
								/>
							</fieldset>

							<UserSelector selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />

							<div className='modal-action'>
								<button type='submit' className='btn btn-primary btn-outline' disabled={isSubmitting}>
									{projectToEdit ? 'Enregistrer' : '+ Ajouter un projet'}
								</button>
							</div>
						</div>
					</form>
				</div>

				<form method='dialog' className='modal-backdrop'>
					<button onClick={() => resetForm()}>close</button>
				</form>
			</dialog>
		</>
	);
}
