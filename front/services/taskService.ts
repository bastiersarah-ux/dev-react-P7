import { fetchAPI } from "@front/services/fetch-api";
import { Task, TaskInput } from "@front/types/api-types";

export const getTasks = async (): Promise<Task[]> => {
  const res = await fetchAPI<{ tasks: Task[] }>("/dashboard/assigned-tasks");

  return res?.tasks ?? [];
};

export const addTask = async (
  idProjet: number,
  task: TaskInput,
): Promise<Task | null> => {
  const res = await fetchAPI<{ task: Task }>(`/projects/${idProjet}/tasks`, {
    method: "POST",
    body: JSON.stringify(task),
  });

  return res?.task ?? null;
};
