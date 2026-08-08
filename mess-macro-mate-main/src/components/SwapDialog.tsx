import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import type { FoodItem } from "@/lib/mess-types";
import { classifyMealItem } from "@/lib/meal-classifier";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  current: FoodItem;
  currentServings: number;
  items: FoodItem[];
  onSelect: (id: string) => void;
};

function macroDelta(current: FoodItem, servings: number, next: FoodItem) {
  const oldCals = Math.round(current.calories * servings);
  const oldProtein = Math.round(current.protein * servings);
  const newCals = Math.round(next.calories * servings);
  const newProtein = Math.round(next.protein * servings);

  return {
    calDiff: newCals - oldCals,
    proteinDiff: newProtein - oldProtein,
  };
}

function formatDelta(n: number, unit: string) {
  if (n === 0) return `±0${unit}`;
  return `${n > 0 ? "+" : ""}${n}${unit}`;
}

export default function SwapDialog({
  open,
  onOpenChange,
  current,
  currentServings,
  items,
  onSelect,
}: Props) {
  const currentCategory = classifyMealItem(current);

  const options = items.filter(
    (food) =>
      food.id !== current.id && classifyMealItem(food) === currentCategory,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Swap {current.name}</DialogTitle>
        </DialogHeader>

        <p className="text-xs text-muted-foreground">
          Servings adjust automatically to stay close to your current calories.
        </p>

        <div className="space-y-3">
          {options.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No alternatives available.
            </p>
          ) : (
            options.map((food) => {
              const { calDiff, proteinDiff } = macroDelta(
                current,
                currentServings,
                food,
              );

              return (
                <Button
                  key={food.id}
                  variant="outline"
                  className="flex h-auto w-full items-center justify-between py-3"
                  onClick={() => {
                    onSelect(food.id);
                    onOpenChange(false);
                  }}
                >
                  <div className="text-left">
                    <div className="font-medium">{food.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {food.serving}
                    </div>
                  </div>

                  <div className="text-right text-xs tabular-nums">
                    <div>
                      {formatDelta(calDiff, " kcal")} ·{" "}
                      {formatDelta(proteinDiff, "g P")}
                    </div>
                    <div className="text-muted-foreground">
                      vs {current.name}
                    </div>
                  </div>
                </Button>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
