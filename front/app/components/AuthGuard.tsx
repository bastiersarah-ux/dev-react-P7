"use client";

import { useAuth } from "@front/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Wrappe le contenu avec une vérification globale du token.
 *
 * Par défaut, toute page sera redirigée vers `/auth/login` si aucun
 * token n'est trouvé. Les chemins commençant par `/auth` sont exclues
 * de la vérification (login, register, etc.).
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname?.startsWith("/auth");

  useEffect(() => {
    if (isAuthPage) return;

    if (!isAuthenticated) {
      logout();
    }
  }, [pathname, router]);

  if (isLoading || (!isAuthenticated && !isAuthPage))
    return (
      <div className="w-full flex-1 flex items-center justify-center">
        <span className="loading w-1/10 loading-spinner text-primary loading-xl"></span>
      </div>
    );

  return <>{children}</>;
}
