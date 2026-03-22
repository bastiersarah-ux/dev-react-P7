'use client';

import { useNotification } from '@front/context/NotificationContext';
import { addTask, updateTaskById } from '@front/services/taskService';
import { Task, TaskInput, TaskStatus, User } from '@front/types/api-types';
import { MouseEvent, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TaskForm from '../tasks/TaskForm';

/** Props de la modale tâche */
type CreateOrUpdateTaskProp = {
	taskToEdit?: Task;
	idProject: string;
	onSuccess?: () => void;
};

/** Modale pour créer ou modifier une tâche */
export default function CreateOrUpdateTask({ taskToEdit, idProject, onSuccess }: CreateOrUpdateTaskProp) {
	const { showSuccess, showError } = useNotification();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [dueDate, setDueDate] = useState('');
	const [status, setStatus] = useState<TaskStatus | null>(null);
	const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const myModal = () => document.getElementById(id) as HTMLDialogElement;

	const resetForm = () => {
		if (taskToEdit) {
			setTitle(taskToEdit.title);
			setDescription(taskToEdit.description || '');
			setDueDate(taskToEdit.dueDate ? new Date(taskToEdit.dueDate).toISOString().slice(0, 10) : '');
			setStatus(taskToEdit.status);
			setSelectedUsers(taskToEdit.assignees?.map((assignee) => assignee.user!).filter(Boolean) || []);
		} else {
			setTitle('');
			setDescription('');
			setDueDate('');
			setStatus(null);
			setSelectedUsers([]);
		}
	};

	const showModal = (e: MouseEvent<unknown, unknown>) => {
		e.preventDefault();
		myModal()?.showModal();
	};

	const dismissModal = (shouldReset = true) => {
		if (shouldReset) resetForm();
		myModal()?.close();
	};

	useEffect(() => {
		if (taskToEdit) {
			setTitle(taskToEdit.title);
			setDescription(taskToEdit.description || '');
			setDueDate(taskToEdit.dueDate ? new Date(taskToEdit.dueDate).toISOString().slice(0, 10) : '');
			setStatus(taskToEdit.status);
			setSelectedUsers(taskToEdit.assignees?.map((assignee) => assignee.user!).filter(Boolean) || []);
		}
	}, [taskToEdit]);

	const handleSubmit = async () => {
		setIsSubmitting(true);

		try {
			const assignees = selectedUsers.map((user) => user?.id);

			const input: TaskInput = {
				description,
				dueDate: new Date(dueDate).toISOString(),
				title: title,
				assigneeIds: assignees,
				status: status ?? 'TODO',
			};

			const res: Task | null = !taskToEdit ? await addTask(idProject, input) : await updateTaskById(idProject, taskToEdit!.id, input);

			if (!res) {
				showError("Erreur lors de l'enregistrement de la tâche");
				return;
			} else {
				showSuccess(taskToEdit ? 'Tâche modifiée avec succès' : 'Tâche créée avec succès');
				onSuccess?.();
			}
			dismissModal(false);
			resetForm();
		} catch (error) {
			const message = error instanceof Error ? error.message : "Erreur lors de l'enregistrement de la tâche";
			showError(message);
		} finally {
			setIsSubmitting(false);
		}
	};

	const isEditMode = !!taskToEdit;

	const id = taskToEdit ? `task-modal-${taskToEdit.id}` : `task-modal-${idProject}-new`;

	const modalContent = (
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

				<h2 className='font-bold text-lg mb-4'>{isEditMode ? 'Modifier une tâche' : 'Créer une tâche'}</h2>

				<TaskForm
					title={title}
					setTitle={setTitle}
					description={description}
					setDescription={setDescription}
					dueDate={dueDate}
					setDueDate={setDueDate}
					status={status}
					setStatus={setStatus}
					selectedUsers={selectedUsers}
					setSelectedUsers={setSelectedUsers}
					requiredFields={{ title: true, description: true, dueDate: true }}
					submitLabel={taskToEdit ? 'Enregistrer' : '+ Ajouter une tâche'}
					onSubmit={handleSubmit}
					asForm
				/>
			</div>

			<form method='dialog' className='modal-backdrop'>
				<button onClick={() => resetForm()}>close</button>
			</form>
		</dialog>
	);

	return (
		<>
			{!taskToEdit ? (
				<button className='btn btn-black py-7 px-6' onClick={showModal}>
					Créer une tâche
				</button>
			) : (
				<a
					href='#'
					className='p-4 text-black! no-underline!'
					onClick={showModal}
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							showModal(e as unknown as MouseEvent<unknown, unknown>);
						}
					}}>
					Modifier
				</a>
			)}

			{typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent}
		</>
	);
}
