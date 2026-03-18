import { SuccessResponse } from "@front/types/api-types";

export const API_URL = "/api/proxy";

export async function fetchAPI<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<T | undefined> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const res = await fetch(`${API_URL}${normalizedPath}`, {
    ...options,
    headers: {
      ...options.headers,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Erreur serveur");
  }

  const response = (await res.json()) as SuccessResponse<T>;

  return response.data;
}
