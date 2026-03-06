"use client";

import styles from "./Header.module.css";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import UserMenu from "./UserMenu";
import dashboardIcon from "@front/public/dashboard.svg";
import projetsIcon from "@front/public/projets.svg";
import { useAuth } from "@front/context/AuthContext";

const Header = () => {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <></>;

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Image
          className={styles.navbarStart}
          src="/img/logo-abircot.svg"
          alt="Logo Abricot"
          width={147}
          height={18.72}
        />
        <div className={styles.navbarCenter}>
          <Link
            href="/dashboard"
            className={`${styles.navItem} ${pathname === "/dashboard" ? styles.active : ""}`}
          >
            <Image src={dashboardIcon} alt="Dashboard" width={24} height={24} />
            <span>Tableau de bord</span>
          </Link>

          <Link
            href="/projets"
            className={`${styles.navItem} ${pathname === "/projets" ? styles.active : ""}`}
          >
            <Image src={projetsIcon} alt="Projets" width={24} height={24} />
            <span>Projets</span>
          </Link>
        </div>

        <UserMenu className={styles.navbarEnd} />
      </nav>
    </header>
  );
};

export default Header;
