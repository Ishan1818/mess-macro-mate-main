import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getTodayMenu } from "@/lib/api/menu";
import { MEALS, MEAL_LABEL } from "@/lib/mess-types";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Today's Menu — Mess Macro Planner" },
      {
        name: "description",
        content: "View today's hostel mess menu.",
      },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const menuQuery = useQuery({
    queryKey: ["today-menu"],
    queryFn: getTodayMenu,
  });

  if (menuQuery.isLoading) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Loading today's menu...
      </div>
    );
  }

  if (menuQuery.error) {
    return (
      <div className="py-20 text-center text-red-500">
        Failed to load today's menu.
      </div>
    );
  }

  const menu = menuQuery.data;

  if (!menu || menu.items.length === 0) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        No menu available for today.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Today's Menu 🍽️</h1>
        <div className="text-muted-foreground">
          {new Date(menu.date).toDateString()}
          <p className="text-sm text-muted-foreground">
  {menu.items.length} items available today
</p>
        </div>
      </div>

      {MEALS.map((meal) => {
        const foods = menu.items.filter((item) => item.meal === meal);

        return (
          <section key={meal} className="card-soft p-6">
            <h2 className="mb-5 text-2xl font-semibold">
              {MEAL_LABEL[meal]}
            </h2>

            {foods.length === 0 ? (
              <p className="text-muted-foreground">
                Nothing available.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {foods.map((food) => (
                  <div
                    key={food.id}
                    className="rounded-xl border border-border p-4 transition-all duration-200 hover:-translate-y-1 hover:bg-secondary/40"
                  >
                    <h3 className="font-semibold text-lg">
                      {food.name}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {food.serving}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2 text-sm">
                      <span className="rounded-full bg-secondary px-2 py-1">
                        🔥 {Math.round(food.calories)} kcal
                      </span>

                      <span className="rounded-full bg-secondary px-2 py-1">
                        💪 {Math.round(food.protein)} g
                      </span>

                      <span className="rounded-full bg-secondary px-2 py-1">
                        🍚 {Math.round(food.carbs)} g
                      </span>

                      <span className="rounded-full bg-secondary px-2 py-1">
                        🥑 {Math.round(food.fat)} g
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}