import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/mess-types";

function fromDb(row: any): Profile {
  return {
    name: row.name,
    age: row.age,
    gender: row.gender,
    heightCm: row.height_cm,
    weightKg: row.weight_kg,
    goalWeightKg: row.goal_weight_kg,
    goal: row.goal,
    activity: row.activity,
    targetCalories: row.target_calories,
    proteinGoal: row.protein_goal,
  };
}

function toDb(profile: Profile) {
  return {
    name: profile.name,
    age: profile.age,
    gender: profile.gender,
    height_cm: profile.heightCm,
    weight_kg: profile.weightKg,
    goal_weight_kg: profile.goalWeightKg,
    goal: profile.goal,
    activity: profile.activity,
    target_calories: profile.targetCalories,
    protein_goal: profile.proteinGoal,
  };
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;

  return data ? fromDb(data) : null;
}

export async function saveProfile(userId: string, profile: Profile) {
  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      ...toDb(profile),
    });

  if (error) throw error;
}