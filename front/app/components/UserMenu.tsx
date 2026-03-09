import { useEffect, useRef, useState } from "react";
import styles from "./UserMenu.module.css";
import { useAuth } from "@front/context/AuthContext";
import Link from "next/link";

type UserMenuProps = {
  isVariant?: boolean;
};

export default function UserMenu({ isVariant }: UserMenuProps) {
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
      <summary
        className={`btn btn-circle border-none ${styles.userIcon} ${
          isVariant ? styles.userIconVariant : ""
        } w-16.25 h-16.25`}
      >
        {getInitials(user?.name)}
      </summary>

      <ul className="menu dropdown-content rounded-box z-1 w-52 p-2 shadow-sm bg-base-300">
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

function getInitials(name?: string) {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
