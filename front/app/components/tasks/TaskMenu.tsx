'use client';

import ConfirmDelete from '@front/app/components/dialogs/ConfirmDelete';
import CreateOrUpdateTask from '@front/app/components/dialogs/CreateOrUpdateTask';
import { useNotification } from '@front/context/NotificationContext';
import Menu from '@front/public/menu.svg';
import { deleteTaskById } from '@front/services/taskService';
import { Task } from '@front/types/api-types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

type TaskMenuProps = {
	task: Task;
	projectId: string;
};

export default function TaskMenu({ task, projectId }: TaskMenuProps) {
	const dropdownRef = useRef<HTMLDetailsElement>(null);
	const router = useRouter();
	const { showSuccess, showError } = useNotification();

	const closeDropdown = () => {
		dropdownRef.current?.removeAttribute('open');
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				closeDropdown();
			}
		};

		document.addEventListener('click', handleClickOutside);

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, []);

	return (
		<details ref={dropdownRef} className='dropdown dropdown-end'>
			<summary className='btn w-14.25 h-14.25 mr-auto'>
				<Image src={Menu} alt='Modifier ou supprimer une tâche' className='w-3.75' />
			</summary>

			<ul className='menu dropdown-content rounded-box z-1 w-52 p-2 shadow-sm bg-base-200'>
				<li>
					<CreateOrUpdateTask idProject={projectId} taskToEdit={task} onSuccess={() => router.refresh()} />
				</li>

				<li>
					<ConfirmDelete
						title='Supprimer la tâche'
						message={`Êtes-vous sûr de vouloir supprimer la tâche "${task.title}" ?`}
						onConfirm={async () => {
							try {
								await deleteTaskById(projectId, task.id);
								showSuccess('Tâche supprimée avec succès');
								closeDropdown();
								router.refresh();
							} catch (error) {
								const message = error instanceof Error ? error.message : 'Erreur lors de la suppression de la tâche';
								showError(message);
							}
						}}
					/>
				</li>
			</ul>
		</details>
	);
}
