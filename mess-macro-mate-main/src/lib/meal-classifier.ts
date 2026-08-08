import type { FoodItem } from "./mess-types";

export type FoodRole =
  | "base"
  | "protein"
  | "vegetable"
  | "drink"
  | "dessert"
  | "side";

export type MealCategory =
  | "Base"
  | "Protein"
  | "Vegetable"
  | "Drink"
  | "Side"
  | "Dessert";

const ROLE_TO_CATEGORY: Record<FoodRole, MealCategory> = {
  base: "Base",
  protein: "Protein",
  vegetable: "Vegetable",
  drink: "Drink",
  dessert: "Dessert",
  side: "Side",
};

/** Single source of truth for food categorization (optimizer + UI). */
export function classifyFood(food: FoodItem): FoodRole {
  const name = food.name.toLowerCase();

  // Protein before vegetable keywords — "chicken masala" etc.
  if (
    name.includes("dal") ||
    name.includes("rajma") ||
    name.includes("chole") ||
    name.includes("paneer") ||
    name.includes("egg") ||
    name.includes("chicken") ||
    name.includes("fish") ||
    name.includes("soy") ||
    name.includes("chaap") ||
    name.includes("curd")
  ) {
    return "protein";
  }

  if (
    name.includes("rice") ||
    name.includes("chapati") ||
    name.includes("roti") ||
    name.includes("naan") ||
    name.includes("paratha") ||
    name.includes("pulao") ||
    name.includes("biryani") ||
    name.includes("fried rice") ||
    name.includes("noodle") ||
    name.includes("dosa") ||
    name.includes("idli") ||
    name.includes("poha") ||
    name.includes("upma")
  ) {
    return "base";
  }

  if (
    name.includes("milk") ||
    name.includes("lassi") ||
    name.includes("buttermilk")
  ) {
    return "drink";
  }

  if (
    name.includes("payasam") ||
    name.includes("halwa") ||
    name.includes("kheer") ||
    name.includes("ice cream") ||
    name.includes("gulab") ||
    name.includes("sweet")
  ) {
    return "dessert";
  }

  if (
    name.includes("salad") ||
    name.includes("sabzi") ||
    name.includes("bhindi") ||
    name.includes("parwal") ||
    name.includes("aloo") ||
    name.includes("gobi") ||
    name.includes("cabbage") ||
    name.includes("beans") ||
    name.includes("peas") ||
    name.includes("vegetable")
  ) {
    return "vegetable";
  }

  if (food.protein >= 12) return "protein";
  if (food.carbs >= 30) return "base";

  return "side";
}

export function classifyMealItem(food: FoodItem): MealCategory {
  return ROLE_TO_CATEGORY[classifyFood(food)];
}
