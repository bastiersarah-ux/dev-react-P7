import {
  Project,
  ProjectMember,
  ProjectMemberRole,
} from "@front/types/api-types";

export const getProjectMemberWithRealRole = (
  project: Project,
): ProjectMember[] => {
  const ownerMember = project.members?.find(
    (member) => member.user.id == project.ownerId,
  );
  return (
    [
      {
        role: "OWNER" as ProjectMemberRole,
        id: ownerMember?.id ?? project.ownerId,
        user: project.owner!,
        joinedAt: ownerMember?.joinedAt ?? new Date(),
      },
    ].concat(
      project.members?.filter(
        (member) => member.role != "OWNER" && member.user.id != project.ownerId,
      ) ?? [],
    ) ?? []
  );
};

export function generateRandomId(prefix = "id") {
  return prefix + "_" + Math.random().toString(36).slice(2, 11);
}
