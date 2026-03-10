import { fetchAPI } from "@front/services/fetch-api";
import { Task } from "@front/types/api-types";

export const getTasks = async (): Promise<Task[]> => {
  const res = await fetchAPI<{ tasks: Task[] }>("/dashboard/assigned-tasks");

  return res?.tasks ?? [];
};
