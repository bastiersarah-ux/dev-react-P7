import { TaskStatus } from "@front/types/api-types";

type StatusBadgeProp = {
  status: TaskStatus;
};

export default function StatusBadge({ status }: StatusBadgeProp) {
  const styles: Record<TaskStatus, string> = {
    TODO: "bg-[var(--color-error)] text-[var(--color-error-content)]",
    IN_PROGRESS:
      "bg-[var(--color-warning)] text-[var(--color-warning-content)]",
    DONE: "bg-[var(--color-success)] text-[var(--color-success-content)]",
    CANCELLED: "bg-gray-200)] text bg-gray-400]",
  };

  const labels: Record<TaskStatus, string> = {
    TODO: "À faire",
    IN_PROGRESS: "En cours",
    DONE: "Terminé",
    CANCELLED: "Annulé",
  };

  return (
    <span className={`text-xs px-3 py-1 rounded ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
