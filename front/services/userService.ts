import { fetchAPI } from "@front/services/fetch-api";
import {
  User,
  UpdateProfileInput,
  UpdatePasswordInput,
} from "@front/types/api-types";

export function getInitials(name?: string) {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export const getProfile = async (init?: RequestInit): Promise<User | null> => {
  const res = await fetchAPI<{ user: User }>("/auth/profile", init);
  return res?.user ?? null;
};

export const updateProfile = async (
  data: UpdateProfileInput,
  init?: RequestInit,
): Promise<User | null> => {
  const res = await fetchAPI<{ user: User }>("/auth/profile", {
    method: "PUT",
    body: JSON.stringify(data),
    ...init,
  });
  return res?.user ?? null;
};

export const updatePassword = async (
  data: UpdatePasswordInput,
  init?: RequestInit,
): Promise<boolean> => {
  const res = await fetchAPI("/auth/password", {
    method: "PUT",
    body: JSON.stringify(data),
    ...init,
  });
  return res?.success ?? false;
};
