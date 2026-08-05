import { useMemo, useState } from "react";

import {
  MEALS,
  type MealName,
  type MealPlan,
} from "@/lib/mess-types";

import {
  computeTargets,
  generatePlan,
  mealTargets,
  totalsFor,
} from "@/lib/nutrition";

import { swapMealItem } from "@/lib/swapMeal";

export function useMealPlanner(profile: any, menu: any) {
  const [generating, setGenerating] = useState(false);
  const [plan, setPlan] = useState<MealPlan | null>(null);

  const targets = useMemo(
    () => (profile ? computeTargets(profile) : null),
    [profile],
  );

  const generate = () => {
    if (!targets || !menu) return;

    setGenerating(true);

    const next = generatePlan(menu.items, targets);

    setPlan(next);

    setTimeout(() => setGenerating(false), 250);
  };

  const swap = (
  meal: MealName,
  oldId: string,
  newId: string,
) => {
  if (!plan) return;

  setPlan(
    swapMealItem(
      plan,
      meal,
      oldId,
      newId,
    ),
  );
};

  const dayTotals = useMemo(() => {
    if (!menu || !plan) {
      return {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      };
    }

    return MEALS.map((meal) =>
      totalsFor(plan[meal] ?? [], menu.items),
    ).reduce(
      (a, b) => ({
        calories: a.calories + b.calories,
        protein: a.protein + b.protein,
        carbs: a.carbs + b.carbs,
        fat: a.fat + b.fat,
      }),
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      },
    );
  }, [plan, menu]);

  return {
    targets,
    plan,
    generating,
    dayTotals,
    generate,
    swap,
  };
}