"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "./Dashboard.module.css";
import DashboardHeader from "../components/DashboardHeader";
import DashboardTabs from "../components/DashboardTabs";
import TaskList from "../components/TaskList";
import SearchBar from "../components/SearchBar";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {}, [router]);

  return (
    <div>
      <main className="max-w-5xl mx-auto px-6">
        <DashboardHeader />

        <DashboardTabs />

        <div className="flex justify-between items-center mt-6">
          <h2 className="font-semibold">Mes tâches assignées</h2>
          <h3>Par ordre de priorité</h3>

          <SearchBar />
        </div>

        <TaskList />
      </main>
    </div>
  );
}
