import { useEffect, useState } from "react";
import { Task } from "@front/types/auth";
import { getTasks } from "@front/services/taskService";

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
