"use client";

import { fetchAPI } from "@front/services/fetch-api";
import type { LoginForm, TokenResponse } from "@front/types/api-types";
import AuthTemplate from "@front/app/components/AuthTemplate";

export default function LoginPage() {
  async function logIn(
    email: string,
    password: string,
  ): Promise<TokenResponse | null> {
    try {
      const data = await fetchAPI<TokenResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
        } as LoginForm),
      });
      return data!;
    } catch (error: any) {
      alert(error.message);
      return null;
    }
  }

  return (
    <>
      <AuthTemplate isLogin={true} onSubmit={logIn} />
    </>
  );
}
