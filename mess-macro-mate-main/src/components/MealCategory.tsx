import FoodCard from "./FoodCard";
import type { FoodItem, MealName } from "@/lib/mess-types";

type Props = {
  title: string;
  icon: string;
  meal: MealName;

  foods: {
    item: FoodItem;
    servings: number;
  }[];

  menuItems: FoodItem[];

  onSwap: (
    oldId: string,
    newId: string,
  ) => void;

  onIncreaseServing: (
    itemId: string,
  ) => void;

  onDecreaseServing: (
    itemId: string,
  ) => void;
};

export default function MealCategory({
  title,
  icon,
  meal,
  foods,
  menuItems,
  onSwap,
  onIncreaseServing,
  onDecreaseServing,
}: Props) {
  if (foods.length === 0) return null;

  return (
    <div>
      <h3 className="mb-2 font-semibold">
        {icon} {title}
      </h3>

      <div className="space-y-2">
        {foods.map(({ item, servings }) => (
          <FoodCard
            key={item.id}
            item={item}
            servings={servings}
            meal={meal}
            menuItems={menuItems}
            onSwap={onSwap}
            onIncreaseServing={() =>
              onIncreaseServing(item.id)
            }
            onDecreaseServing={() =>
              onDecreaseServing(item.id)
            }
          />
        ))}
      </div>
    </div>
  );
}