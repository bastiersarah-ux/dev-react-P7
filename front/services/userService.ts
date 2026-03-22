import { fetchAPI } from "@front/services/fetch-api";
import {
  UpdatePasswordInput,
  UpdateProfileInput,
  User,
} from "@front/types/api-types";

/** Retourne les initiales d'un nom */
export function getInitials(name?: string) {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

/** Récupère le profil de l'utilisateur connecté */
export const getProfile = async (init?: RequestInit): Promise<User | null> => {
  const res = await fetchAPI<{ user: User }>("/auth/profile", init);
  return res?.user ?? null;
};

/** Met à jour le profil utilisateur */
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

/** Met à jour le mot de passe */
export const updatePassword = async (
  data: UpdatePasswordInput,
  init?: RequestInit,
): Promise<boolean> => {
  await fetchAPI("/auth/password", {
    method: "PUT",
    body: JSON.stringify(data),
    ...init,
  });
  return true;
};
