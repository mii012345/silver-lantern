import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { getFirebaseDb } from "./firebase";

export interface Habit {
  id: string;
  name: string;
}

export function subscribeHabits(
  userId: string,
  callback: (habits: Habit[]) => void
) {
  const habitsRef = collection(getFirebaseDb(), "users", userId, "habits");
  const q = query(habitsRef, orderBy("createdAt", "asc"));
  return onSnapshot(q, (snapshot) => {
    const habits: Habit[] = snapshot.docs.map((d) => ({
      id: d.id,
      name: d.data().name,
    }));
    callback(habits);
  });
}

export async function addHabit(userId: string, name: string) {
  const habitsRef = collection(getFirebaseDb(), "users", userId, "habits");
  await addDoc(habitsRef, { name, createdAt: serverTimestamp() });
}

export async function deleteHabit(userId: string, habitId: string) {
  const habitRef = doc(getFirebaseDb(), "users", userId, "habits", habitId);
  await deleteDoc(habitRef);
}

export async function setLog(
  userId: string,
  habitId: string,
  dateStr: string,
  done: boolean
) {
  const logRef = doc(
    getFirebaseDb(),
    "users",
    userId,
    "habits",
    habitId,
    "logs",
    dateStr
  );
  await setDoc(logRef, { done, date: dateStr });
}

export function calcStreak(logs: Record<string, boolean>): number {
  let streak = 0;
  const d = new Date();

  while (true) {
    const dateStr = formatDate(d);
    if (logs[dateStr]) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function formatDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function getLogsForHabit(
  userId: string,
  habitId: string
): Promise<Record<string, boolean>> {
  const logsRef = collection(
    getFirebaseDb(),
    "users",
    userId,
    "habits",
    habitId,
    "logs"
  );
  const snapshot = await getDocs(logsRef);
  const logs: Record<string, boolean> = {};
  snapshot.docs.forEach((d) => {
    logs[d.id] = d.data().done;
  });
  return logs;
}
