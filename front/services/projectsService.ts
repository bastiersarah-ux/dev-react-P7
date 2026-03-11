import { fetchAPI } from "@front/services/fetch-api";
import { DashboardProject } from "@front/types/api-types";

export const getDashboardProjects = async (): Promise<DashboardProject[]> => {
  const res = await fetchAPI<{ projects: DashboardProject[] }>(
    "/dashboard/projects-with-tasks",
  );

  return res?.projects ?? [];
};
