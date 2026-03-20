'use client';

import KanbanIcon from '@front/public/kanban-icon.svg';
import ListIcon from '@front/public/list-icon.svg';
import { Task } from '@front/types/api-types';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import PageHeader from '../components/PageHeader';
import TaskKanban from '../components/tasks/TaskKanban';
import TaskList from '../components/tasks/TaskList';

type DashboardTabView = 'list' | 'kanban';

type Props = {
	tasks: Task[];
	userName: string;
};

export default function DashboardClient({ tasks, userName }: Props) {
	const [currentTab, setCurrentTab] = useState<DashboardTabView>('list');

	const onChange = (ev: ChangeEvent<HTMLInputElement>) => {
		setCurrentTab(ev.target.value as DashboardTabView);
	};

	return (
		<main className='md:px-25 md:py-20 sm p-5 flex-1'>
			<PageHeader title='Tableau de bord' subtitle={`Bonjour ${userName ?? ''}, voici un aperçu de vos projets et tâches`} />

			<fieldset className='join gap-4 h-11.25 my-6'>
				<legend className='hidden'>Affichage</legend>
				<label
					htmlFor='tab-list'
					className={`join-item rounded-lg px-3.5 py-4 h-full btn flex items-center text-(--color-warning-content) gap-2 ${
						currentTab === 'list' ? 'bg-(--color-warning)' : ''
					}`}>
					<Image src={ListIcon} alt='Icône liste' className='w-4 h-4' />
					Liste
				</label>
				<input
					type='radio'
					name='tabView'
					id='tab-list'
					value='list'
					checked={currentTab === 'list'}
					onChange={onChange}
					className='hidden'
				/>

				<label
					htmlFor='tab-kanban'
					className={`join-item rounded-lg h-full px-3.5 py-4 btn flex items-center text-(--color-warning-content) gap-2 ${
						currentTab === 'kanban' ? 'bg-(--color-warning) ' : ''
					}`}>
					<Image src={KanbanIcon} alt='Icône Kanban' className='w-4 h-4' />
					Kanban
				</label>
				<input
					type='radio'
					name='tabView'
					id='tab-kanban'
					value='kanban'
					checked={currentTab === 'kanban'}
					onChange={onChange}
					className='hidden'
				/>
			</fieldset>
			{currentTab === 'list' ? <TaskList tasks={tasks} /> : <TaskKanban tasks={tasks} />}
		</main>
	);
}
