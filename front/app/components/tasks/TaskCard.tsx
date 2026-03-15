import { Task } from "@front/types/api-types";
import Image from "next/image";
import StatusBadge from "./StatusBadge";
import CalendarIcon from "@front/public/icon-calendar.svg";
import ProjectsIcon from "@front/public/icon-projets.svg";
import CommentsIcon from "@front/public/icon-comments.svg";

type TaskCardProps = {
  task: Task;
};

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="border rounded-lg p-4 flex justify-between items-center">
      <div>
        <h3 className="font-semibold">{task.title}</h3>

        <p className="text-sm text-gray-500">{task.description}</p>

        <div className="flex gap-4 text-xs text-gray-400 mt-2">
          <Image src={ProjectsIcon} alt="Icône projet" className="w-4 h-4" />
          <span>{task.project.name}</span>
          <Image
            src={CalendarIcon}
            alt="Icône calendrier"
            className="w-4 h-4"
          />
          {task.dueDate && (
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          )}
          <Image
            src={CommentsIcon}
            alt="Icône commentaires"
            className="w-4 h-4"
          />
          <span>{task.comments?.length ?? 0}</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <StatusBadge status={task.status} />

        <button className="bg-black text-white px-4 py-1 rounded">Voir</button>
      </div>
    </div>
  );
}
