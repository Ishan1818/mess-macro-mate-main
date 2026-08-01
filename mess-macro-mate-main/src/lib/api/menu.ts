import { supabase } from "@/lib/supabase";
import type { DailyMenu, FoodItem } from "@/lib/mess-types";

export async function getTodayMenu(): Promise<DailyMenu> {
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("daily_menu")
    .select(`
      menu_date,
      meal,
      available,
      food_items (
        id,
        name,
        serving_size,
        calories,
        protein,
        carbs,
        fat,
        max_servings
      )
    `)
    .eq("menu_date", today)
    .eq("available", true);

  if (error) throw error;

  const items: FoodItem[] = (data ?? []).map((row: any) => ({
    id: String(row.food_items.id),
    meal: row.meal,
    name: row.food_items.name,
    serving: row.food_items.serving_size,
    calories: Number(row.food_items.calories),
    protein: Number(row.food_items.protein),
    carbs: Number(row.food_items.carbs),
    fat: Number(row.food_items.fat),
    maxServings: row.food_items.max_servings,
  }));

  return {
    date: today,
    items,
  };
}
const today = new Date().toISOString().slice(0, 10);
console.log("today =", today);

const { data, error } = await supabase
  .from("daily_menu")
  .select(`
    menu_date,
    meal,
    available,
    food_items (
      id,
      name,
      serving_size,
      calories,
      protein,
      carbs,
      fat,
      max_servings
    )
  `)
  .eq("menu_date", today)
  .eq("available", true);
