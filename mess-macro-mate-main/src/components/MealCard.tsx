import { MacroBar } from "@/components/MacroBar";
import MealCategory from "./MealCategory";
import { classifyMealItem } from "@/lib/meal-classifier";
import {
  mealTargets,
  totalsFor,
} from "@/lib/nutrition";
import {
  MEAL_LABEL,
  type FoodItem,
  type MealName,
  type MealPlan,
  type Targets,
} from "@/lib/mess-types";

type Props = {
  meal: MealName;
  plan: MealPlan;
  menuItems: FoodItem[];
  targets: Targets;

  onSwap: (
    meal: MealName,
    oldId: string,
    newId: string,
  ) => void;
};

export default function MealCard({
  meal,
  plan,
  menuItems,
  targets,
  onSwap,
}: Props) {
  const entries = plan[meal] ?? [];

  const totals = totalsFor(entries, menuItems);

  const goal = mealTargets(targets, meal);

  if (entries.length === 0) {
    return (
      <section className="card-soft flex flex-col p-5">
        <h2 className="text-lg font-semibold">
          {MEAL_LABEL[meal]}
        </h2>

        <p className="mt-4 text-sm text-muted-foreground">
          Nothing on the menu.
        </p>
      </section>
    );
  }

  return (
    <section className="card-soft flex flex-col p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {MEAL_LABEL[meal]}
        </h2>

        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
          {Math.round(totals.calories)} kcal ·{" "}
          {Math.round(totals.protein)}g P
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {(
          [
            "Base",
            "Protein",
            "Vegetable",
            "Drink",
            "Side",
            "Dessert",
          ] as const
        ).map((category) => {
          const foods = entries
            .map((entry) => {
              const item = menuItems.find(
                (i) => i.id === entry.itemId,
              );

              if (!item) return null;

              return {
                item,
                servings: entry.servings,
              };
            })
            .filter(
              (
                x,
              ): x is {
                item: FoodItem;
                servings: number;
              } =>
                x !== null &&
                classifyMealItem(x.item) === category,
            );

          return (
           <MealCategory
  key={category}
  title={category}
  icon={
    {
      Base: "🍚",
      Protein: "💪",
      Vegetable: "🥗",
      Drink: "🥛",
      Side: "🍽️",
      Dessert: "🍰",
    }[category]
  }
  meal={meal}
  foods={foods}
  menuItems={menuItems}
  onSwap={(oldId, newId) => onSwap(meal, oldId, newId)}
/>
          );
        })}
      </div>

      <div className="mt-4 space-y-2 border-t border-border pt-4">
        <MacroBar
          label="Calories"
          value={totals.calories}
          goal={goal.calories}
          unit=" kcal"
        />

        <MacroBar
          label="Protein"
          value={totals.protein}
          goal={goal.protein}
          tone="protein"
        />
      </div>
    </section>
  );
}