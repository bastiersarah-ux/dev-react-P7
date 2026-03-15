import { useEffect, useState } from "react";
import { DashboardProject } from "@front/types/api-types";
import { getDashboardProjects } from "@front/services/projectsService";

export const useDashboardProjects = () => {
  const [dashboardProjects, setDashboardProjects] = useState<
    DashboardProject[]
  >([]);

  useEffect(() => {
    const load = async () => {
      const data = await getDashboardProjects();
      setDashboardProjects(data);
    };

    load();
  }, []);

  return { dashboardProjects };
};
