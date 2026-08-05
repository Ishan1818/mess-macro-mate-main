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

  // These should already be filtered to the current meal.
  items: FoodItem[];

  onSelect: (id: string) => void;
};

export default function SwapDialog({
  open,
  onOpenChange,
  current,
  items,
  onSelect,
}: Props) {
  const currentCategory = classifyMealItem(current);

  const options = items.filter(
    (food) =>
      food.id !== current.id &&
      classifyMealItem(food) === currentCategory,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Swap {current.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {options.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No alternatives available.
            </p>
          ) : (
            options.map((food) => (
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
                  <div className="font-medium">
                    {food.name}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {food.serving}
                  </div>
                </div>

                <div className="text-right text-xs">
                  🔥 {Math.round(food.calories)} kcal
                  <br />
                  💪 {Math.round(food.protein)} g
                </div>
              </Button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}