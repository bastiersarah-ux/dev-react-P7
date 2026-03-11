import React from "react";
import styles from "./UserInitialsButton.module.css";
import { getInitials } from "@front/services/userService";
import { UserButtonVariant } from "@front/types/props";

type UserInitialsButtonProps = {
  name?: string;
  variant?: UserButtonVariant;
  showFull?: boolean;
};

export default function UserInitialsButton({
  name,
  variant,
  showFull,
}: UserInitialsButtonProps) {
  const cssClass = !!variant ? styles[`userIcon${variant}`] : "";

  return (
    <div
      className={`flex items-center gap-3 justify-center ${!showFull && "w-full h-full"}`}
    >
      <span
        className={`btn btn-circle border-none ${styles.userIcon} ${cssClass} ${!showFull && "w-full h-full"}`}
      >
        {getInitials(name)}
      </span>
      {showFull && (
        <span
          className={`btn btn-circle border-none ${styles.userIcon} w-auto px-5 ${cssClass}`}
        >
          {name}
        </span>
      )}
    </div>
  );
}
