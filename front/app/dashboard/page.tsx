"use client";

import { ChangeEvent, useState } from "react";
import styles from "./Dashboard.module.css";
import PageHeader from "../components/PageHeader";
import TaskList from "../components/tasks/TaskList";
import { useTasks } from "@front/hooks/useTasks";
import TaskKanban from "../components/tasks/TaskKanban";
import Image from "next/image";
import KanbanIcon from "@front/public/kanban-icon.svg";
import ListIcon from "@front/public/list-icon.svg";
import { useAuth } from "@front/context/AuthContext";

type DashboardTabView = "list" | "kanban";

export default function DashboardPage() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<DashboardTabView>("list");
  const { tasks } = useTasks();

  const onChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setCurrentTab(ev.target.value as DashboardTabView);
  };

  return (
    <main className="max-w-5xl mx-auto px-6">
      <PageHeader
        title="Tableau de bord"
        subtitle={`Bonjour ${user?.name}, voici un aperçu de vos projets et tâches`}
      />

      <div className="join gap-4 my-6">
        <label
          htmlFor="tab-list"
          className={`join-item btn flex items-center text-(--color-warning-content) gap-2 ${
            currentTab === "list" ? "bg-(--color-warning)" : ""
          }`}
        >
          <Image src={ListIcon} alt="Icône liste" className="w-4 h-4" />
          Liste
        </label>
        <input
          type="radio"
          name="tabView"
          id="tab-list"
          value="list"
          checked={currentTab === "list"}
          onChange={onChange}
          className="hidden"
        />

        <label
          htmlFor="tab-kanban"
          className={`join-item btn flex items-center text-(--color-warning-content) gap-2 ${
            currentTab === "kanban" ? "bg-(--color-warning) " : ""
          }`}
        >
          <Image src={KanbanIcon} alt="Icône Kanban" className="w-4 h-4" />
          Kanban
        </label>
        <input
          type="radio"
          name="tabView"
          id="tab-kanban"
          value="kanban"
          checked={currentTab === "kanban"}
          onChange={onChange}
          className="hidden"
        />
      </div>
      {currentTab == "list" ? (
        <TaskList tasks={tasks} />
      ) : (
        <TaskKanban tasks={tasks} />
      )}
    </main>
  );
}
