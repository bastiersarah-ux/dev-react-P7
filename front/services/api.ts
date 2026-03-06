import { SuccessResponse } from "@front/types/auth";

export const API_URL = "http://localhost:8000";

export async function fetchAPI<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<T | undefined> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Erreur serveur");
  }

  const response = (await res.json()) as SuccessResponse<T>;

  return response.data;
}
