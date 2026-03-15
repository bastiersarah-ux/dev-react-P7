"use client";

import { fetchAPI } from "@front/services/fetch-api";
import type { RegisterForm, TokenResponse } from "@front/types/api-types";
import AuthTemplate from "@front/app/components/auth/AuthTemplate";

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
      return null;
    }
  }

  return (
    <>
      <AuthTemplate isLogin={false} onSubmit={register} />
    </>
  );
}
