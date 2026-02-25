"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import Header from "@/components/Header";
import {
  Habit,
  subscribeHabits,
  addHabit,
  deleteHabit,
} from "@/lib/habits";
import { User } from "firebase/auth";
import styles from "./page.module.css";

function HabitsContent({ user }: { user: User }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [loadingHabits, setLoadingHabits] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeHabits(
      user.uid,
      (h) => {
        setHabits(h);
        setLoadingHabits(false);
      },
      (err) => {
        setError("データの読み込みに失敗しました");
        setLoadingHabits(false);
        console.error("subscribeHabits error:", err);
      }
    );
    return unsubscribe;
  }, [user.uid]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newHabitName.trim();
    if (!name) return;

    setAdding(true);
    setError("");
    try {
      await addHabit(user.uid, name);
      setNewHabitName("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "追加に失敗しました";
      setError(message);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (habitId: string) => {
    try {
      await deleteHabit(user.uid, habitId);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "削除に失敗しました";
      setError(message);
    }
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <h2 className={styles.heading}>習慣管理</h2>

        {error && <p className={styles.error}>{error}</p>}

        <form className={styles.addForm} onSubmit={handleAdd}>
          <input
            className={styles.input}
            type="text"
            placeholder="新しい習慣を入力..."
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            disabled={adding}
            maxLength={100}
          />
          <button
            className={styles.addButton}
            type="submit"
            disabled={adding || !newHabitName.trim()}
          >
            {adding ? "追加中..." : "追加"}
          </button>
        </form>

        {loadingHabits ? (
          <p className={styles.loading}>読み込み中...</p>
        ) : habits.length === 0 ? (
          <p className={styles.emptyMessage}>習慣がまだありません。</p>
        ) : (
          <ul className={styles.habitList}>
            {habits.map((habit) => (
              <li key={habit.id} className={styles.habitItem}>
                <span className={styles.habitName}>{habit.name}</span>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(habit.id)}
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}

        <Link href="/dashboard" className={styles.backLink}>
          ダッシュボードへ戻る
        </Link>
      </main>
    </>
  );
}

export default function Habits() {
  return <AuthGuard>{(user) => <HabitsContent user={user} />}</AuthGuard>;
}
