import type {
  FoodItem,
  MealName,
  MealPlan,
} from "@/lib/mess-types";

/** Scale servings so the swap stays close to the original item's calories. */
function scaledServings(
  oldItem: FoodItem,
  newItem: FoodItem,
  oldServings: number,
): number {
  const targetCals = oldItem.calories * oldServings;
  if (newItem.calories <= 0) return oldServings;

  let servings = targetCals / newItem.calories;

  // Snap to 0.5 steps for bowls, whole numbers for pieces
  const serving = newItem.serving.toLowerCase();
  if (
    serving.includes("piece") ||
    serving.includes("egg") ||
    serving.includes("roti")
  ) {
    servings = Math.max(1, Math.round(servings));
  } else {
    servings = Math.max(0.5, Math.round(servings * 2) / 2);
  }

  return Math.min(servings, newItem.maxServings);
}

export function swapMealItem(
  plan: MealPlan,
  meal: MealName,
  oldId: string,
  newId: string,
  menuItems: FoodItem[],
): MealPlan {
  const entries = [...plan[meal]];

  const oldIndex = entries.findIndex((e) => e.itemId === oldId);
  if (oldIndex === -1) return plan;

  const oldEntry = entries[oldIndex];
  const oldItem = menuItems.find((i) => i.id === oldId);
  const newItem = menuItems.find((i) => i.id === newId);

  const newServings =
    oldItem && newItem
      ? scaledServings(oldItem, newItem, oldEntry.servings)
      : oldEntry.servings;

  const existingIndex = entries.findIndex((e) => e.itemId === newId);

  if (existingIndex !== -1 && existingIndex !== oldIndex) {
    entries[existingIndex] = {
      ...entries[existingIndex],
      servings: entries[existingIndex].servings + newServings,
    };
    entries.splice(oldIndex, 1);
  } else {
    entries[oldIndex] = {
      itemId: newId,
      servings: newServings,
    };
  }

  return { ...plan, [meal]: entries };
}
