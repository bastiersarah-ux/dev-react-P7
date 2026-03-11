"use client";

import { useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { useDashboardProjects } from "./../../hooks/useProjects";
import { Task } from "@front/types/api-types";
import Image from "next/image";
import TeamIcon from "@front/public/team.svg";
import UserInitialsButton from "../components/UserInitialsButton";
import Link from "next/link";

export default function ProjectPage() {
  const { dashboardProjects } = useDashboardProjects();

  useEffect(() => {
    console.log(dashboardProjects);
  }, [dashboardProjects]);

  const getProgression = (tasks: Task[]) => {
    const total = tasks.length;
    const done = tasks.filter((task) => task.status === "DONE").length;
    const percentage = total > 0 ? Math.round((done / total) * 100) : 0;
    return { done, total, percentage };
  };

  return (
    <>
      <main className="max-w-5xl mx-auto px-6">
        <PageHeader title="Mes projets" subtitle="Gérez vos projets" />
      </main>
      <div className="grid grid-cols-3 gap-3">
        {dashboardProjects.map((project) => {
          const { done, total, percentage } = getProgression(project.tasks);
          const users = [project.owner!].concat(
            project.members
              ?.filter((member) => member.role != "OWNER")
              .map((member) => member.user) ?? [],
          );

          return (
            <Link
              href={`/projects/${project.id}`}
              key={project.id}
              className="card p-5 no-link bg-white"
            >
              <span>{project.name}</span>
              <span>{project.description}</span>

              {total > 0 && (
                <>
                  <div className="flex justify-between mb-2 text-sm font-medium">
                    <span>Progression</span>
                    <span>{percentage}%</span>
                  </div>
                  <progress
                    className="progress w-full bg-gray-200"
                    value={percentage}
                    max={100}
                  />
                  <p className="text-sm mt-2 text-gray-600">
                    {done}/{total} tâches terminées
                  </p>
                </>
              )}

              {total === 0 && <p>Aucune tâche pour ce projet</p>}
              <div className="flex flex-col items-center gap-2">
                <Image
                  src={TeamIcon}
                  alt="Icône équipe"
                  width={11.58}
                  height={11}
                />
                <span className="text-sm font-medium">
                  Équipe ({users.length ?? 0})
                </span>
                <div>
                  {users.map((user) => (
                    <UserInitialsButton
                      key={user.id}
                      name={user.name}
                      showFull
                    />
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

// const members = data
//   .flatMap((project) => project.members!)
//   .filter((member) => !!member);
// setProjectMembers(members);
