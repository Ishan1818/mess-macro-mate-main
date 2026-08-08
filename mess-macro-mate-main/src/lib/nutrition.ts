import type {
  Activity,
  FoodItem,
  Goal,
  MealName,
  MealPlan,
  PlanEntry,
  Profile,
  Targets,
} from "./mess-types";
import { MEALS } from "./mess-types";
import { classifyFood } from "./meal-classifier";

const ACTIVITY_FACTOR: Record<Activity, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export const ACTIVITY_LABEL: Record<Activity, string> = {
  sedentary: "Sedentary (little exercise)",
  light: "Light (1-3 days/week)",
  moderate: "Moderate (3-5 days/week)",
  active: "Active (6-7 days/week)",
  very_active: "Very active (athlete / physical job)",
};

export const GOAL_LABEL: Record<Goal, string> = {
  lose: "Lose fat",
  maintain: "Maintain",
  gain: "Gain muscle",
};

/** Mifflin-St Jeor BMR -> TDEE -> goal-adjusted targets. */
export function computeTargets(p: Profile): Targets {
  const bmr =
    10 * p.weightKg +
    6.25 * p.heightCm -
    5 * p.age +
    (p.gender === "male" ? 5 : -161);
  const tdee = bmr * ACTIVITY_FACTOR[p.activity];
  const adjust = p.goal === "lose" ? -0.18 : p.goal === "gain" ? 0.12 : 0;
  const calories = Math.round(p.targetCalories ?? tdee * (1 + adjust));

  const proteinPerKg = p.goal === "gain" ? 1.9 : p.goal === "lose" ? 2.0 : 1.6;
  const protein = Math.round(p.proteinGoal ?? p.weightKg * proteinPerKg);

  const fat = Math.round((calories * 0.25) / 9);
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));

  return { calories, protein, carbs, fat };
}

export const MEAL_SPLIT: Record<MealName, number> = {
  breakfast: 0.28,
  lunch: 0.4,
  dinner: 0.32,
};

export function mealTargets(t: Targets, meal: MealName): Targets {
  const f = MEAL_SPLIT[meal];
  return {
    calories: Math.round(t.calories * f),
    protein: Math.round(t.protein * f),
    carbs: Math.round(t.carbs * f),
    fat: Math.round(t.fat * f),
  };
}

export function totalsFor(entries: PlanEntry[], items: FoodItem[]): Targets {
  return entries.reduce<Targets>(
    (acc, e) => {
      const item = items.find((i) => i.id === e.itemId);
      if (!item) return acc;
      acc.calories += item.calories * e.servings;
      acc.protein += item.protein * e.servings;
      acc.carbs += item.carbs * e.servings;
      acc.fat += item.fat * e.servings;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
}

function score(actual: Targets, goal: Targets): number {
  let s = 0;

  s += Math.abs(goal.protein - actual.protein) * 12;
  s += Math.abs(goal.calories - actual.calories) * 3;
  s += Math.abs(goal.carbs - actual.carbs);
  s += Math.abs(goal.fat - actual.fat);

  if (actual.calories > goal.calories)
    s += (actual.calories - goal.calories) * 8;

  if (actual.protein < goal.protein)
    s += (goal.protein - actual.protein) * 20;

  return s;
}

/**
 * Constrained search: enumerate serving combinations (0..maxServings, half steps
 * for grain/rice style items) and keep the combination closest to the meal target.
 */
export function optimizeMeal(items: FoodItem[], goal: Targets): PlanEntry[] {
  if (items.length === 0) return [];

  const bases = items.filter((f) => classifyFood(f) === "base");
  const proteins = items.filter((f) => classifyFood(f) === "protein");
  const vegetables = items.filter((f) => classifyFood(f) === "vegetable");
  const drinks = items.filter((f) => classifyFood(f) === "drink");
  const sides = items.filter(
    (f) => classifyFood(f) === "side" || classifyFood(f) === "dessert",
  );

  const pool = [
    ...bases.slice(0, 2),
    ...proteins.slice(0, 2),
    ...vegetables.slice(0, 2),
    ...drinks.slice(0, 1),
    ...sides.slice(0, 1),
  ].filter(
    (food, index, self) =>
      self.findIndex((x) => x.id === food.id) === index,
  );

  const options = pool.map((item) => {
    const steps: number[] = [0];
    const serving = item.serving.toLowerCase();

    if (
      serving.includes("piece") ||
      serving.includes("egg") ||
      serving.includes("roti")
    ) {
      for (let i = 1; i <= item.maxServings; i++) {
        steps.push(i);
      }
    } else {
      const max =
        classifyFood(item) === "vegetable"
          ? Math.min(item.maxServings, 2)
          : item.maxServings;

      for (let s = 0.5; s <= max + 0.001; s += 0.5) {
        steps.push(Number(s.toFixed(1)));
      }
    }

    return steps;
  });

  let best: PlanEntry[] = [];
  let bestScore = Infinity;
  const current = new Array(pool.length).fill(0);
  let budget = 400000;

  const walk = (idx: number, running: Targets) => {
    if (budget-- <= 0) return;
    if (running.calories > goal.calories * 1.3) return;

    if (idx === pool.length) {
      const usedBases = current.filter(
        (_, i) => current[i] > 0 && classifyFood(pool[i]) === "base",
      ).length;
      const usedProteins = current.filter(
        (_, i) => current[i] > 0 && classifyFood(pool[i]) === "protein",
      ).length;

      let extraPenalty = 0;
      if (usedBases === 0) extraPenalty += 400;
      if (usedProteins === 0) extraPenalty += 500;

      const s = score(running, goal) + extraPenalty;

      if (s < bestScore) {
        bestScore = s;
        best = pool
          .map((item, i) => ({
            itemId: item.id,
            servings: current[i],
          }))
          .filter((x) => x.servings > 0);
      }

      return;
    }

    const item = pool[idx];

    for (const serving of options[idx]) {
      current[idx] = serving;
      walk(idx + 1, {
        calories: running.calories + item.calories * serving,
        protein: running.protein + item.protein * serving,
        carbs: running.carbs + item.carbs * serving,
        fat: running.fat + item.fat * serving,
      });
    }

    current[idx] = 0;
  };

  walk(0, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  return best;
}

export function generatePlan(items: FoodItem[], targets: Targets): MealPlan {
  const plan = {} as MealPlan;
  for (const meal of MEALS) {
    const mealItems = items.filter((i) => i.meal === meal);
    plan[meal] = optimizeMeal(mealItems, mealTargets(targets, meal));
  }
  return plan;
}

export function formatServings(n: number, serving: string) {
  const qty = n === 0.5 ? "½" : Number.isInteger(n) ? String(n) : String(n);
  return `${qty} × ${serving}`;
}
