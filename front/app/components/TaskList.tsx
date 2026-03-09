import { useTasks } from "@front/hooks/useTasks";
import TaskCard from "./TaskCard";

export default function TaskList() {
  const { tasks } = useTasks();
  return (
    <div className="flex flex-col gap-4 mt-6">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
