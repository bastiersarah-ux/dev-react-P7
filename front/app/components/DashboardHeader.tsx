import { useEffect, useRef, useState } from "react";
import styles from "./DashboardHeader.module.css";
import { useAuth } from "@front/context/AuthContext";
import Link from "next/link";

export default function DashboardHeader() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="flex justify-between items-center mt-6">
      <div>
        <h1 className="text-gray-800 text-2xl font-semibold">
          Tableau de bord
        </h1>

        <p className="bg-black text-sm">
          Bonjour {user.name}, voici un aperçu de vos projets et tâches
        </p>
      </div>

      <button className="btn btn-neutral px-4 py-2 rounded">
        + Créer un projet
      </button>
    </div>
  );
}
