"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import Header from "@/components/Header";
import {
  Habit,
  subscribeHabits,
  setLog,
  formatDate,
  calcStreak,
  getLogsForHabit,
} from "@/lib/habits";
import { User } from "firebase/auth";
import styles from "./page.module.css";

function DashboardContent({ user }: { user: User }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [todayLogs, setTodayLogs] = useState<Record<string, boolean>>({});
  const [streaks, setStreaks] = useState<Record<string, number>>({});
  const [loadingHabits, setLoadingHabits] = useState(true);
  const [error, setError] = useState("");
  const today = formatDate(new Date());

  const loadLogsForHabits = useCallback(
    async (habitList: Habit[]) => {
      const newTodayLogs: Record<string, boolean> = {};
      const newStreaks: Record<string, number> = {};

      await Promise.all(
        habitList.map(async (habit) => {
          const logs = await getLogsForHabit(user.uid, habit.id);
          newTodayLogs[habit.id] = logs[today] || false;
          newStreaks[habit.id] = calcStreak(logs);
        })
      );

      setTodayLogs(newTodayLogs);
      setStreaks(newStreaks);
    },
    [user.uid, today]
  );

  useEffect(() => {
    const unsubscribe = subscribeHabits(
      user.uid,
      (h) => {
        setHabits(h);
        setLoadingHabits(false);
        loadLogsForHabits(h);
      },
      (err) => {
        setError("データの読み込みに失敗しました");
        setLoadingHabits(false);
        console.error("subscribeHabits error:", err);
      }
    );
    return unsubscribe;
  }, [user.uid, loadLogsForHabits]);

  const handleToggle = async (habitId: string) => {
    const currentDone = todayLogs[habitId] || false;
    const newDone = !currentDone;

    // Optimistic update
    setTodayLogs((prev) => ({ ...prev, [habitId]: newDone }));
    setError("");

    try {
      await setLog(user.uid, habitId, today, newDone);
      // Recalculate streak for this habit
      const logs = await getLogsForHabit(user.uid, habitId);
      setStreaks((prev) => ({ ...prev, [habitId]: calcStreak(logs) }));
    } catch {
      // Rollback on failure
      setTodayLogs((prev) => ({ ...prev, [habitId]: currentDone }));
      setError("記録の更新に失敗しました");
    }
  };

  const todayDisplay = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  return (
    <>
      <Header />
      <main className={styles.main}>
        <p className={styles.dateHeading}>{todayDisplay}</p>

        {error && <p className={styles.error}>{error}</p>}

        {loadingHabits ? (
          <p className={styles.loading}>読み込み中...</p>
        ) : habits.length === 0 ? (
          <p className={styles.emptyMessage}>
            習慣がまだありません。まずは習慣を追加しましょう！
          </p>
        ) : (
          <ul className={styles.habitList}>
            {habits.map((habit) => (
              <li
                key={habit.id}
                className={`${styles.habitItem} ${todayLogs[habit.id] ? styles.done : ""}`}
              >
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={todayLogs[habit.id] || false}
                  onChange={() => handleToggle(habit.id)}
                />
                <span className={styles.habitName}>{habit.name}</span>
                <span className={styles.streak}>
                  {streaks[habit.id]
                    ? `${streaks[habit.id]}日連続`
                    : ""}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className={styles.actions}>
          <Link href="/habits" className={styles.manageLink}>
            習慣を管理
          </Link>
        </div>
      </main>
    </>
  );
}

export default function Dashboard() {
  return <AuthGuard>{(user) => <DashboardContent user={user} />}</AuthGuard>;
}
