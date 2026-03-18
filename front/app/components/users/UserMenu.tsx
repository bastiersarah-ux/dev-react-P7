"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@front/context/AuthContext";
import Link from "next/link";
import { UserButtonVariant } from "@front/types/props";
import UserInitialsButton from "./UserInitialsButton";

type UserMenuProps = {
  variant?: UserButtonVariant;
};

export default function UserMenu({ variant }: UserMenuProps) {
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDetailsElement>(null);

  const closeDropdown = () => {
    dropdownRef.current?.removeAttribute("open");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <details ref={dropdownRef} className="dropdown dropdown-end">
      <summary className="btn btn-ghost btn-circle mr-3 p-0  w-16.25 h-16.25">
        <UserInitialsButton user={user!} variant={variant} fullWidth />
      </summary>

      <ul className="menu dropdown-content rounded-box z-1 w-52 p-2 shadow-sm bg-base-200">
        <li>
          <Link
            className="p-4 text-black! no-underline!"
            href="/account"
            onClick={closeDropdown}
          >
            Mon compte
          </Link>
        </li>

        <li>
          <button
            className="p-4 text-left"
            onClick={() => {
              logout();
              closeDropdown();
            }}
          >
            Déconnexion
          </button>
        </li>
      </ul>
    </details>
  );
}
