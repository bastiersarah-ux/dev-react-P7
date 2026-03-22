import { getTasks } from "@front/services/taskService";
import { Task } from "@front/types/api-types";
import { useEffect, useState } from "react";

/** Hook pour récupérer les tâches de l'utilisateur */
export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await getTasks();
      setTasks(data);
    };

    load();
  }, []);

  return { tasks };
};
