import { fetchAPI } from "@front/services/fetch-api";
import { DashboardProject, Project } from "@front/types/api-types";

export const getDashboardProjects = async (): Promise<DashboardProject[]> => {
  const res = await fetchAPI<{ projects: DashboardProject[] }>(
    "/dashboard/projects-with-tasks",
  );

  return res?.projects ?? [];
};

export const getProjectById = async (id: string): Promise<Project | null> => {
  const res = await fetchAPI<{ project: Project }>(`/projects/${id}`);
  return res?.project ?? null;
};
