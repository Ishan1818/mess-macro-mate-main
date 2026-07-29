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

function score(t: Targets, goal: Targets): number {
  const cal = Math.abs(t.calories - goal.calories) / Math.max(goal.calories, 1);
  const pro = Math.abs(t.protein - goal.protein) / Math.max(goal.protein, 1);
  const carb = Math.abs(t.carbs - goal.carbs) / Math.max(goal.carbs, 1);
  const fat = Math.abs(t.fat - goal.fat) / Math.max(goal.fat, 1);
  // protein is weighted hardest, then calories
  const overCal = t.calories > goal.calories ? cal * 0.6 : 0;
  return pro * 3 + cal * 2.2 + carb * 0.5 + fat * 0.5 + overCal;
}

/**
 * Constrained search: enumerate serving combinations (0..maxServings, half steps
 * for grain/rice style items) and keep the combination closest to the meal target.
 */
export function optimizeMeal(items: FoodItem[], goal: Targets): PlanEntry[] {
  if (items.length === 0) return [];
  const pool = [...items]
    .sort((a, b) => b.protein / Math.max(b.calories, 1) - a.protein / Math.max(a.calories, 1))
    .slice(0, 6);
  const options = pool.map((i) => {
    const steps: number[] = [0];
    for (let s = 0.5; s <= i.maxServings + 0.001; s += 0.5) steps.push(Number(s.toFixed(1)));
    return steps;
  });

  let best: PlanEntry[] = [];
  let bestScore = Infinity;

  const current: number[] = new Array(pool.length).fill(0);
  let budget = 400000;

  const walk = (idx: number, running: Targets) => {
    if (budget-- <= 0) return;
    if (running.calories > goal.calories * 1.35) return;
    if (idx === pool.length) {
      const s = score(running, goal);
      if (s < bestScore) {
        bestScore = s;
        best = pool
          .map((item, i) => ({ itemId: item.id, servings: current[i] }))
          .filter((e) => e.servings > 0);
      }
      return;
    }
    const item = pool[idx];
    for (const serv of options[idx]) {
      current[idx] = serv;
      walk(idx + 1, {
        calories: running.calories + item.calories * serv,
        protein: running.protein + item.protein * serv,
        carbs: running.carbs + item.carbs * serv,
        fat: running.fat + item.fat * serv,
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
