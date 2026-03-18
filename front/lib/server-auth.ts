import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { User } from "@front/types/api-types";
import { ACCESS_TOKEN_COOKIE } from "@front/helpers/auth-cookie";

type AuthResult = {
  user: User | null;
  token: string | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function getServerAuth(): Promise<AuthResult> {
  const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value ?? null;
  if (!token) {
    redirect("/auth/login");
  }

  const res = await fetch(`${API_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (res.status === 401) {
    redirect("/auth/login");
  }

  if (!res.ok) {
    throw new Error("Impossible de récupérer le profil utilisateur");
  }

  const data = await res.json();
  return { user: data?.data?.user ?? null, token };
}
