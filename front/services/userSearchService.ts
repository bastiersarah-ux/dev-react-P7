import { fetchAPI } from "@front/services/fetch-api";
import { User } from "@front/types/api-types";

export const searchUsers = async (query: string): Promise<User[]> => {
  if (!query) return [];

  const res = await fetchAPI<{ users: User[] }>(
    `/users/search?query=${encodeURIComponent(query)}`,
  );

  return res?.users ?? [];
};
