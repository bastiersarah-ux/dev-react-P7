'use client';

import { useNotification } from '@front/context/NotificationContext';
import DeleteIcon from '@front/public/delete.svg';
import EditIcon from '@front/public/edit.svg';
import OrangeStarIcon from '@front/public/orange-star.svg';
import StarIcon from '@front/public/star.svg';
import { addTask } from '@front/services/taskService';
import { TaskInput, TaskStatus, User } from '@front/types/api-types';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import TaskForm from '../tasks/TaskForm';

/** Props du générateur de tâches IA */
type ListAiTaskProp = {
	contributors?: User[];
	projectId: string;
	onSuccess?: () => void;
};

/** Modale pour générer des tâches avec l'IA */
export default function ListAiTask({ contributors = [], projectId, onSuccess }: ListAiTaskProp) {
	const { showSuccess, showError } = useNotification();
	const [prompt, setPrompt] = useState('');
	const [generated, setGenerated] = useState<TaskInput[]>([]);
	const [isGenerating, setIsGenerating] = useState(false);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);

	// États pour le formulaire d'édition
	const [editTitle, setEditTitle] = useState('');
	const [editDescription, setEditDescription] = useState('');
	const [editDueDate, setEditDueDate] = useState('');
	const [editStatus, setEditStatus] = useState<TaskStatus | null>(null);
	const [editSelectedUsers, setEditSelectedUsers] = useState<User[]>([]);

	const myModal = () => document.querySelector<HTMLDialogElement>('#ai_task_modal');

	const showModal = () => {
		myModal()?.showModal();
	};

	const dismissModal = () => {
		myModal()?.close();
	};

	const randomFrom = <T,>(items: T[], seed: number, offset: number) => (items.length ? items[(seed + offset) % items.length] : undefined);

	const makeDueDate = (offsetDays: number) => {
		const date = new Date();
		date.setDate(date.getDate() + offsetDays);
		return date.toISOString();
	};

	// Reset form when the dialog closes (via ✕ button or backdrop)
	useEffect(() => {
		const modal = myModal();
		if (!modal) return;

		const handleClose = () => {
			setPrompt('');
			setGenerated([]);
			setIsGenerating(false);
			setEditingIndex(null);
		};

		modal.addEventListener('close', handleClose);
		return () => modal.removeEventListener('close', handleClose);
	}, []);

	/** Ouvre le formulaire d'édition pour une tâche */
	const startEditing = (idx: number) => {
		const task = generated[idx];
		setEditTitle(task.title || '');
		setEditDescription(task.description || '');
		setEditDueDate(task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : '');
		setEditStatus(task.status || null);
		// Récupère les users correspondant aux IDs assignés
		const assignedUsers = contributors.filter((c) => task.assigneeIds?.includes(c.id));
		setEditSelectedUsers(assignedUsers);
		setEditingIndex(idx);
	};

	/** Sauvegarde les modifications d'une tâche */
	const saveEditing = () => {
		if (editingIndex === null) return;
		const updatedTasks = [...generated];
		updatedTasks[editingIndex] = {
			...updatedTasks[editingIndex],
			title: editTitle,
			description: editDescription,
			dueDate: editDueDate ? new Date(editDueDate).toISOString() : undefined,
			status: editStatus || 'TODO',
			assigneeIds: editSelectedUsers.map((u) => u.id),
		};
		setGenerated(updatedTasks);
		setEditingIndex(null);
	};

	/** Annule l'édition */
	const cancelEditing = () => {
		setEditingIndex(null);
	};

	const handleGenerate = () => {
		if (isGenerating) return;
		setIsGenerating(true);
		const baseSeed = Date.now() % 1000; // generated only on button click (client-side)

		const themes = ['Refactor', 'Documentation', 'Monitoring', 'UX polish', 'Performance', 'Tests', 'Security', 'Data cleanup', 'Release prep'];
		const actions = ['Ajouter', 'Finaliser', 'Corriger', 'Mettre à jour', 'Valider', 'Mesurer', 'Automatiser', 'Revoir', 'Nettoyer'];
		const priorities: TaskInput['priority'][] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
		const statuses: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

		// Simulate async generation latency
		setTimeout(() => {
			const generatedTasks: TaskInput[] = Array.from({ length: 3 }).map((_, i) => {
				const theme = randomFrom(themes, baseSeed, i) ?? 'Tâche';
				const action = randomFrom(actions, baseSeed, i * 7) ?? 'Ajouter';
				const priority = randomFrom(priorities, baseSeed, i * 11);
				const status = randomFrom(statuses, baseSeed, i * 13);
				const dueDate = makeDueDate(2 + i);

				const selectedContributors = contributors
					.slice()
					.sort((a, b) => ((a.id ?? '').toString() + baseSeed).localeCompare((b.id ?? '').toString() + baseSeed))
					.slice(0, Math.min(2, contributors.length))
					.map((c) => c.id);

				return {
					title: `${action} ${theme}`.trim(),
					description: `Tâche auto-générée pour ${theme.toLowerCase()}.`,
					priority,
					status,
					dueDate,
					assigneeIds: selectedContributors,
				};
			});

			setGenerated(generatedTasks);
			setIsGenerating(false);
		}, 800);
	};

	const handleAddTask = async () => {
		setIsGenerating(true);
		try {
			await Promise.all(generated.map((task) => addTask(projectId, task)));
			showSuccess(`${generated.length} tâche(s) créée(s) avec succès`);
			onSuccess?.();
			dismissModal();
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Erreur lors de la création des tâches';
			showError(message);
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<>
			<button className='btn btn-primary py-7 px-6' onClick={showModal}>
				<Image src={StarIcon} alt='' width={21} height={21} aria-hidden='true' />
				IA
			</button>

			<dialog id='ai_task_modal' className='modal'>
				<div className='modal-box w-11/12 max-w-xl relative'>
					{isGenerating && (
						<div className='absolute inset-0 z-10 flex items-center justify-center bg-neutral-500/50'>
							<span className='loading loading-spinner loading-lg text-white' aria-label='Génération en cours' />
						</div>
					)}
					<form method='dialog'>
						<button className='btn btn-sm btn-circle btn-ghost absolute right-3 top-3'>✕</button>
					</form>

					<div className='flex items-center gap-2 mb-6'>
						<Image src={OrangeStarIcon} alt='' width={21} height={21} aria-hidden='true' />
						<h2 className='font-bold text-lg'>
							{editingIndex !== null ? 'Modifier la tâche' : generated.length > 0 ? 'Vos tâches...' : 'Créer une tâche'}
						</h2>
					</div>

					{/* Formulaire d'édition */}
					{editingIndex !== null ? (
						<div className='mb-6'>
							<TaskForm
								title={editTitle}
								setTitle={setEditTitle}
								description={editDescription}
								setDescription={setEditDescription}
								dueDate={editDueDate}
								setDueDate={setEditDueDate}
								status={editStatus}
								setStatus={setEditStatus}
								selectedUsers={editSelectedUsers}
								setSelectedUsers={setEditSelectedUsers}
								requiredFields={{ title: true }}
								submitLabel='Enregistrer'
								onSubmit={saveEditing}
								showCancel
								onCancel={cancelEditing}
							/>
						</div>
					) : generated.length > 0 ? (
						<>
							<div className='flex flex-col gap-4 mb-6'>
								{generated.map((task, idx) => (
									<div key={'ai-task-' + idx} className='border border-gray-200 rounded-xl p-4 bg-base-200'>
										<h3>{task.title || 'Nom de la tâche'}</h3>
										<p className='text-md text-gray-500 mt-1'>{task.description || 'Description de la tâche'}</p>

										<div className='flex gap-4 mt-3 text-sm text-gray-500'>
											<button
												type='button'
												className='flex items-center gap-1 hover:underline cursor-pointer'
												onClick={() => setGenerated(generated.filter((_, i) => i !== idx))}>
												<Image src={DeleteIcon} alt='' width={14} height={14} aria-hidden='true' />
												Supprimer
											</button>
											<span className='text-gray-300'>|</span>
											<button
												type='button'
												className='flex items-center gap-1 hover:underline cursor-pointer'
												onClick={() => startEditing(idx)}>
												<Image src={EditIcon} alt='' width={14} height={14} aria-hidden='true' />
												Modifier
											</button>
										</div>
									</div>
								))}
							</div>

							<div className='flex justify-center mb-6'>
								<button
									className='btn bg-black py-7 text-lg font-normal px-6 text-white'
									disabled={!generated.length}
									onClick={() => handleAddTask()}>
									+ Ajouter les tâches
								</button>
							</div>

							<div className='divider'></div>
						</>
					) : (
						<div className='min-h-80'></div>
					)}

					<div className='bg-base-100 rounded-full flex items-center px-8 py-4'>
						<input
							type='text'
							placeholder='Décrivez les tâches que vous souhaitez ajouter...'
							className='flex-1  outline-none text-sm'
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();
									handleGenerate();
								}
							}}
							aria-label='Décrivez les tâches à générer par IA'
						/>

						<button onClick={handleGenerate} type='button' className='ml-2 btn btn-circle btn-sm btn-primary' disabled={isGenerating}>
							<Image src={StarIcon} alt='Generation par IA' width={8.4} height={8.4} />
						</button>
					</div>
				</div>

				<form method='dialog' className='modal-backdrop'>
					<button>close</button>
				</form>
			</dialog>
		</>
	);
}
