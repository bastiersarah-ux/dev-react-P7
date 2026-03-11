import { useEffect, useState } from "react";
import { Task } from "@front/types/api-types";
import { getTasksOfProject } from "@front/services/tasksOfProjectService";

export const useTasksOfProject = (id: string) => {
  const [tasksOfProject, setTasksOfProject] = useState<Task[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await getTasksOfProject(id);
      setTasksOfProject(data);
    };

    load();
  }, []);

  return { tasksOfProject };
};
