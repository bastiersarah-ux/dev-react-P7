import { fetchAPI } from "@front/services/fetch-api";
import { User } from "@front/types/api-types";

/** Recherche des utilisateurs par nom ou email */
export const searchUsers = async (
  query: string,
  init?: RequestInit,
): Promise<User[]> => {
  if (!query) return [];

  const res = await fetchAPI<{ users: User[] }>(
    `/users/search?query=${encodeURIComponent(query)}`,
    init,
  );

  return res?.users ?? [];
};
