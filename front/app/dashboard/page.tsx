import { Task } from "@front/types/api-types";
import PageHeader from "../components/PageHeader";
import DashboardClient from "./DashboardClient";
import { getDashboardProjects } from "@front/services/projectsService";
import { getServerAuth } from "@front/lib/server-auth";

export default async function DashboardPage() {
  const { user } = await getServerAuth();

  const projects = await getDashboardProjects({ cache: "no-store" });
  const tasks =
    projects
      .flatMap((p) => p.tasks.map((t) => ({ ...t, project: p })) || [])
      .sort((a, b) => {
        const p = { URGENT: 3, HIGH: 2, MEDIUM: 1, LOW: 0 } as any;
        return (p[b.priority] ?? 0) - (p[a.priority] ?? 0);
      }) ?? [];

  return (
    <>
      <DashboardClient tasks={tasks as Task[]} userName={user?.name ?? ""} />
    </>
  );
}
