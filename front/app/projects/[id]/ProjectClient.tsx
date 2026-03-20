'use client';

import ListAiTask from '@front/app/components/dialogs/CreateAiTask';
import CreateOrUpdateProject from '@front/app/components/dialogs/CreateOrUpdateProject';
import CreateOrUpdateTask from '@front/app/components/dialogs/CreateOrUpdateTask';
import DeleteProject from '@front/app/components/dialogs/DeleteProject';
import SearchBar from '@front/app/components/tasks/SearchBar';
import StatusBadge from '@front/app/components/tasks/StatusBadge';
import TaskMenu from '@front/app/components/tasks/TaskMenu';
import { useAuth } from '@front/context/AuthContext';
import { useNotification } from '@front/context/NotificationContext';
import { getProjectMemberWithRealRole } from '@front/helpers/project-helper';
import ArrowLeftIcon from '@front/public/arrow-left.svg';
import CalendarIcon from '@front/public/icon-calendar.svg';
import ListIcon from '@front/public/list-icon.svg';
import OrangeCalendarIcon from '@front/public/orange-calendar-icon.svg';
import { createComment } from '@front/services/commentService';
import { Project, ProjectMember, ProjectMemberRole, Task, TaskStatus } from '@front/types/api-types';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useMemo, useState } from 'react';
import UserInitialsButton from '../../components/users/UserInitialsButton';

type Props = {
	project: Project;
	tasks: Task[];
};

