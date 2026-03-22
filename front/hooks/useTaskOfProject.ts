import { getTasksOfProject } from "@front/services/tasksOfProjectService";
import { Task } from "@front/types/api-types";
import { useEffect, useState } from "react";

/** Hook pour récupérer les tâches d'un projet */
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
