"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import dashboardIcon from "@front/public/dashboard.svg";
import projetsIcon from "@front/public/projets.svg";
import styles from "./Header.module.css";

interface NavMenuProps {
  vertical?: boolean;
}

const NavMenu = ({ vertical = false }: NavMenuProps) => {
  const pathname = usePathname();

  const links = [
    {
      href: "/dashboard",
      label: "Tableau de bord",
      icon: dashboardIcon,
      exact: true,
    },
    { href: "/projects", label: "Projets", icon: projetsIcon, exact: false },
  ];

  const isActive = (link: { href: string; exact: boolean }) => {
    if (link.exact) {
      return pathname === link.href;
    } else {
      return pathname.startsWith(link.href);
    }
  };

  return (
    <ul
      className={`menu ${vertical ? "menu-vertical gap-2" : "menu-horizontal gap-4"} px-1`}
    >
      {links.map((link) => (
        <li key={link.href} className={styles.navItem}>
          <Link
            href={link.href}
            className={`btn btn-ghost ${
              isActive(link) ? "btn-active text-base-200!" : ""
            }`}
          >
            <div
              className={styles.logo}
              style={{ maskImage: `url(${link.icon.src})` }}
            />
            <span>{link.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavMenu;
