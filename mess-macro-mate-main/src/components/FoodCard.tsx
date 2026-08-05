import { useState } from "react";
import { Button } from "@/components/ui/button";
import SwapDialog from "./SwapDialog";

import { formatServings } from "@/lib/nutrition";
import type {
  FoodItem,
  MealName,
} from "@/lib/mess-types";

type Props = {
  item: FoodItem;
  servings: number;

  meal: MealName;

  menuItems: FoodItem[];

  onSwap: (
    oldId: string,
    newId: string,
  ) => void;
};

export default function FoodCard({
  item,
  servings,
  meal,
  menuItems,
  onSwap,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="rounded-lg border border-border p-3">
        <div className="font-medium">
          {item.name}
        </div>

        <div className="mt-1 text-sm text-muted-foreground">
          {formatServings(servings, item.serving)}
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-secondary px-2 py-1">
            🔥 {Math.round(item.calories * servings)} kcal
          </span>

          <span className="rounded-full bg-secondary px-2 py-1">
            💪 {Math.round(item.protein * servings)}g
          </span>

          <span className="rounded-full bg-secondary px-2 py-1">
            🍚 {Math.round(item.carbs * servings)}g
          </span>

          <span className="rounded-full bg-secondary px-2 py-1">
            🥑 {Math.round(item.fat * servings)}g
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="mt-3 w-full"
          onClick={() => setOpen(true)}
        >
          🔄 Swap
        </Button>
      </div>

      <SwapDialog
        open={open}
        onOpenChange={setOpen}
        current={item}
        meal={meal}
        items={menuItems.filter((i) => i.meal === meal)}
        onSelect={(newId) => onSwap(item.id, newId)}
      />
    </>
  );
}