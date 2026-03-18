import { Task, TaskStatus } from "@front/types/api-types";
import { TaskViewProp } from "@front/types/props";
import { useEffect, useState } from "react";
import TaskCard from "./TaskCard";

type KabanColumn = {
  name: string;
  tasks: Task[];
};

export default function TaskKanban({ tasks }: TaskViewProp) {
  const labels: Record<TaskStatus, string> = {
    TODO: "À faire",
    IN_PROGRESS: "En cours",
    DONE: "Terminé",
    CANCELLED: "Annulé",
  };

  const [columns, setColumns] = useState<KabanColumn[]>([]);

  useEffect(() => {
    const res: KabanColumn[] = Object.keys(labels)
      .filter((key) => key != "CANCELLED")
      .map((key) => ({
        name: labels[key as TaskStatus],
        tasks: tasks.filter((task) => task.status === key),
      }));
    setColumns(res);
  }, [tasks]);

  return (
    <div className="flex gap-4">
      {columns.map((column) => (
        <div className="card bg-white px-5 py-5 gap-5" key={column.name}>
          <div className="flex items-center gap-2.5">
            <h3>{column.name}</h3>
            <span className="badge badge-soft badge-bg-gray-200 text-gray-600">
              {column.tasks.length}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {column.tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
