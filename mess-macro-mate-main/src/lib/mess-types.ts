export type MealName = "breakfast" | "lunch" | "dinner";

export const MEALS: MealName[] = ["breakfast", "lunch", "dinner"];

export const MEAL_LABEL: Record<MealName, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
};

export interface FoodItem {
  id: string;
  meal: MealName;
  name: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  maxServings: number;
}

export interface DailyMenu {
  date: string; // YYYY-MM-DD
  items: FoodItem[];
}

export type Goal = "lose" | "maintain" | "gain";
export type Activity = "sedentary" | "light" | "moderate" | "active" | "very_active";

export interface Profile {
  name: string;
  age: number;
  gender: "male" | "female";
  heightCm: number;
  weightKg: number;
  goalWeightKg: number;
  goal: Goal;
  activity: Activity;
  targetCalories?: number;
  proteinGoal?: number;
}

export interface Targets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface PlanEntry {
  itemId: string;
  servings: number;
}

export type MealPlan = Record<MealName, PlanEntry[]>;

export interface DayLog {
  date: string;
  water: number;
  weightKg?: number;
  plan?: MealPlan;
  eaten?: string[]; // itemIds marked as eaten
}
