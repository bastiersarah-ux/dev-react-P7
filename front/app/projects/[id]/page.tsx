"use client";

import { useParams } from "next/navigation";
import PageHeader from "@front/app/components/PageHeader";
import StatusBadge from "@front/app/components/tasks/StatusBadge";
import UserInitialsButton from "../../components/users/UserInitialsButton";
import { useTasksOfProject } from "@front/hooks/useTaskOfProject";
import { useDashboardProjects } from "@front/hooks/useDashboardProjects";
import SearchBar from "@front/app/components/tasks/SearchBar";
import { useState, ChangeEvent, useEffect } from "react";
import ListIcon from "@front/public/list-icon.svg";
import CalendarIcon from "@front/public/orange-calendar-icon.svg";
import ArrowLeftIcon from "@front/public/arrow-left.svg";
import Image from "next/image";
import { ProjectMember, TaskStatus } from "@front/types/api-types";
import Link from "next/link";
import CreateOrUpdateTask from "@front/app/components/tasks/CreateOrUpdateTask";
import CreateOrUpdateProject from "@front/app/components/tasks/CreateOrUpdateProject";
import { useProjectById } from "@front/hooks/useProject";
import ListAiTask from "@front/app/components/tasks/ListAiTask";
import { getProjectMemberWithRealRole } from "@front/helpers/project-helper";

export default function ProjectDetail() {
  const params = useParams();
  const [members, setMembers] = useState<ProjectMember[]>([]);
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

  useEffect(() => {
    if (project) {
      setMembers(getProjectMemberWithRealRole(project));
    } else {
      setMembers([]);
    }
  }, [project]);

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
            <ListAiTask />
          </div>
        </div>

        <div className="navbar bg-base-200 rounded-box px-4">
          <div className="flex-1 gap-2 flex items-center">
            <span className="font-semibold">Contributeurs</span>
            <span className="text-sm opacity-60">
              {members.length} personnes
            </span>
          </div>
          <div className="flex items-center gap-2">
            {members
              .filter((member) => member.role === "OWNER")
              .map((member) => (
                <div key={member.id} className="flex items-center gap-2 h-6.75">
                  <UserInitialsButton user={member.user} showFull />
                </div>
              ))}

            {members
              .filter((member) => member.role !== "OWNER")
              .map((member) => (
                <div key={member.id} className="flex items-center gap-2 h-6.75">
                  <UserInitialsButton
                    user={member.user}
                    showFull
                    variant={"Variant2"}
                  />
                </div>
              ))}
          </div>
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
              <div>
                <SearchBar />
              </div>
            </div>
          </div>

          {tasksOfProject?.map((task) => (
            <div
              key={task.id}
              className="card card-border border-gray-200 px-6.25 py-10 no-link bg-white"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span>{task.title}</span>
                  <StatusBadge status={task.status} />
                </div>

                <span>{task.description}</span>
              </div>
              <span>
                Échéance : {new Date(task.dueDate!)?.toLocaleDateString()}
              </span>

              <div className="flex items-center gap-5 h-6.75">
                <span>Assigné à :</span>
                {(task.assignees ?? []).map((assignee) => {
                  const isOwner =
                    members.find(
                      (member) => member.user.id == assignee.user?.id,
                    )?.role == "OWNER";
                  return (
                    <UserInitialsButton
                      key={assignee.user?.id}
                      user={assignee.user}
                      showFull
                      variant={!isOwner ? "Variant2" : null}
                    />
                  );
                })}
              </div>
              <div className="divider"></div>
              <details className="collapse collapse-arrow w-full">
                <summary className="collapse-title p-0">
                  Commentaires ({task.comments?.length ?? 0})
                </summary>
                <div className="collapse-content mt-6">
                  <div className="space-y-4">
                    {task.comments?.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="bg-neutral text-neutral-content rounded-full w-14 h-14">
                          <UserInitialsButton user={comment.author} fullWidth />
                        </div>

                        <div className="flex-1 bg-gray-100 rounded-xl p-3">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">
                              {comment.author?.name}
                            </span>
                            <span className="text-gray-400 text-[10px]">
                              {new Date(comment.createdAt!)?.toLocaleDateString(
                                "fr-FR",
                                {
                                  day: "numeric",
                                  month: "long",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-6 items-center">
                    <div className="w-18 h-14">
                      <UserInitialsButton
                        key={project?.owner?.id}
                        user={project?.owner}
                        fullWidth
                      />
                    </div>
                    <input
                      type="text"
                      className="input bg-gray-50 h-15 w-full"
                      placeholder="Ajouter un commentaire..."
                    />
                    <button className="btn btn-primary">Envoyer</button>
                  </div>
                </div>
              </details>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
