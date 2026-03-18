import { fetchAPI } from "@front/services/fetch-api";
import { DashboardProject, Project } from "@front/types/api-types";
import { AddContributorInput } from "@front/types/api-types";
import { ProjectInput } from "@front/types/api-types";

export const getDashboardProjects = async (): Promise<DashboardProject[]> => {
  const res = await fetchAPI<{ projects: DashboardProject[] }>(
    "/dashboard/projects-with-tasks",
  );

  return res?.projects ?? [];
};

export const getProjects = async (): Promise<Project[]> => {
  const res = await fetchAPI<{ projects: Project[] }>("/projects");
  return res?.projects ?? [];
};

export const getProjectById = async (id: string): Promise<Project | null> => {
  const res = await fetchAPI<{ project: Project }>(`/projects/${id}`);
  return res?.project ?? null;
};

export const createProject = async (
  project: ProjectInput,
): Promise<Project | null> => {
  const res = await fetchAPI<{ project: Project }>("/projects", {
    method: "POST",
    body: JSON.stringify(project),
  });
  return res?.project ?? null;
};

export const updateProject = async (
  id: string,
  project: ProjectInput,
): Promise<Project | null> => {
  const res = await fetchAPI<{ project: Project }>(`/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(project),
  });
  return res?.project ?? null;
};

export const deleteProject = async (id: string): Promise<boolean> => {
  const res = await fetchAPI(`/projects/${id}`, {
    method: "DELETE",
  });
  return res?.success ?? true;
};

export const addContributor = async (
  projectId: string,
  contributor: AddContributorInput,
): Promise<boolean> => {
  const res = await fetchAPI(`/projects/${projectId}/contributors`, {
    method: "POST",
    body: JSON.stringify(contributor),
  });
  return res?.success ?? true;
};

export const removeContributor = async (
  projectId: string,
  userId: string,
): Promise<boolean> => {
  const res = await fetchAPI(`/projects/${projectId}/contributors/${userId}`, {
    method: "DELETE",
  });
  return res?.success ?? true;
};
