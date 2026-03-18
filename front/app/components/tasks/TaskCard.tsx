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
    <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
      <div>
        <h3 className="font-semibold">{task.title}</h3>

        <h4 className="text-sm text-gray-600">{task.description}</h4>

        <div className="flex gap-2 text-xs text-gray-600 mt-2">
          <Image
            src={ProjectsIcon}
            alt="Icône projet"
            className="w-3.75 h-3.75"
          />
          <h5>{task.project.name} |</h5>
          <Image
            src={CalendarIcon}
            alt="Icône calendrier"
            className="w-3.75 h-3.75"
          />
          {task.dueDate && (
            <h5>
              {new Date(task.dueDate).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
              })}
            </h5>
          )}
          <Image
            src={CommentsIcon}
            alt="Icône commentaires"
            className="w-3.75 h-3.75"
          />
          <h5>{task.comments?.length ?? 0}</h5>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <StatusBadge status={task.status} />

        <button className="bg-black text-white px-6 py-3 rounded-[10px]">
          Voir
        </button>
      </div>
    </div>
  );
}
