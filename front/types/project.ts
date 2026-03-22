import { DashboardProject, Project, ProjectMember, User } from "./api-types";

export type ProjectItem = {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  owner?: User;
  members?: ProjectMember[];
  createdAt: Date;
  updatedAt: Date;
  done: number;
  total: number;
  percentage: number;
  earliestDueDate?: Date;
};

export const convertToProjectItemList = (
  dashboard: DashboardProject[],
  projects: Project[],
): ProjectItem[] => {
  const normalize = (name: string) => name.trim().toLowerCase();

  const normalizeMembers = (
    members?: ProjectMember[],
    ownerId?: string,
    owner?: User,
  ): ProjectMember[] => {
    if (!ownerId || !owner) return members ?? [];
    const ownerMember = members?.find((m) => m.user.id === ownerId);
    const others =
      members?.filter((m) => m.role !== "OWNER" && m.user.id !== ownerId) ?? [];
    return [
      {
        role: "OWNER",
        id: ownerMember?.id ?? ownerId,
        user: owner,
        joinedAt: ownerMember?.joinedAt ?? new Date(),
      },
      ...others,
    ];
  };

  const fromProjects = projects.map<ProjectItem>((project) => ({
    id: project.id,
    name: project.name,
    description: project.description,
    ownerId: project.ownerId,
    owner: project.owner,
    members: normalizeMembers(project.members, project.ownerId, project.owner),
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    done: 0,
    total: 0,
    percentage: 0,
  }));

  const fromDashboard = dashboard.map<ProjectItem>((project) => {
    const total = project.tasks?.length ?? 0;
    const done = project.tasks?.filter((t) => t.status === "DONE").length ?? 0;
    const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

    // Trouver la date d'échéance la plus ancienne parmi les tâches non terminées
    const dueDates = project.tasks
      ?.filter((t) => t.dueDate && (t.status === "TODO" || t.status === "IN_PROGRESS"))
      .map((t) => new Date(t.dueDate!).getTime()) ?? [];
    const earliestDueDate = dueDates.length > 0
      ? new Date(Math.min(...dueDates))
      : undefined;

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      ownerId: project.ownerId,
      owner: project.owner,
      members: normalizeMembers(
        project.members,
        project.ownerId,
        project.owner,
      ),
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      done,
      total,
      percentage,
      earliestDueDate,
    };
  });

  // fusion par id (ou par nom normalisé si nécessaire) pour éviter les doublons
  const byId = new Map<string, ProjectItem>();
  for (const item of [...fromProjects, ...fromDashboard]) {
    const key = item.id || normalize(item.name);
    const existing = byId.get(key);
    if (!existing) {
      byId.set(key, item);
    } else {
      byId.set(key, {
        ...existing,
        ...item,
        done: item.done || existing.done,
        total: item.total || existing.total,
        percentage: item.percentage || existing.percentage,
        earliestDueDate: item.earliestDueDate || existing.earliestDueDate,
      });
    }
  }

  return Array.from(byId.values()).sort((a, b) => {
    if (!a.earliestDueDate && !b.earliestDueDate) return 0;
    if (!a.earliestDueDate) return 1;
    if (!b.earliestDueDate) return -1;
    return new Date(a.earliestDueDate).getTime() - new Date(b.earliestDueDate).getTime();
  });
};
