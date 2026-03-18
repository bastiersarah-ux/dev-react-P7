import { SuccessResponse } from "@front/types/api-types";

export const API_URL = "/api/proxy";

export async function fetchAPI<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<T | undefined> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const headers = new Headers(options.headers);
  const isServer = typeof window === "undefined";

  // Base d'origine pour le SSR (client reste en relatif)
  const origin =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${process.env.PORT || 8001}`);

  let url = `${API_URL}${normalizedPath}`;

  if (isServer) {
    // Construire une URL absolue
    url = new URL(url, origin).toString();
    // Propager tous les cookies entrants (y compris le token) si présents
    try {
      const { headers: nextHeaders } = await import("next/headers");
      const incoming = await nextHeaders();
      const cookieHeader = incoming?.get?.("cookie");
      if (cookieHeader && !headers.has("cookie")) {
        headers.set("cookie", cookieHeader);
      }
    } catch {
      // ignore si indisponible (build)
    }
  }

  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      cache: options.cache ?? "no-store",
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...Object.fromEntries(headers.entries()),
      },
      credentials: options.credentials ?? "include",
    });
  } catch (error: any) {
    throw new Error(
      `Erreur réseau lors de l'appel à ${url}: ${error?.message || error}`,
    );
  }

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!isJson) {
    const text = await res.text();
    if (!res.ok) {
      throw new Error(
        `Erreur ${res.status} ${res.statusText}${
          text ? `: ${text.slice(0, 200)}` : ""
        }`,
      );
    }
    // Si pas JSON mais OK, on renvoie undefined
    return undefined;
  }

  const body = (await res.json()) as SuccessResponse<T>;

  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
    throw new Error((body as any)?.message || "Erreur serveur");
  }

  return body.data;
}
