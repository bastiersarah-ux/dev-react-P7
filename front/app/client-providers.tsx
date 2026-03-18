"use client";

import { AuthProvider } from "@front/context/AuthContext";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>{children}</AuthProvider>
  );
}
