import { supabase } from "@/lib/supabase";
import { getLocalDateKey } from "@/lib/date";
import type { MealName } from "@/lib/mess-types";

export async function getMealReview(
  userId: string,
  meal: MealName,
) {
  const { data, error } = await supabase
    .from("meal_reviews")
    .select("*")
    .eq("user_id", userId)
    .eq("meal", meal)
    .eq("review_date", getLocalDateKey())
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function submitMealReview(
  userId: string,
  meal: MealName,
  rating: number,
  comment: string,
) {
  const { error } = await supabase
    .from("meal_reviews")
    .upsert({
      user_id: userId,
      review_date: getLocalDateKey(),
      meal,
      rating,
      comment,
      skipped: false,
    });

  if (error) throw error;
}

export async function skipMealReview(
  userId: string,
  meal: MealName,
) {
  const { error } = await supabase
    .from("meal_reviews")
    .upsert({
      user_id: userId,
      review_date: getLocalDateKey(),
      meal,
      skipped: true,
      rating: 5,
      comment: "",
    });

  if (error) throw error;
}