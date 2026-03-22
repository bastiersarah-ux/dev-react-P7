'use client';

import { TaskViewProp } from '@front/types/props';
import SearchBar from './SearchBar';
import TaskCard from './TaskCard';

/** Liste des tâches assignées */
export default function TaskList({ tasks }: TaskViewProp) {
	return (
		<div className='card bg-white gap-10 shadow-md p-6 space-y-6'>
			<div className='flex justify-between flex-wrap gap-5 items-center m-px'>
				<div className='flex flex-col'>
					<h2 className='font-semibold'>Mes tâches assignées</h2>
					<span className='h4'>Par ordre de priorité</span>
				</div>

				<div className='flex justify-end items-center h-16.25'>
					<SearchBar />
				</div>
			</div>
			<div className='flex flex-col gap-4 mt-6'>
				{(tasks ?? []).map((task) => (
					<TaskCard key={task.id} task={task} />
				))}
			</div>
		</div>
	);
}