export default function ProjectClient({ project, tasks }: Props) {
	const router = useRouter();
	const { user } = useAuth();
	const { showSuccess, showError } = useNotification();
	const [currentTab, setCurrentTab] = useState<'list' | 'calendar'>('list');
	const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
	const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
	const [submittingComment, setSubmittingComment] = useState<string | null>(null);

	const members = useMemo<ProjectMember[]>(() => {
		return project ? getProjectMemberWithRealRole(project) : [];
	}, [project]);

	const currentRole = useMemo<ProjectMemberRole | null>(() => {
		if (!user) return null;
		if (project.ownerId === user.id) return 'OWNER';
		const member = project.members?.find((m) => m.user?.id === user.id);
		return member?.role ?? null;
	}, [user, project]);

	const isAdmin = currentRole === 'OWNER' || currentRole === 'ADMIN';

	const filteredTasks = useMemo(() => {
		const filtered = statusFilter ? tasks.filter((task) => task.status === statusFilter) : [...tasks];

		return filtered.sort((a, b) => {
			const isActiveA = a.status === 'TODO' || a.status === 'IN_PROGRESS';
			const isActiveB = b.status === 'TODO' || b.status === 'IN_PROGRESS';

			if (isActiveA && !isActiveB) return -1;
			if (!isActiveA && isActiveB) return 1;

			const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
			const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
			return dateA - dateB;
		});
	}, [tasks, statusFilter]);

	const onChange = (ev: ChangeEvent<HTMLInputElement>) => {
		setCurrentTab(ev.target.value as 'list' | 'calendar');
	};

	const handleAddComment = async (taskId: string) => {
		const content = commentInputs[taskId]?.trim();
		if (!content) return;

		setSubmittingComment(taskId);
		try {
			await createComment(project.id, taskId, content);
			setCommentInputs((prev) => ({ ...prev, [taskId]: '' }));
			showSuccess('Commentaire ajouté');
			router.refresh();
		} catch (error) {
			const message = error instanceof Error ? error.message : "Erreur lors de l'ajout du commentaire";
			showError(message);
		} finally {
			setSubmittingComment(null);
		}
	};

	const statusList: Record<TaskStatus, string> = {
		TODO: 'À faire',
		IN_PROGRESS: 'En cours',
		DONE: 'Terminé',
		CANCELLED: 'Annulé',
	};

	return (
		<main className=' px-11 py-17.5 flex w-full flex-wrap gap-4 flex-1'>
			<Link className='btn w-14.25 h-14.25' href={'/projects'}>
				<Image src={ArrowLeftIcon} alt='Retour' className='w-3.75' />
			</Link>
			<div className='flex flex-col w-full flex-1 gap-8'>
				<div className='flex flex-wrap gap-5'>
					<div className='flex flex-col gap-0.5'>
						<div className='flex flex-wrap items-center'>
							<h2 className='text-gray-800 text-2xl font-semibold'>{project?.name}</h2>
							{isAdmin && <CreateOrUpdateProject projectToEdit={project} />}
							{isAdmin && <DeleteProject projectId={project.id} projectName={project.name} />}
						</div>
						<p className='text-[18px]'>{project?.description ?? ''}</p>
					</div>
					<div className='flex gap-2 flex-1 flex-wrap justify-end items-center'>
						<CreateOrUpdateTask idProject={project.id} onSuccess={() => router.refresh()} />
						<ListAiTask
							projectId={project.id}
							contributors={(project.members ?? []).map((m) => m.user).filter(Boolean) as NonNullable<ProjectMember['user']>[]}
							onSuccess={() => router.refresh()}
						/>
					</div>
				</div>
				<div className='navbar flex-wrap gap-2 bg-gray-100  rounded-box px-4 py-5'>
					<div className='flex-1 gap-2 flex items-center'>
						<span className='font-semibold'>Contributeurs</span>
						<span className='text-sm opacity-60'>
							{members.length} personne{members.length > 1 ? 's' : ''}
						</span>
					</div>
					<div className='flex flex-wrap items-center gap-2'>
						{members
							.filter((member) => member.role === 'OWNER')
							.map((member) => (
								<div key={member.id} className='flex items-center gap-2'>
									<UserInitialsButton user={member.user} showFull fullNameAlt={currentRole == 'OWNER'} size='27px' />
								</div>
							))}

						{members
							.filter((member) => member.role !== 'OWNER')
							.map((member) => (
								<div key={member.id} className='flex items-center gap-2'>
									<UserInitialsButton user={member.user} showFull variant={'Variant2'} size='27px' />
								</div>
							))}
					</div>
				</div>

				<div className='card bg-white border border-gray-200 p-6 gap-5'>
					<div className='flex items-center gap-4 flex-wrap justify-between w-full'>
						<div className='flex flex-col flex-none'>
							<h3 className='font-semibold'>Tâches</h3>
							<h4>Par ordre de priorité</h4>
						</div>

						<div className='flex items-center gap-4 flex-wrap'>
							<div className='flex gap-4 h-13 justify-end-safe'>
								<label
									htmlFor='tab-list'
									className={`btn btn-ghost flex h-full font-normal items-center text-[14px] text-(--color-warning-content) gap-2 ${
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
									htmlFor='tab-calendar'
									className={`btn btn-ghost flex h-full items-center font-normal text-[14px] text-(--color-warning-content) gap-2 ${
										currentTab === 'calendar' ? 'bg-(--color-warning) ' : ''
									}`}>
									<Image src={OrangeCalendarIcon} alt='Icône calendar' className='w-4 h-4' />
									Calendrier
								</label>
								<input
									type='radio'
									name='tabView'
									id='tab-calendar'
									value='calendar'
									checked={currentTab === 'calendar'}
									onChange={onChange}
									className='hidden'
								/>
							</div>
							<select
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value as TaskStatus | '')}
								className='select select-lg h-18 w-31 pr-5 text-[14px] text-gray-600'>
								<option value=''>Statut</option>
								{Object.keys(statusList).map((key) => (
									<option key={key} value={key}>
										{statusList[key as TaskStatus]}
									</option>
								))}
							</select>
							<div className='h-18'>
								<SearchBar />
							</div>
						</div>
					</div>

					{(!filteredTasks || filteredTasks.length === 0) && (
						<p className='text-sm text-gray-500 text-center p-15'>Aucune tâche assignée.</p>
					)}

					{filteredTasks?.map((task) => (
						<div key={task.id} className='card card-border border-gray-200 px-6.25 py-10 no-link gap-5 bg-white'>
							<div className='flex flex-col gap-2'>
								<div className='flex items-center justify-between gap-2'>
									<div className='flex flex-wrap items-center gap-2'>
										<h3>{task.title}</h3>
										<StatusBadge status={task.status} />
									</div>
									<TaskMenu projectId={project.id} task={task} />
								</div>

								<h4>{task.description}</h4>
							</div>
							<span className='flex items-center gap-1.5'>
								<h5>Échéance :</h5>
								<span className='flex items-center gap-1'>
									<Image src={CalendarIcon} alt='Icône calendar' className='w-4 h-4' />
									{new Date(task.dueDate!)?.toLocaleDateString('fr-FR', {
										day: 'numeric',
										month: 'long',
									})}
								</span>
							</span>

							<div className='flex items-center gap-5 flex-wrap'>
								<h5>Assigné à :</h5>
								{(task.assignees ?? []).map((assignee) => {
									const isOwner = members.find((member) => member.user.id == assignee.user?.id)?.role == 'OWNER';
									return (
										<UserInitialsButton
											key={assignee.user?.id}
											user={assignee.user}
											showFull
											size='27px'
											variant={!isOwner ? 'Variant2' : null}
											fullNameAlt={currentRole == 'OWNER'}
										/>
									);
								})}
							</div>
							<div className='divider'></div>
							<details className='collapse collapse-arrow w-full'>
								<summary className='collapse-title p-0'>Commentaires ({task.comments?.length ?? 0})</summary>
								<div className='collapse-content mt-6'>
									<div className='space-y-4'>
										{task.comments?.map((comment) => (
											<div key={comment.id} className='flex gap-3'>
												<div className='bg-neutral text-neutral-content rounded-full w-14 h-14'>
													<UserInitialsButton
														user={comment.author}
														variant={
															members.find((m) => m.user.id == comment.author?.id)?.role != 'OWNER' ? 'Variant2' : null
														}
													/>
												</div>

												<div className='flex-1 bg-gray-100 rounded-xl p-3'>
													<div className='flex justify-between text-sm'>
														<span className='font-medium'>{comment.author?.name}</span>
														<span className='text-gray-400 text-[10px]'>
															{new Date(comment.createdAt!)
																?.toLocaleDateString('fr-FR', {
																	day: 'numeric',
																	month: 'long',
																	hour: '2-digit',
																	minute: '2-digit',
																})
																.replace(' à ', ', ')}
														</span>
													</div>
													<p className='text-sm mt-1'>{comment.content}</p>
												</div>
											</div>
										))}
									</div>

									<div className='flex gap-3 mt-6 items-center flex-wrap'>
										<div className='flex gap-3 grow items-center'>
											<div className='flex w-16 h-14'>
												<UserInitialsButton key={user?.id} user={user ?? undefined} size='49px' />
											</div>
											<input
												type='text'
												className='input bg-gray-50 h-15 w-full'
												placeholder='Ajouter un commentaire...'
												value={commentInputs[task.id] ?? ''}
												onChange={(e) => setCommentInputs((prev) => ({ ...prev, [task.id]: e.target.value }))}
												onKeyDown={(e) => e.key === 'Enter' && handleAddComment(task.id)}
												disabled={submittingComment === task.id}
											/>
										</div>
										<button
											className='btn btn-primary btn-outline'
											onClick={() => handleAddComment(task.id)}
											disabled={submittingComment === task.id || !commentInputs[task.id]?.trim()}>
											{submittingComment === task.id ? <span className='loading loading-spinner loading-sm' /> : 'Envoyer'}
										</button>
									</div>
								</div>
							</details>
						</div>
					))}
				</div>
			</div>
		</main>
	);
}
