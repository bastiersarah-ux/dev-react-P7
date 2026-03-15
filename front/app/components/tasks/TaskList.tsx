import { useTasks } from "@front/hooks/useTasks";
import SearchBar from "./SearchBar";
import { Task } from "@front/types/api-types";
import TaskCard from "./TaskCard";
import { TaskViewProp } from "@front/types/props";

export default function TaskList({ tasks }: TaskViewProp) {
  return (
    <div className="card bg-white shadow-md p-6 space-y-6">
      <div className="flex justify-between items-center m-px">
        <div className="flex flex-col">
          <h2 className="font-semibold">Mes tâches assignées</h2>
          <h3>Par ordre de priorité</h3>
        </div>

        <div className="flex justify-end items-center">
          <SearchBar />
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-6">
        {(tasks ?? []).map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
