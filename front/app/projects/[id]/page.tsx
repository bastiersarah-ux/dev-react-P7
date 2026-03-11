"use client";

import { useParams } from "next/navigation";
import PageHeader from "@front/app/components/PageHeader";
import StatusBadge from "@front/app/components/StatusBadge";
import UserInitialsButton from "../../components/UserInitialsButton";
import { useTasksOfProject } from "@front/hooks/useTaskOfProject";
import { useDashboardProjects } from "@front/hooks/useProjects";

export default function ProjectDetail() {
  const params = useParams();
  const { tasksOfProject } = useTasksOfProject(String(params.id));
  const { dashboardProjects } = useDashboardProjects();

  const project = dashboardProjects?.find((p) => p.id === params.id)!;

  const projectTasks = tasksOfProject?.filter(
    (task) => task.projectId === params.id,
  );

  return (
    <>
      <main className="max-w-5xl mx-auto px-6">
        <PageHeader
          title={project?.name}
          subtitle={project?.description ?? ""}
        />
      </main>

      <h1>Détail du projet {params.id}</h1>

      {projectTasks?.map((task) => (
        <div key={task.id} className="card p-5 no-link bg-white">
          <div>
            <span>{task.title}</span>
            <StatusBadge status={task.status} />
          </div>

          <span>{task.description}</span>
          <span>{new Date(task.dueDate!)?.toLocaleDateString()}</span>

          <div>
            <span>Assigné à :</span>
            {(task.assignees ?? []).map((assignee) => (
              <UserInitialsButton name={assignee.user?.name} showFull />
            ))}
          </div>

          <div className="w-full max-w-3xl mx-auto p-4 bg-base-100 rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-lg">
                Commentaires ({task.comments?.length ?? 0})
              </span>
            </div>

            <div className="space-y-4">
              {task.comments?.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="bg-neutral text-neutral-content rounded-full w-14 h-14">
                    <UserInitialsButton name={comment.author?.name} />
                  </div>

                  <div className="flex-1 bg-base-200 rounded-xl p-3">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">
                        {comment.author?.name}
                      </span>
                      <span className="text-gray-400">
                        {new Date(comment.createdAt!)?.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <div className="w-18 h-14">
                <UserInitialsButton
                  key={project.owner!.id}
                  name={project.owner?.name}
                />
              </div>
              <input
                type="text"
                className="input bg-white h-15 w-full"
                placeholder="Ajouter un commentaire..."
              ></input>
              <button className="btn btn-primary">Envoyer</button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
