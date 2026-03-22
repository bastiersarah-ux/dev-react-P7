import {
  Project,
  ProjectMember,
  ProjectMemberRole
} from "@front/types/api-types";

/** Retourne les membres du projet avec le bon rôle */
export const getProjectMemberWithRealRole = (
  project: Project,
): ProjectMember[] => {
  const res = project.members?.filter(
    (member) => member.role != "OWNER" && member.user.id != project.ownerId,
  ) ?? [];
  const ownerMember = project.members?.find(
    (member) => member.user.id == project.ownerId,
  );
  return ownerMember ? [{
    role: "OWNER" as ProjectMemberRole,
    id: ownerMember?.id ?? project.ownerId,
    user: project.owner!,
    joinedAt: ownerMember?.joinedAt ?? new Date(),
  },].concat(res) : res;
};

/** Génère un id aléatoire */
export function generateRandomId(prefix = "id") {
  return prefix + "_" + Math.random().toString(36).slice(2, 11);
}
