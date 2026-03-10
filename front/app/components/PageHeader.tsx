"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./DashboardHeader.module.css";
import { useAuth } from "@front/context/AuthContext";
import Link from "next/link";

type PageHeaderProp = {
  title: string;
  subtitle: string;
};

export default function PageHeader({ title, subtitle }: PageHeaderProp) {
  return (
    <div className={styles["dashboard-header-custom"]}>
      <div>
        <h1 className="text-gray-800 text-2xl font-semibold">{title}</h1>

        <p className="text-sm">{subtitle}</p>
      </div>

      <button className="btn btn-neutral px-4 py-2 rounded">
        + Créer un projet
      </button>
    </div>
  );
}
