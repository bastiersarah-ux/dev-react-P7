'use client';

import CalendarIcon from '@front/public/icon-calendar.svg';
import CommentsIcon from '@front/public/icon-comments.svg';
import ProjectsIcon from '@front/public/icon-projets.svg';
import { Task } from '@front/types/api-types';
import Image from 'next/image';
import StatusBadge from './StatusBadge';

type TaskCardProps = {
	task: Task;
};

export default function TaskCard({ task }: TaskCardProps) {
	return (
		<div className='border border-gray-200 rounded-lg p-4 flex flex-col flex-wrap gap-5 justify-between '>
			<div className='flex justify-between w-full items-center flex-wrap'>
				<h3 className='font-semibold'>{task.title}</h3>
				<StatusBadge status={task.status} />
			</div>
			<h4 className='text-sm text-gray-600'>{task.description}</h4>
			<div className='flex justify-between flex-wrap gap-10 gap-x-20'>
				<div className='grid-with-separator gap-2 auto-rows-fr text-xs text-gray-600 mt-2'>
					<div className='flex items-center justify-center gap-2'>
						<Image src={ProjectsIcon} alt='Icône projet' className='w-3.75 h-3.75' />
						<h5>{task.project.name}</h5>
					</div>
					<div className='divider divider-horizontal m-0'></div>
					<div className='flex items-center justify-center gap-2'>
						<Image src={CalendarIcon} alt='Icône calendrier' className='w-3.75 h-3.75' />
						{task.dueDate && (
							<h5>
								{new Date(task.dueDate).toLocaleDateString('fr-FR', {
									day: 'numeric',
									month: 'long',
								})}
							</h5>
						)}
					</div>
					<div className='divider divider-horizontal m-0'></div>
					<div className='flex items-center gap-2'>
						<Image src={CommentsIcon} alt='Icône commentaires' className='w-3.75 h-3.75' />
						<h5>{task.comments?.length ?? 0}</h5>
					</div>
				</div>

				<button className='bg-black min-w-30 text-white px-6 py-3 rounded-[10px]'>Voir</button>
			</div>
		</div>
	);
}
