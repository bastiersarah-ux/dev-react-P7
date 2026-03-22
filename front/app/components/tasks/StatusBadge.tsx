'use client';

import { TaskStatus } from '@front/types/api-types';

/** Props du composant StatusBadge */
type StatusBadgeProp = {
	status: TaskStatus;
	formMode?: boolean;
	onSelect?: (value: TaskStatus) => void;
	isChecked?: boolean;
};

/** Badge qui affiche le statut d'une tâche */
export default function StatusBadge({ status, formMode, onSelect, isChecked }: StatusBadgeProp) {
	const styles: Record<TaskStatus, string> = {
		TODO: 'bg-[var(--color-error)] text-[var(--color-error-content)]',
		IN_PROGRESS: 'bg-[var(--color-accent)] text-[var(--color-accent-content)]',
		DONE: 'bg-[var(--color-success)] text-[var(--color-success-content)]',
		CANCELLED: 'bg-gray-200)] text bg-gray-400]',
	};

	const labels: Record<TaskStatus, string> = {
		TODO: 'À faire',
		IN_PROGRESS: 'En cours',
		DONE: 'Terminée',
		CANCELLED: 'Annulé',
	};

	if (formMode && onSelect) {
		return (
			<input
				className={`btn btn-ghost btn-badge rounded-[50px]! ${styles[status]}`}
				type='radio'
				name='status'
				checked={isChecked ?? false}
				aria-label={labels[status]}
				onChange={() => onSelect(status)}
			/>
		);
	}

	return <span className={`text-[14px] px-3 py-1 rounded-[50px] ${styles[status]}`}>{labels[status]}</span>;
}
