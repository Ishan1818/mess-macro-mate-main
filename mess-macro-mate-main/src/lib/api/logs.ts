import { supabase } from "@/lib/supabase";
import type { MealPlan } from "@/lib/mess-types";

export interface DailyLog {
  id?: number;
  user_id?: string;
  log_date: string;

  plan: MealPlan | null;

  eaten: string[];

  water: number;

  weight_kg: number | null;
}

export async function getDailyLog(
  userId: string,
  date: string,
): Promise<DailyLog | null> {
  const { data, error } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", userId)
    .eq("log_date", date)
    .maybeSingle();

  if (error) throw error;

  return data as DailyLog | null;
}

export async function saveDailyLog(
  userId: string,
  log: DailyLog,
): Promise<void> {
  const { error } = await supabase
    .from("daily_logs")
    .upsert(
      {
        user_id: userId,
        log_date: log.log_date,
        plan: log.plan,
        eaten: log.eaten,
        water: log.water,
        weight_kg: log.weight_kg,
      },
      {
        onConflict: "user_id,log_date",
      },
    );

  if (error) throw error;
}