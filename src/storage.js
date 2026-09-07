import AsyncStorage from "@react-native-async-storage/async-storage";
import { planForGear } from "./data";

const KEY = "homefit-v1";

export const emptyState = {
  onboarded: false,
  unit: "lb",
  name: "",
  gear: "both",
  plan: planForGear("both"),
  customWorkouts: [],
  sessions: [],
  weights: [],
};

export async function loadState() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return emptyState;
    const parsed = JSON.parse(raw);
    return {
      ...emptyState,
      ...parsed,
      gear: parsed.gear || "both",
      plan: parsed.plan?.length === 7 ? parsed.plan : planForGear(parsed.gear || "both"),
      customWorkouts: parsed.customWorkouts || [],
      sessions: parsed.sessions || [],
      weights: parsed.weights || [],
    };
  } catch {
    return emptyState;
  }
}

export async function saveState(state) {
  await AsyncStorage.setItem(KEY, JSON.stringify(state));
}

export function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function kgToLb(kg) {
  return kg * 2.2046226218;
}

export function lbToKg(lb) {
  return lb / 2.2046226218;
}

export function displayWeight(pounds, unit) {
  return unit === "lb" ? pounds : lbToKg(pounds);
}

export function streakCount(sessions) {
  const days = new Set(sessions.map((s) => s.date));
  let streak = 0;
  const cursor = new Date();
  if (!days.has(todayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (days.has(todayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
