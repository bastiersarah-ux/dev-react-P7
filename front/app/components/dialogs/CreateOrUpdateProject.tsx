'use client';

import { useAuth } from '@front/context/AuthContext';
import { useNotification } from '@front/context/NotificationContext';
import { addContributor, createProject, removeContributor, updateProject } from '@front/services/projectsService';
import { updateTaskById } from '@front/services/taskService';
import { Project, ProjectInput, Task, User } from '@front/types/api-types';
import { useRouter } from 'next/navigation';
import { SubmitEvent, useEffect, useMemo, useState } from 'react';
import UserSelector from '../users/UserSelector';

/** Props de la modale projet */
type CreateOrUpdateProjectProp = {
	projectToEdit?: Project | null;
	projectTasks?: Task[] | null;
};

/** Modale pour créer ou modifier un projet */
export default function CreateOrUpdateProject({ projectToEdit, projectTasks }: CreateOrUpdateProjectProp) {
	const router = useRouter();
	const { user } = useAuth();
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

				// Si un contributeur supprimé est affecté à des tâches alors on le désaffecte automatiquement de ces dernières
				const tasksToUpdate = (projectTasks ?? []).filter((t) => t.assignees?.some((a) => toRemove.map((u) => u.id).includes(a.user!.id)));
				for (const task of tasksToUpdate) {
					const assigneesIds = task.assignees?.map((t) => t.user!.id).filter((id) => !toRemove.map((u) => u.id).includes(id)) ?? [];
					await updateTaskById(projectToEdit.id, task.id, {
						...task,
						assigneeIds: assigneesIds,
						dueDate: new Date(task.dueDate!).toISOString(),
					});
				}

				for (const user of toAdd) {
					await addContributor(projectToEdit.id, {
						email: user.email,
						role: 'CONTRIBUTOR',
					});
				}

				showSuccess('Projet modifié avec succès');
				router.refresh();
			} else {
				const input: ProjectInput = {
					name: title,
					description,
					contributors: [],
				};

				const res = await createProject(input);
				if (!res) {
					showError("Erreur lors de l'enregistrement du projet");
					return;
				}

				// Le créateur du projet devient automatiquement ADMIN
				await addContributor(res.id, { email: user!.email, role: 'ADMIN' });
				for (const member of selectedUsers) {
					await addContributor(res.id, { email: member.email, role: 'CONTRIBUTOR' });
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
				className={`btn ${isEditMode ? 'btn-link text-primary' : 'btn-black h-14!'} font-normal px-8 py-5 rounded-[10px]`}
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

					<h2 className='font-bold text-lg mb-4'>{isEditMode ? 'Modifier un projet' : 'Créer un projet'}</h2>

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

							<UserSelector selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} label='Contributeurs' />

							<div className='modal-action justify-start'>
								<button type='submit' className='btn btn-primary btn-outline  text-lg font-normal px-15 py-7' disabled={isSubmitting}>
									{projectToEdit ? 'Enregistrer' : 'Ajouter un projet'}
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
