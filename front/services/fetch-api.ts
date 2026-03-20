import { SuccessResponse } from "@front/types/api-types";

export const API_URL = "/api/proxy"
export class ValidationError extends Error {
  errors: Array<{ field: string; message: string }>;

  constructor(message: string, errors: Array<{ field: string; message: string }>) {
    super(message);
    this.name = "ValidationError";
    this.errors = errors;
  }
}

export async function fetchAPI<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<T | undefined> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const headers = new Headers(options.headers);
  const isServer = typeof window === "undefined";
  const origin =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${process.env.PORT || 8001}`);

  let url = `${API_URL}${normalizedPath}`;

  if (isServer) {
    url = new URL(url, origin).toString();
    try {
      const { headers: nextHeaders } = await import("next/headers");
      const incoming = await nextHeaders();
      const cookieHeader = incoming?.get?.("cookie");
      if (cookieHeader && !headers.has("cookie")) {
        headers.set("cookie", cookieHeader);
      }
    } catch {

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
        `Erreur ${res.status} ${res.statusText}${text ? `: ${text.slice(0, 200)}` : ""
        }`,
      );
    }
    return undefined;
  }

  const body = (await res.json()) as SuccessResponse<T>;

  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") {

      const currentPath = window.location.pathname;
      if (!currentPath.startsWith("/auth/")) {
        window.location.href = "/auth/login";
      }
    }

    const errorBody = body as { message?: string; data?: { errors?: Array<{ field: string; message: string }> } };
    if (errorBody.data?.errors && Array.isArray(errorBody.data.errors)) {
      throw new ValidationError(
        errorBody.message || "Erreur de validation",
        errorBody.data.errors
      );
    }

    throw new Error((body as { message: string })?.message || "Erreur serveur");
  }

  return body.data;
}
