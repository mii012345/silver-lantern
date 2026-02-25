"use client";

import { signOut } from "@/lib/auth";
import styles from "./Header.module.css";

export default function Header() {
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Silver Lantern</h1>
      <button className={styles.signOutButton} onClick={handleSignOut}>
        ログアウト
      </button>
    </header>
  );
}
