import { fetchAPI } from "@front/services/api";
import { Task } from "@front/types/auth";

export const getTasks = async (): Promise<Task[]> => {
  const res = await fetchAPI<Task[]>("/dashboard/assigned-tasks");

  return res ?? [];
};
