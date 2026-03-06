"use client";

import styles from "./Footer.module.css";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@front/context/AuthContext";

const Footer = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <footer className={styles.footer}>
      <div className={styles.start}>
        <Image
          src="/logo-noir.svg"
          alt="Logo Abricot noir"
          width={101}
          height={12.86}
        />
      </div>
      <div className={styles.end}>
        <Link href="#">Abricot 2025</Link>
      </div>
    </footer>
  );
};

export default Footer;
