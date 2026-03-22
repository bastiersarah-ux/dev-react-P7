import { fetchAPI } from "@front/services/fetch-api";
import { Task, TaskInput } from "@front/types/api-types";

/** Récupère les tâches assignées à l'utilisateur */
export const getTasks = async (init?: RequestInit): Promise<Task[]> => {
  const res = await fetchAPI<{ tasks: Task[] }>(
    "/dashboard/assigned-tasks",
    init,
  );
  return res?.tasks ?? [];
};

/** Récupère les tâches d'un projet */
export const getProjectTasks = async (
  projectId: number,
  init?: RequestInit,
): Promise<Task[]> => {
  const res = await fetchAPI<{ tasks: Task[] }>(
    `/projects/${projectId}/tasks`,
    init,
  );
  return res?.tasks ?? [];
};

/** Récupère une tâche par son id */
export const getTaskById = async (
  projectId: number,
  taskId: number,
  init?: RequestInit,
): Promise<Task | null> => {
  const res = await fetchAPI<{ task: Task }>(
    `/projects/${projectId}/tasks/${taskId}`,
    init,
  );
  return res?.task ?? null;
};

/** Ajoute une nouvelle tâche */
export const addTask = async (
  idProjet: string,
  task: TaskInput,
  init?: RequestInit,
): Promise<Task | null> => {
  const res = await fetchAPI<{ task: Task }>(`/projects/${idProjet}/tasks`, {
    method: "POST",
    body: JSON.stringify(task),
    ...init,
  });

  return res?.task ?? null;
};

/** Met à jour une tâche */
export const updateTaskById = async (
  projectId: string,
  taskId: string,
  task: TaskInput,
  init?: RequestInit,
): Promise<Task | null> => {
  const res = await fetchAPI<{ task: Task }>(
    `/projects/${projectId}/tasks/${taskId}`,
    {
      method: "PUT",
      body: JSON.stringify(task),
      ...init,
    },
  );
  return res?.task ?? null;
};

/** Supprime une tâche */
export const deleteTaskById = async (
  projectId: string,
  taskId: string,
  init?: RequestInit,
): Promise<boolean> => {
  const res = await fetchAPI(`/projects/${projectId}/tasks/${taskId}`, {
    method: "DELETE",
    ...init,
  });
  return res?.success ?? true;
};
