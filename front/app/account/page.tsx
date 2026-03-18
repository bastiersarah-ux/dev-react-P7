"use client";

import { useEffect, useState } from "react";
import styles from "./Account.module.css";
import { User } from "@front/types/api-types";

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
    <div
      className={`${styles["page-content"]} max-md:flex-col px-25 flex justify-center items-center`}
    >
      <div className="card card-border border-gray-200 w-full bg-base-200">
        <div className="card-body">
          <h3 className="card-title">Mon compte</h3>
          <p className="text-base mb-4">
            {firstName} {lastName}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <fieldset className="fieldset">
              <label className="label text-black" htmlFor="lastName">
                Nom
              </label>
              <input
                id="lastName"
                type="text"
                className="input input-bordered"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </fieldset>

            <fieldset className="fieldset">
              <label className="label text-black" htmlFor="firstName">
                Prénom
              </label>
              <input
                id="firstName"
                type="text"
                className="input input-bordered"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </fieldset>

            <fieldset className="fieldset">
              <label className="label text-black" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="text"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </fieldset>

            <fieldset className="fieldset">
              <label htmlFor="password" className="label text-black">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </fieldset>

            <button className="btn self-start btn-primary mt-2" type="submit">
              Modifier les informations
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
