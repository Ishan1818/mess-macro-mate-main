import { useCallback, useEffect, useState } from "react";
import type { DailyMenu, DayLog, FoodItem, Profile } from "./mess-types";

const KEYS = {
  profile: "mmp.profile",
  menu: "mmp.menu",
  log: "mmp.log",
};

export function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("mmp:store", { detail: key }));
}

function useStored<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setValue(read<T>(key) ?? fallback);
    setReady(true);
    const onChange = (e: Event) => {
      if ((e as CustomEvent).detail === key) setValue(read<T>(key) ?? fallback);
    };
    window.addEventListener("mmp:store", onChange);
    return () => window.removeEventListener("mmp:store", onChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const save = useCallback(
    (next: T) => {
      setValue(next);
      write(key, next);
    },
    [key],
  );

  return { value, save, ready };
}

export const SAMPLE_MENU: FoodItem[] = [
  { id: "b1", meal: "breakfast", name: "Idli", serving: "1 piece", calories: 58, protein: 2, carbs: 12, fat: 0.3, maxServings: 5 },
  { id: "b2", meal: "breakfast", name: "Sambar", serving: "1 bowl", calories: 120, protein: 6, carbs: 15, fat: 3, maxServings: 2 },
  { id: "b3", meal: "breakfast", name: "Coconut Chutney", serving: "2 tbsp", calories: 90, protein: 1, carbs: 3, fat: 8, maxServings: 2 },
  { id: "b4", meal: "breakfast", name: "Boiled Eggs", serving: "1 egg", calories: 78, protein: 6, carbs: 0.6, fat: 5, maxServings: 4 },
  { id: "b5", meal: "breakfast", name: "Milk", serving: "1 glass", calories: 150, protein: 8, carbs: 12, fat: 8, maxServings: 2 },
  { id: "l1", meal: "lunch", name: "Roti", serving: "1 roti", calories: 100, protein: 3, carbs: 20, fat: 1, maxServings: 4 },
  { id: "l2", meal: "lunch", name: "Dal", serving: "1 bowl", calories: 120, protein: 8, carbs: 16, fat: 2, maxServings: 3 },
  { id: "l3", meal: "lunch", name: "Rice", serving: "1 cup", calories: 210, protein: 4, carbs: 46, fat: 0.5, maxServings: 3 },
  { id: "l4", meal: "lunch", name: "Paneer Curry", serving: "100 g", calories: 260, protein: 18, carbs: 8, fat: 18, maxServings: 2 },
  { id: "l5", meal: "lunch", name: "Salad", serving: "1 bowl", calories: 40, protein: 2, carbs: 8, fat: 0.2, maxServings: 2 },
  { id: "l6", meal: "lunch", name: "Curd", serving: "1 bowl", calories: 100, protein: 6, carbs: 8, fat: 4, maxServings: 2 },
  { id: "d1", meal: "dinner", name: "Roti", serving: "1 roti", calories: 100, protein: 3, carbs: 20, fat: 1, maxServings: 4 },
  { id: "d2", meal: "dinner", name: "Dal", serving: "1 bowl", calories: 120, protein: 8, carbs: 16, fat: 2, maxServings: 3 },
  { id: "d3", meal: "dinner", name: "Rice", serving: "1 cup", calories: 210, protein: 4, carbs: 46, fat: 0.5, maxServings: 2 },
  { id: "d4", meal: "dinner", name: "Mixed Veg Sabzi", serving: "1 bowl", calories: 130, protein: 4, carbs: 14, fat: 6, maxServings: 2 },
  { id: "d5", meal: "dinner", name: "Salad", serving: "1 bowl", calories: 40, protein: 2, carbs: 8, fat: 0.2, maxServings: 2 },
];



export function useLog() {
  return useStored<Record<string, DayLog>>(KEYS.log, {});
}
