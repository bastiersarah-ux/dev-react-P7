import React from "react";
import styles from "./UserInitialsButton.module.css";
import { getInitials } from "@front/services/userService";
import { UserButtonVariant } from "@front/types/props";
import { useAuth } from "@front/context/AuthContext";
import { User } from "@front/types/api-types";

type UserInitialsButtonProps = {
  user?: User;
  variant?: UserButtonVariant;
  showFull?: boolean;
  fullWidth?: boolean;
};

export default function UserInitialsButton({
  user,
  variant,
  showFull,
  fullWidth,
}: UserInitialsButtonProps) {
  const { user: currentUser } = useAuth();
  if (!currentUser || !user) return null;

  const cssClass = !!variant ? styles[`userIcon${variant}`] : "";
  const cssClassFull =
    variant == "Variant2" ? styles[`userIcon${variant}`] : "";

  const fullName =
    currentUser.id == user.id && showFull ? "Propriétaire" : user.name;

  if (showFull) {
    return (
      <div
        className={`flex items-center gap-3 justify-center ${fullWidth && "w-full"} h-full`}
      >
        <span
          className={`btn btn-circle border-none ${styles.userIcon} ${cssClass} ${fullWidth && "w-full"} h-full`}
        >
          {getInitials(user!.name ?? "")}
        </span>
        <span
          className={`btn btn-circle border-none ${styles.userIcon} w-auto px-5 ${cssClassFull} capitalize! h-full`}
        >
          {fullName}
        </span>
      </div>
    );
  }

  return (
    <span
      className={`btn btn-circle border-none ${styles.userIcon} ${cssClass} ${fullWidth && "w-full"} h-full`}
    >
      {getInitials(user!.name ?? "")}
    </span>
  );
}
