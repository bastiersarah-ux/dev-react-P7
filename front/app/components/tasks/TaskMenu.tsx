"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { deleteTaskById } from "@front/services/taskService";
import Menu from "@front/public/menu.svg";

type TaskMenuProps = {
  taskId: string;
  projectId: string;
  onEdit: () => void;
};

export default function TaskMenu({ taskId, projectId, onEdit }: TaskMenuProps) {
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
      <summary className="btn w-14.25 h-14.25 mr-auto">
        <Image
          src={Menu}
          alt="Modifier ou supprimer une tâche"
          className="w-3.75"
        />
      </summary>

      <ul className="menu dropdown-content rounded-box z-1 w-52 p-2 shadow-sm bg-base-200">
        <li>
          <Link
            className="p-4 text-black! no-underline!"
            href="/account"
            onClick={() => {
              onEdit?.();
              closeDropdown;
            }}
          >
            Modifier
          </Link>
        </li>

        <li>
          <button
            className="p-4 text-left"
            onClick={() => {
              deleteTaskById(projectId, taskId);
              closeDropdown();
            }}
          >
            Supprimer
          </button>
        </li>
      </ul>
    </details>
  );
}
