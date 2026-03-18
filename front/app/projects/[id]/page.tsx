import { notFound } from "next/navigation";
import { getProjectById } from "@front/services/projectsService";
import { getTasksOfProject } from "@front/services/tasksOfProjectService";
import { getServerAuth } from "@front/lib/server-auth";
import ProjectClient from "./ProjectClient";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await getServerAuth();
  const { id: projectId } = await params;

  const project = await getProjectById(projectId, { cache: "no-store" });
  if (!project) return notFound();

  const tasks = await getTasksOfProject(projectId, { cache: "no-store" });

  return <ProjectClient project={project} tasks={tasks} />;
}
