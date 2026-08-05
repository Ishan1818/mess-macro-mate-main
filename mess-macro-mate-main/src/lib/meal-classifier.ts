import type { FoodItem } from "./mess-types";

export type MealCategory =
  | "Base"
  | "Protein"
  | "Vegetable"
  | "Drink"
  | "Side"
  | "Dessert";

export function classifyMealItem(food: FoodItem): MealCategory {
  const n = food.name.toLowerCase();

  if (
    n.includes("rice") ||
    n.includes("roti") ||
    n.includes("chapati") ||
    n.includes("dosa") ||
    n.includes("idli") ||
    n.includes("poha") ||
    n.includes("upma") ||
    n.includes("noodle") ||
    n.includes("pulao")
  )
    return "Base";

  if (
    n.includes("egg") ||
    n.includes("chicken") ||
    n.includes("fish") ||
    n.includes("paneer") ||
    n.includes("dal") ||
    n.includes("rajma") ||
    n.includes("chole") ||
    n.includes("soy") ||
    n.includes("chaap")
  )
    return "Protein";

  if (
    n.includes("salad") ||
    n.includes("sabzi") ||
    n.includes("vegetable") ||
    n.includes("bhindi") ||
    n.includes("gobi") ||
    n.includes("beans")
  )
    return "Vegetable";

  if (
    n.includes("milk") ||
    n.includes("lassi") ||
    n.includes("buttermilk")
  )
    return "Drink";

  if (
    n.includes("gulab") ||
    n.includes("halwa") ||
    n.includes("kheer") ||
    n.includes("ice cream")
  )
    return "Dessert";

  return "Side";
}