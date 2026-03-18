import { fetchAPI } from "@front/services/fetch-api";
import { DashboardProject, Project } from "@front/types/api-types";
import { AddContributorInput } from "@front/types/api-types";
import { ProjectInput } from "@front/types/api-types";

export const getDashboardProjects = async (
  init?: RequestInit,
): Promise<DashboardProject[]> => {
  const res = await fetchAPI<{ projects: DashboardProject[] }>(
    "/dashboard/projects-with-tasks",
    init,
  );

  return res?.projects ?? [];
};

export const getProjects = async (init?: RequestInit): Promise<Project[]> => {
  const res = await fetchAPI<{ projects: Project[] }>("/projects", init);
  return res?.projects ?? [];
};

export const getProjectById = async (
  id: string,
  init?: RequestInit,
): Promise<Project | null> => {
  const res = await fetchAPI<{ project: Project }>(`/projects/${id}`, init);
  return res?.project ?? null;
};

export const createProject = async (
  project: ProjectInput,
  init?: RequestInit,
): Promise<Project | null> => {
  const res = await fetchAPI<{ project: Project }>("/projects", {
    method: "POST",
    body: JSON.stringify(project),
    ...init,
  });
  return res?.project ?? null;
};

export const updateProject = async (
  id: string,
  project: ProjectInput,
  init?: RequestInit,
): Promise<Project | null> => {
  const res = await fetchAPI<{ project: Project }>(`/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(project),
    ...init,
  });
  return res?.project ?? null;
};

export const deleteProject = async (
  id: string,
  init?: RequestInit,
): Promise<boolean> => {
  const res = await fetchAPI(`/projects/${id}`, {
    method: "DELETE",
    ...init,
  });
  return res?.success ?? true;
};

export const addContributor = async (
  projectId: string,
  contributor: AddContributorInput,
  init?: RequestInit,
): Promise<boolean> => {
  const res = await fetchAPI(`/projects/${projectId}/contributors`, {
    method: "POST",
    body: JSON.stringify(contributor),
    ...init,
  });
  return res?.success ?? true;
};

export const removeContributor = async (
  projectId: string,
  userId: string,
  init?: RequestInit,
): Promise<boolean> => {
  const res = await fetchAPI(`/projects/${projectId}/contributors/${userId}`, {
    method: "DELETE",
    ...init,
  });
  return res?.success ?? true;
};
