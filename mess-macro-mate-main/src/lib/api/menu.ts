import { supabase } from "@/lib/supabase";
import { getLocalDateKey } from "@/lib/date";
import type { DailyMenu, FoodItem } from "@/lib/mess-types";

export async function getTodayMenu(): Promise<DailyMenu> {
  const today = getLocalDateKey();

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

 const unique = new Map<string, FoodItem>();

(data ?? []).forEach((row: any) => {
  unique.set(String(row.food_items.id), {
    id: String(row.food_items.id),
    meal: row.meal,
    name: row.food_items.name,
    serving: row.food_items.serving_size,
    calories: Number(row.food_items.calories),
    protein: Number(row.food_items.protein),
    carbs: Number(row.food_items.carbs),
    fat: Number(row.food_items.fat),
    maxServings: row.food_items.max_servings,
  });
});

const items = [...unique.values()];

  return {
    date: today,
    items,
  };
}
