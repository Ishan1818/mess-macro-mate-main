import type {
  FoodItem,
  MealName,
  MealPlan,
} from "@/lib/mess-types";

export function swapMealItem(
  plan: MealPlan,
  meal: MealName,
  oldId: string,
  newId: string,
): MealPlan {
  const entries = [...plan[meal]];

  const oldIndex = entries.findIndex(
    (e) => e.itemId === oldId,
  );

  if (oldIndex === -1) return plan;

  const oldEntry = entries[oldIndex];

  // Does the replacement already exist?
  const existingIndex = entries.findIndex(
    (e) => e.itemId === newId,
  );

  if (existingIndex !== -1) {
    // Merge servings
    entries[existingIndex] = {
      ...entries[existingIndex],
      servings:
        entries[existingIndex].servings +
        oldEntry.servings,
    };

    // Remove old entry
    entries.splice(oldIndex, 1);
  } else {
    // Simple replacement
    entries[oldIndex] = {
      ...oldEntry,
      itemId: newId,
    };
  }

  return {
    ...plan,
    [meal]: entries,
  };
}

export function getSwapCandidates(
  meal: MealName,
  currentId: string,
  menuItems: FoodItem[],
) {
  const current = menuItems.find(
    (i) => i.id === currentId,
  );

  if (!current) return [];

  return menuItems.filter(
    (item) =>
      item.meal === meal &&
      item.id !== currentId,
  );
}