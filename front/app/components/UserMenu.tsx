import { useState } from "react";
import styles from "./UserMenu.module.css";
import { useAuth } from "@front/context/AuthContext";

type UserMenuProps = {
  className?: string;
  isVariant?: boolean;
};

export default function UserMenu({ className, isVariant }: UserMenuProps) {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className={styles.container + " " + className}>
      <button
        className={`btn btn-circle btn-outline ${styles.userIcon} ${isVariant && styles.userIconVariant} w-16.25 h-16.25 relative top-5 left-5 
              rotate-0 opacity-100 px-3 py-5.25 gap-2.5 rounded-[32.5px]`}
        onClick={toggleMenu}
      >
        {getInitials(user?.name)}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <button className={styles.item}>Mon compte</button>
          <button className={styles.item} onClick={() => logout()}>
            Déconnexion
          </button>
        </div>
      )}
    </div>
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
