'use client';

import { useNotification } from '@front/context/NotificationContext';
import OrangeStarIcon from '@front/public/orange-star.svg';
import StarIcon from '@front/public/star.svg';
import { addTask } from '@front/services/taskService';
import { Task, TaskInput, TaskStatus, User } from '@front/types/api-types';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type ListAiTaskProp = {
	tasks?: Task[];
	contributors?: User[];
	projectId: string;
	onSuccess?: () => void;
};

// Small, deterministic-ish generator executed only on the client (button click)
// to avoid any SSR/client mismatch. The seed is kept in state so re-renders are stable.
export default function ListAiTask({ tasks, contributors = [], projectId, onSuccess }: ListAiTaskProp) {
	const { showSuccess, showError } = useNotification();
	const [prompt, setPrompt] = useState('');
	const [generated, setGenerated] = useState<TaskInput[]>([]);
	const [isGenerating, setIsGenerating] = useState(false);

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
		};

		modal.addEventListener('close', handleClose);
		return () => modal.removeEventListener('close', handleClose);
	}, []);

	const handleGenerate = () => {
		if (isGenerating) return;
		setIsGenerating(true);
		const baseSeed = Date.now() % 1000; // generated only on button click (client-side)

		const themes = ['Refactor', 'Documentation', 'Monitoring', 'UX polish', 'Performance', 'Tests', 'Security', 'Data cleanup', 'Release prep'];
		const actions = ['Ajouter', 'Finaliser', 'Corriger', 'Mettre à jour', 'Valider', 'Mesurer', 'Automatiser', 'Revoir', 'Nettoyer'];
		const priorities: TaskInput['priority'][] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
		const statuses: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

		const hint = prompt.trim().length > 0 ? ` (${prompt.slice(0, 40)})` : '';

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
					title: `${action} ${theme}${hint}`.trim(),
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
			<button className='btn btn-primary h-12.5 w-23.5' onClick={showModal}>
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
						<h3 className='font-bold text-lg'>Vos tâches...</h3>
					</div>
					{generated.length > 0 ? (
						<>
							<div className='flex flex-col gap-4 mb-6'>
								{(generated.length ? generated : (tasks ?? [])).map((task, idx) => (
									<div key={'ai-task-' + idx} className='border rounded-xl p-4 bg-base-100 shadow-sm'>
										<h4 className='font-semibold'>{task.title}</h4>
										<p className='text-sm opacity-70'>{task.description}</p>

										<div className='flex gap-4 mt-3 text-sm opacity-70'>
											{task.priority && <span className='uppercase text-xs font-semibold'>{task.priority}</span>}
											{task.status && <span>{task.status}</span>}
										</div>
									</div>
								))}
							</div>

							<div className='flex justify-center mb-6'>
								<button className='btn btn-primary btn-outline' disabled={!generated.length} onClick={() => handleAddTask()}>
									+ Ajouter les tâches
								</button>
							</div>
						</>
					) : (
						<div className='min-h-100'></div>
					)}

					<div className='bg-base-200 rounded-full flex items-center px-4 py-2'>
						<input
							type='text'
							placeholder='Décrivez les tâches que vous souhaitez ajouter...'
							className='flex-1 bg-transparent outline-none text-sm'
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
