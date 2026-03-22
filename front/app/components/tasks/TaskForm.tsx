'use client';

import { TaskStatus, User } from '@front/types/api-types';
import UserSelector from '../users/UserSelector';
import StatusBadge from './StatusBadge';

/** Props du formulaire de tâche réutilisable */
type TaskFormProps = {
	title: string;
	setTitle: (value: string) => void;
	description: string;
	setDescription: (value: string) => void;
	dueDate: string;
	setDueDate: (value: string) => void;
	status: TaskStatus | null;
	setStatus: (value: TaskStatus | null) => void;
	selectedUsers: User[];
	setSelectedUsers: (users: User[]) => void;
	/** Rendre les champs obligatoires */
	requiredFields?: {
		title?: boolean;
		description?: boolean;
		dueDate?: boolean;
	};
	/** Boutons d'action */
	submitLabel?: string;
	onSubmit?: () => void;
	showCancel?: boolean;
	onCancel?: () => void;
	/** Mode formulaire (avec balise form) ou simple div */
	asForm?: boolean;
};

/** Liste des statuts disponibles */
const statusList: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

/** Formulaire de tâche réutilisable */
export default function TaskForm({
	title,
	setTitle,
	description,
	setDescription,
	dueDate,
	setDueDate,
	status,
	setStatus,
	selectedUsers,
	setSelectedUsers,
	requiredFields = {},
	submitLabel = 'Enregistrer',
	onSubmit,
	showCancel = false,
	onCancel,
	asForm = false,
}: TaskFormProps) {
	const content = (
		<>
			<fieldset className='fieldset'>
				<legend className='fieldset-legend'>Titre{requiredFields.title && '*'}</legend>
				<input
					type='text'
					className='input input-bordered w-full'
					value={title}
					required={requiredFields.title}
					onChange={(e) => setTitle(e.target.value)}
					aria-label='Titre de la tâche'
				/>
			</fieldset>

			<fieldset className='fieldset'>
				<legend className='fieldset-legend'>Description{requiredFields.description && '*'}</legend>
				<input
					type='text'
					className='input input-bordered w-full'
					value={description}
					required={requiredFields.description}
					onChange={(e) => setDescription(e.target.value)}
					aria-label='Description de la tâche'
				/>
			</fieldset>

			<fieldset className='fieldset'>
				<legend className='fieldset-legend'>Échéance{requiredFields.dueDate && '*'}</legend>
				<input
					type='date'
					className='input input-bordered w-full'
					value={dueDate}
					required={requiredFields.dueDate}
					onChange={(e) => setDueDate(e.target.value)}
					aria-label="Date d'échéance"
				/>
			</fieldset>

			<UserSelector selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} label='Assigné à' />

			<fieldset className='fieldset'>
				<legend className='fieldset-legend'>Statut</legend>
				<div className='filter'>
					<input
						className='btn btn-ghost text-[17px] btn-badge'
						type='reset'
						value='×'
						onClick={() => setStatus(null)}
						aria-label='Réinitialiser le statut'
					/>
					{statusList.map((s) => (
						<StatusBadge key={s} status={s} formMode onSelect={(value) => setStatus(value)} isChecked={status === s} />
					))}
				</div>
			</fieldset>

			{(onSubmit || showCancel) && (
				<div className='flex gap-2 justify-start mt-4'>
					{showCancel && onCancel && (
						<button type='button' className='btn btn-ghost' onClick={onCancel}>
							Annuler
						</button>
					)}
					{onSubmit && (
						<button
							type={asForm ? 'submit' : 'button'}
							className='btn bg-black py-7 text-lg font-normal px-6 text-white'
							onClick={asForm ? undefined : onSubmit}>
							{submitLabel}
						</button>
					)}
				</div>
			)}
		</>
	);

	if (asForm && onSubmit) {
		return (
			<form
				className='space-y-4'
				onSubmit={(e) => {
					e.preventDefault();
					onSubmit();
				}}>
				<div className='form-control w-full'>{content}</div>
			</form>
		);
	}

	return <div className='space-y-4'>{content}</div>;
}
