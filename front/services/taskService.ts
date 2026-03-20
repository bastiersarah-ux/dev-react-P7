import { fetchAPI } from "@front/services/fetch-api";
import { Task, TaskInput } from "@front/types/api-types";

export const getTasks = async (init?: RequestInit): Promise<Task[]> => {
  const res = await fetchAPI<{ tasks: Task[] }>(
    "/dashboard/assigned-tasks",
    init,
  );
  return res?.tasks ?? [];
};

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
