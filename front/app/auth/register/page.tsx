"use client";

import { fetchAPI } from "@front/services/api";
import type { RegisterForm, TokenResponse } from "@front/types/auth";
import AuthTemplate from "@front/app/components/AuthTemplate";

export default function RegisterPage() {
  async function register(
    email: string,
    password: string,
  ): Promise<TokenResponse | null> {
    try {
      const data = await fetchAPI<TokenResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
          name: "",
        } as RegisterForm),
      });
      return data!;
    } catch (error: any) {
      alert(error.message);
    } finally {
      return null;
    }
  }

  return (
    <>
      <AuthTemplate isLogin={false} onSubmit={register} />
    </>
  );
}
