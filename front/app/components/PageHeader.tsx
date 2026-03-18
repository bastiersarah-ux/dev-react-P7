"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./PageHeader.module.css";
import { useAuth } from "@front/context/AuthContext";
import Link from "next/link";
import CreateOrUpdateProject from "./tasks/CreateOrUpdateProject";

type PageHeaderProp = {
  title: string;
  subtitle: string;
};

export default function PageHeader({ title, subtitle }: PageHeaderProp) {
  return (
    <div className={styles["dashboard-header-custom"]}>
      <div>
        <h2>{title}</h2>

        <h3>{subtitle}</h3>
      </div>

      <CreateOrUpdateProject />
    </div>
  );
}
