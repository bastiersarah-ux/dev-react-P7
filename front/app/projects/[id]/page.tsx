"use client";

import { useParams } from "next/navigation";
import PageHeader from "@front/app/components/PageHeader";
import StatusBadge from "@front/app/components/tasks/StatusBadge";
import UserInitialsButton from "../../components/users/UserInitialsButton";
import { useTasksOfProject } from "@front/hooks/useTaskOfProject";
import { useDashboardProjects } from "@front/hooks/useDashboardProjects";
import SearchBar from "@front/app/components/tasks/SearchBar";
import { useState, ChangeEvent } from "react";
import ListIcon from "@front/public/list-icon.svg";
import CalendarIcon from "@front/public/orange-calendar-icon.svg";
import ArrowLeftIcon from "@front/public/arrow-left.svg";
import Image from "next/image";
import { TaskStatus } from "@front/types/api-types";
import Link from "next/link";
import CreateOrUpdateTask from "@front/app/components/tasks/CreateOrUpdateTask";
import CreateOrUpdateProject from "@front/app/components/tasks/CreateOrUpdateProject";
import { useProjectById } from "@front/hooks/useProject";

export default function ProjectDetail() {
  const params = useParams();
  const { project } = useProjectById(String(params.id));
  const { tasksOfProject } = useTasksOfProject(String(params.id));
  const [currentTab, setCurrentTab] = useState<"list" | "calendar">("list");

  const onChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setCurrentTab(ev.target.value as "list" | "calendar");
  };

  const statusList: Record<TaskStatus, string> = {
    TODO: "À faire",
    IN_PROGRESS: "En cours",
    DONE: "Terminé",
    CANCELLED: "Annulé",
  };

  return (
    <>
      <main className="mx-auto  space-y-6">
        <div className="flex pr-25">
          <Link className="btn w-14.25 h-14.25" href={"/projetcs"}>
            <Image src={ArrowLeftIcon} alt="Retour" className="w-3.75" />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center">
              <h2 className="text-gray-800 text-2xl font-semibold">
                {project?.name}
              </h2>
              <CreateOrUpdateProject projectToEdit={project} />
            </div>
            <p className="text-sm">{project?.description ?? ""}</p>
          </div>
          <div className="flex gap-2 flex-1 justify-end">
            <CreateOrUpdateTask />
            <button className="btn btn-primary">IA</button>
          </div>
        </div>

        <div className="navbar bg-base-200 rounded-box px-4">
          <div className="flex-1 gap-2 flex items-center">
            <span className="font-semibold">Contributeurs</span>
            <span className="text-sm opacity-60">
              {project?.members?.length} personnes
            </span>
          </div>

          {project?.members
            ?.filter((member) => member.role === "OWNER")
            .map((member) => (
              <div key={member.id} className="flex items-center gap-2">
                <UserInitialsButton user={member.user} />
                <span className="badge badge-warning">Propriétaire</span>
              </div>
            ))}

          {project?.members
            ?.filter((member) => member.role !== "OWNER")
            .map((member) => (
              <div key={member.id} className="flex items-center gap-2">
                <UserInitialsButton user={member.user} showFull />
              </div>
            ))}
        </div>

        <div className="mx-30 card bg-white shadow-md p-6 space-y-6">
          <div className="flex items-center h-15.75 justify-between w-full">
            <div className="flex flex-col flex-none">
              <h2 className="font-semibold">Mes tâches assignées</h2>
              <h3>Par ordre de priorité</h3>
            </div>

            <div className="flex items-center gap-4 h-full flex-1 justify-end">
              <div className="flex gap-4 justify-end-safe">
                <label
                  htmlFor="tab-list"
                  className={`btn btn-ghost flex h-11.75 items-center text-(--color-warning-content) gap-2 ${
                    currentTab === "list" ? "bg-(--color-warning)" : ""
                  }`}
                >
                  <Image src={ListIcon} alt="Icône liste" className="w-4 h-4" />
                  Liste
                </label>
                <input
                  type="radio"
                  name="tabView"
                  id="tab-list"
                  value="list"
                  checked={currentTab === "list"}
                  onChange={onChange}
                  className="hidden"
                />

                <label
                  htmlFor="tab-calendar"
                  className={`btn btn-ghost flex h-11.75 items-center text-(--color-warning-content) gap-2 ${
                    currentTab === "calendar" ? "bg-(--color-warning) " : ""
                  }`}
                >
                  <Image
                    src={CalendarIcon}
                    alt="Icône calendar"
                    className="w-4 h-4"
                  />
                  Calendrier
                </label>
                <input
                  type="radio"
                  name="tabView"
                  id="tab-calendar"
                  value="calendar"
                  checked={currentTab === "calendar"}
                  onChange={onChange}
                  className="hidden"
                />
              </div>
              <select
                value={undefined}
                className="select select-lg  h-full w-31 pr-5"
              >
                <option disabled={true}>Statut</option>
                {Object.keys(statusList).map((key) => (
                  <option key={key} value={key}>
                    {statusList[key as TaskStatus]}
                  </option>
                ))}
              </select>
              <div className="h-full">
                <SearchBar />
              </div>
            </div>
          </div>

          {tasksOfProject?.map((task) => (
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
                  <UserInitialsButton
                    key={assignee.user?.id}
                    user={assignee.user}
                    showFull
                  />
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
                        <UserInitialsButton user={comment.author} />
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
                      key={project?.owner?.id}
                      user={project?.owner}
                    />
                  </div>
                  <input
                    type="text"
                    className="input bg-white h-15 w-full"
                    placeholder="Ajouter un commentaire..."
                  />
                  <button className="btn btn-primary">Envoyer</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
