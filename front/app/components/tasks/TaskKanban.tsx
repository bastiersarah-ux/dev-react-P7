'use client';

import { Task, TaskStatus } from '@front/types/api-types';
import { TaskViewProp } from '@front/types/props';
import { useMemo } from 'react';
import TaskCard from './TaskCard';

/** Colonne du kanban */
type KabanColumn = {
	name: string;
	tasks: Task[];
};

/** Vue kanban des tâches */
export default function TaskKanban({ tasks }: TaskViewProp) {
	/** Colonnes calculées à partir des tâches */
	const columns = useMemo<KabanColumn[]>(() => {
		const labels: Record<TaskStatus, string> = {
			TODO: 'À faire',
			IN_PROGRESS: 'En cours',
			DONE: 'Terminées',
			CANCELLED: 'Annulées',
		};

		return Object.keys(labels)
			.filter((key) => key != 'CANCELLED')
			.map((key) => ({
				name: labels[key as TaskStatus],
				tasks: tasks.filter((task) => task.status === key),
			}));
	}, [tasks]);

	return (
		<div className='grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 auto-rows-fr'>
			{columns.map((column) => (
				<div className='card border-(--color-error) border bg-white px-5 py-5 gap-5' key={column.name}>
					<div className='flex items-center gap-2.5'>
						<h3>{column.name}</h3>
						<span className='badge badge-soft badge-bg-gray-200 text-gray-600'>{column.tasks.length}</span>
					</div>
					<div className='flex flex-col gap-2'>
						{column.tasks.map((task) => (
							<TaskCard key={task.id} task={task} />
						))}
					</div>
				</div>
			))}
		</div>
	);
}
