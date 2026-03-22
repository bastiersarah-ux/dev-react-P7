import { fetchAPI } from "@front/services/fetch-api";
import { Task } from "@front/types/api-types";

/** Récupère toutes les tâches d'un projet */
export const getTasksOfProject = async (
  id: string,
  init?: RequestInit,
): Promise<Task[]> => {
  const res = await fetchAPI<{ tasks: Task[] }>(`/projects/${id}/tasks`, init);

  return res?.tasks ?? [];
};
