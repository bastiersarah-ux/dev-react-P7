"use client";

import { useState, useEffect, ChangeEvent } from "react";
import StatusBadge from "@front/app/components/tasks/StatusBadge";
import UserInitialsButton from "../../components/users/UserInitialsButton";
import SearchBar from "@front/app/components/tasks/SearchBar";
import ListIcon from "@front/public/list-icon.svg";
import OrangeCalendarIcon from "@front/public/orange-calendar-icon.svg";
import CalendarIcon from "@front/public/icon-calendar.svg";
import ArrowLeftIcon from "@front/public/arrow-left.svg";
import Image from "next/image";
import Link from "next/link";
import CreateOrUpdateTask from "@front/app/components/dialogs/CreateOrUpdateTask";
import CreateOrUpdateProject from "@front/app/components/dialogs/CreateOrUpdateProject";
import { getProjectMemberWithRealRole } from "@front/helpers/project-helper";
import {
  Project,
  ProjectMember,
  Task,
  TaskStatus,
} from "@front/types/api-types";
import ListAiTask from "@front/app/components/dialogs/CreateAiTask";

type Props = {
  project: Project;
  tasks: Task[];
};

export default function ProjectClient({ project, tasks }: Props) {
  const [members, setMembers] = useState<ProjectMember[]>([]);
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
    <main className=" px-11 py-17.5 flex w-full flex-wrap gap-4 flex-1">
      <Link className="btn w-14.25 h-14.25" href={"/projects"}>
        <Image src={ArrowLeftIcon} alt="Retour" className="w-3.75" />
      </Link>
      <div className="flex flex-col w-full flex-1 gap-8">
        <div className="flex flex-wrap gap-5">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center">
              <h2 className="text-gray-800 text-2xl font-semibold">
                {project?.name}
              </h2>
              <CreateOrUpdateProject projectToEdit={project} />
            </div>
            <p className="text-[18px]">{project?.description ?? ""}</p>
          </div>
          <div className="flex gap-2 flex-1 justify-end items-center">
            <CreateOrUpdateTask idProject={project.id} />
            <ListAiTask />
          </div>
        </div>
        <div className="navbar flex-wrap gap-2 bg-gray-100  rounded-box px-4 py-5">
          <div className="flex-1 gap-2 flex items-center">
            <span className="font-semibold">Contributeurs</span>
            <span className="text-sm opacity-60">
              {members.length} personne{members.length > 1 ? "s" : ""}
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

        <div className="card bg-white border border-gray-200 p-6 gap-5">
          <div className="flex items-center gap-4 flex-wrap justify-between w-full">
            <div className="flex flex-col flex-none">
              <h3 className="font-semibold">Mes tâches assignées</h3>
              <h4>Par ordre de priorité</h4>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex gap-4 h-11.25 justify-end-safe">
                <label
                  htmlFor="tab-list"
                  className={`btn btn-ghost flex h-full items-center text-(--color-warning-content) gap-2 ${
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
                  className={`btn btn-ghost flex h-full items-center text-(--color-warning-content) gap-2 ${
                    currentTab === "calendar" ? "bg-(--color-warning) " : ""
                  }`}
                >
                  <Image
                    src={OrangeCalendarIcon}
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
                className="select select-lg h-11.25 w-31 pr-5"
              >
                <option disabled={true}>Statut</option>
                {Object.keys(statusList).map((key) => (
                  <option key={key} value={key}>
                    {statusList[key as TaskStatus]}
                  </option>
                ))}
              </select>
              <div className="h-11.25">
                <SearchBar />
              </div>
            </div>
          </div>

          {(!tasks || tasks.length === 0) && (
            <p className="text-sm text-gray-500 text-center p-15">
              Aucune tâche assignée.
            </p>
          )}

          {tasks?.map((task) => (
            <div
              key={task.id}
              className="card card-border border-gray-200 px-6.25 py-10 no-link gap-5 bg-white"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <h3>{task.title}</h3>
                  <StatusBadge status={task.status} />
                </div>

                <h4>{task.description}</h4>
              </div>
              <span className="flex items-center gap-1.5">
                <h5>Échéance :</h5>
                <span className="flex items-center gap-1">
                  <Image
                    src={CalendarIcon}
                    alt="Icône calendar"
                    className="w-4 h-4"
                  />
                  {new Date(task.dueDate!)?.toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                  })}
                </span>
              </span>

              <div className="flex items-center gap-5 h-6.75 flex-wrap">
                <h5>Assigné à :</h5>
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
                          <UserInitialsButton
                            user={comment.author}
                            fullWidth
                            variant={
                              members.find(
                                (m) => m.user.id == comment.author?.id,
                              )?.role != "OWNER"
                                ? "Variant2"
                                : null
                            }
                          />
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
                    <div className="flex w-16 h-14">
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
                    <button className="btn btn-primary btn-outline">
                      Envoyer
                    </button>
                  </div>
                </div>
              </details>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
