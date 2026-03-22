import { getProjectById } from "@front/services/projectsService";
import { Project } from "@front/types/api-types";
import { useEffect, useState } from "react";

/** Hook pour récupérer un projet par son id */
export const useProjectById = (id: string) => {
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await getProjectById(id);
      setProject(data);
    };

    load();
  }, []);

  return { project };
};
