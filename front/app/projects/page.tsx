import PageHeader from "../components/PageHeader";
import { ProjectMember, ProjectMemberRole, Task } from "@front/types/api-types";
import Image from "next/image";
import TeamIcon from "@front/public/team.svg";
import UserInitialsButton from "../components/users/UserInitialsButton";
import Link from "next/link";
import {
  getDashboardProjects,
  getProjects,
} from "@front/services/projectsService";
import { getServerAuth } from "@front/lib/server-auth";
import { convertToProjectItemList } from "@front/types/project";

export default async function ProjectPage() {
  await getServerAuth();
  const dashboardProjects = await getDashboardProjects({ cache: "no-store" });
  const ownerProjects = await getProjects({ cache: "no-store" });

  const projects = convertToProjectItemList(dashboardProjects, ownerProjects);

  return (
    <main className="px-44 py-17.5 flex flex-col gap-19  flex-1">
      <div className="w-full">
        <PageHeader title="Mes projets" subtitle="Gérez vos projets" />
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
        {projects.map((project) => {
          const { done, total, percentage } = project;
          const members: ProjectMember[] = project.members ?? [];

          return (
            <div key={project.id} className="h-full">
              <Link
                href={`/projects/${project.id}`}
                key={project.id}
                className="card h-full p-5 gap-14 no-link bg-white flex flex-col"
              >
                <div>
                  <h3>{project.name}</h3>
                  <h4>{project.description}</h4>
                </div>

                {total > 0 && (
                  <div>
                    <div className="flex justify-between">
                      <h5>Progression</h5>
                      <span>{percentage}%</span>
                    </div>
                    <progress
                      className="progress w-full bg-gray-200"
                      value={percentage}
                      max={100}
                    />
                    <h6>
                      {done}/{total} tâches terminées
                    </h6>
                  </div>
                )}

                {total === 0 && <p>Aucune tâche pour ce projet</p>}
                <div className="flex flex-col gap-2 mt-auto">
                  <div className="flex items-center gap-2">
                    <Image
                      src={TeamIcon}
                      alt="Icône équipe"
                      width={11.58}
                      height={11}
                    />
                    <h6>Équipe ({members.length ?? 0})</h6>
                  </div>
                  <div className="flex gap-2 h-6.75 flex-wrap">
                    {members
                      .filter((m) => m.role == "OWNER")
                      .map((member) => (
                        <UserInitialsButton
                          key={member.id}
                          user={member.user}
                          variant={"Variant3"}
                          showFull={member.role === "OWNER"}
                        />
                      ))}
                    <div className="">
                      {members
                        .filter((m) => m.role != "OWNER")
                        .map((member) => (
                          <UserInitialsButton
                            key={member.id}
                            user={member.user}
                            variant={"Variant2"}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}
