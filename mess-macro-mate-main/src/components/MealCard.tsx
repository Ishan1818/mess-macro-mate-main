import { MacroBar } from "@/components/MacroBar";
import MealCategory from "./MealCategory";
import { classifyMealItem } from "@/lib/meal-classifier";
import MealReviewSection from "./MealReviewSection";

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

  includeHighTea: boolean;
  onToggleHighTea: () => void;

  onSwap: (
    meal: MealName,
    oldId: string,
    newId: string,
  ) => void;

  onIncreaseServing: (
    meal: MealName,
    itemId: string,
  ) => void;

  onDecreaseServing: (
    meal: MealName,
    itemId: string,
  ) => void;
};

export default function MealCard({
  meal,
  plan,
  menuItems,
  targets,
  includeHighTea,
  onToggleHighTea,
  onSwap,
  onIncreaseServing,
  onDecreaseServing,
}: Props) {
  const isHighTea = meal === "high_tea";

  const entries = plan[meal] ?? [];

  const totals = totalsFor(
    entries,
    menuItems,
  );

  const goal = mealTargets(
    targets,
    meal,
    includeHighTea,
  );

  /*
   * High Tea gets a card even when disabled.
   * The other meals keep their existing behavior.
   */
  if (
    entries.length === 0 &&
    (!isHighTea || includeHighTea)
  ) {
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

  /*
   * High Tea disabled state.
   */
  if (isHighTea && !includeHighTea) {
    return (
      <section className="card-soft flex flex-col p-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">
            {MEAL_LABEL[meal]}
          </h2>

          <button
            type="button"
            role="switch"
            aria-checked={false}
            onClick={onToggleHighTea}
            className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full bg-muted transition-colors"
          >
            <span className="inline-block h-5 w-5 translate-x-0.5 rounded-full bg-background shadow-sm transition-transform" />
          </button>
        </div>

        <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-lg bg-secondary/50 p-3">
          <input
            type="checkbox"
            checked={false}
            onChange={onToggleHighTea}
            className="h-4 w-4 accent-primary"
          />

          <span className="text-sm font-medium">
            I'm having High Tea
          </span>
        </label>

        <p className="mt-4 text-sm text-muted-foreground">
          High Tea is currently excluded from your meal plan.
        </p>
      </section>
    );
  }

  return (
    <section className="card-soft flex flex-col p-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">
          {MEAL_LABEL[meal]}
        </h2>

        <div className="flex items-center gap-2">
          {isHighTea && (
            <button
              type="button"
              role="switch"
              aria-checked={true}
              onClick={onToggleHighTea}
              className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full bg-primary transition-colors"
            >
              <span className="inline-block h-5 w-5 translate-x-5 rounded-full bg-background shadow-sm transition-transform" />
            </button>
          )}

          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
            {Math.round(totals.calories)} kcal ·{" "}
            {Math.round(totals.protein)}g P
          </span>
        </div>
      </div>

      {isHighTea && (
        <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-lg bg-secondary/50 p-3">
          <input
            type="checkbox"
            checked={true}
            onChange={onToggleHighTea}
            className="h-4 w-4 accent-primary"
          />

          <span className="text-sm font-medium">
            I'm having High Tea
          </span>
        </label>
      )}

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
                classifyMealItem(x.item) ===
                  category,
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
              onSwap={(oldId, newId) =>
                onSwap(
                  meal,
                  oldId,
                  newId,
                )
              }
              onIncreaseServing={(itemId) =>
                onIncreaseServing(
                  meal,
                  itemId,
                )
              }
              onDecreaseServing={(itemId) =>
                onDecreaseServing(
                  meal,
                  itemId,
                )
              }
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

      <MealReviewSection meal={meal} />
    </section>
  );
}