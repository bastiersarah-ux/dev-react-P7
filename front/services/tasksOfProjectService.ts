import { fetchAPI } from "@front/services/fetch-api";
import { Task } from "@front/types/api-types";

export const getTasksOfProject = async (id: string): Promise<Task[]> => {
  const res = await fetchAPI<{ tasks: Task[] }>(`/projects/${id}/tasks`);

  return res?.tasks ?? [];
};
