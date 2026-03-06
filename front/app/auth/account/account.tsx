"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import styles from "./Account.module.css";
import { User } from "@front/types/auth";

export const tokenKey = "auth-key";

type AccountProps = {
  user: User | null;
  onSubmit: (
    name: string,
    email: string,
    password?: string,
  ) => void | Promise<void>;
};

export default function UpdateMyAccount(props: AccountProps) {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (props.user) {
      const parts = props.user.name?.split(" ") ?? [];

      setFirstName(parts[0] ?? "");
      setLastName(parts.slice(1).join(" "));
      setEmail(props.user.email ?? "");
    }
  }, [props.user]);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    if (
      ![null, undefined, ""].includes(lastName?.trim()) &&
      ![null, undefined, ""].includes(firstName?.trim()) &&
      ![null, undefined, ""].includes(email?.trim()) &&
      ![null, undefined, ""].includes(password?.trim())
    ) {
      const name = `${firstName} ${lastName}`;
      await props.onSubmit(name, email, password || undefined);
    }
  }

  return (
    <div className={`${styles["page-content"]} max-md:flex-col`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h1>Mon compte</h1>
        <p className="text-base">
          {firstName} {lastName}
        </p>

        <fieldset className="fieldset">
          <label className="label" htmlFor="lastName">
            Nom
          </label>
          <input
            id="lastName"
            type="text"
            className="input"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </fieldset>

        <fieldset className="fieldset">
          <label className="label" htmlFor="firstName">
            Prénom
          </label>
          <input
            id="firstName"
            type="text"
            className="input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </fieldset>

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
          Modifier les informations
        </button>
      </form>
    </div>
  );
}
