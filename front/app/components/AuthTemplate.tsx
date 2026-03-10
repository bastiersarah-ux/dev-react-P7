"use client";

import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./AuthTemplate.module.css";
import Image from "next/image";
import AbricotIcon from "@front/public/logo-abricot.svg";
import { TokenResponse } from "@front/types/api-types";
import { useAuth } from "@front/context/AuthContext";

export const tokenKey = "auth-key";

type AuthTemplateProps = {
  isLogin: boolean;
  onSubmit: (email: string, password: string) => Promise<TokenResponse | null>;
};

export default function AuthTemplate(props: AuthTemplateProps) {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    if (
      ![null, undefined, ""].includes(email?.trim()) &&
      ![null, undefined, ""].includes(password?.trim())
    ) {
      const res = await props.onSubmit(email, password);
      if (res) {
        login(res.token, res.user);
      }
    }
  }

  return (
    <div className={`${styles["page-content"]} max-md:flex-col`}>
      <section className={styles["left-section"]}>
        <Image
          src={AbricotIcon}
          alt="Logo Abricot"
          width={252.57}
          height={32.17}
        />
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h1>{props.isLogin ? "Connexion" : "Inscription"}</h1>

          <fieldset className="fieldset">
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="text"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </fieldset>

          <fieldset className="fieldset">
            <label htmlFor="password" className="label">
              Mot de passe
            </label>
            <input
              id="password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </fieldset>

          <button className="btn btn-gray" type="submit">
            {props.isLogin ? "Se connecter" : "S'inscrire"}
          </button>
          {props.isLogin && <Link href="#">Mot de passe oublié ?</Link>}
        </form>
        <p className="flex gap-2">
          {props.isLogin ? (
            <>
              Pas encore de compte ?
              <Link href="/auth/register">Créer un compte</Link>
            </>
          ) : (
            <>
              Déjà inscrit ?<Link href="/auth/login">Se connecter</Link>
            </>
          )}
        </p>
      </section>

      <section className={styles["right-section"]}>
        <img
          src="/connexion.jpg"
          alt="Image connexion"
          className={styles["img"]}
        />
      </section>
    </div>
  );
}
