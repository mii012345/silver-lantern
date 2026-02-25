"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "firebase/auth";
import { signInWithGoogle, onAuthChange } from "@/lib/auth";
import styles from "./page.module.css";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthChange((user: User | null) => {
      if (user) {
        router.push("/dashboard");
      } else {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, [router]);

  const handleSignIn = async () => {
    setSigning(true);
    setError("");
    try {
      await signInWithGoogle();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "ログインに失敗しました";
      setError(message);
      setSigning(false);
    }
  };

  if (loading) {
    return (
      <main className={styles.container}>
        <p>読み込み中...</p>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.appName}>Silver Lantern</h1>
      <p className={styles.tagline}>
        今日やるべきことをチェックするだけ。シンプルな習慣トラッカー。
      </p>
      <button
        className={styles.googleButton}
        onClick={handleSignIn}
        disabled={signing}
      >
        {signing ? "ログイン中..." : "Googleでログイン"}
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </main>
  );
}
