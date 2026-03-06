"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // replace pour ne pas empiler l'historique
      router.replace("/auth/login");
    }
  }, [router]);

  return <>{children}</>;
}
