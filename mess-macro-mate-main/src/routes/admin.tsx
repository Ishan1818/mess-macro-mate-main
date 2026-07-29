import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MEALS, MEAL_LABEL, type FoodItem, type MealName } from "@/lib/mess-types";
import { SAMPLE_MENU, todayKey, useMenu } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Upload Today's Mess Menu — Mess Macro Planner" },
      {
        name: "description",
        content:
          "Admin panel to enter today's mess menu with calories, protein, carbs and fat for each dish.",
      },
      { property: "og:title", content: "Upload Today's Mess Menu" },
      {
        property: "og:description",
        content: "Enter the day's dishes and macros once — students get optimized plans instantly.",
      },
    ],
  }),
  component: AdminPage,
});

function blank(meal: MealName): FoodItem {
  return {
    id: `${meal}-${Math.random().toString(36).slice(2, 9)}`,
    meal,
    name: "",
    serving: "1 serving",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    maxServings: 2,
  };
}

function AdminPage() {
  const { value: menu, save, ready } = useMenu();
  const [items, setItems] = useState<FoodItem[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (ready) setItems(menu.items);
  }, [ready, menu.items]);

  const update = (id: string, patch: Partial<FoodItem>) =>
    setItems((list) => list.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const publish = () => {
    save({ date: todayKey(), items: items.filter((i) => i.name.trim()) });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Today's mess menu</h1>
          <p className="text-sm text-muted-foreground">
            Enter each dish with its macros per serving. Saved menu date: {menu.date}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setItems(SAMPLE_MENU)}>
            Load sample menu
          </Button>
          <Button onClick={publish}>{saved ? "Published ✓" : "Publish menu"}</Button>
        </div>
      </div>

      {MEALS.map((meal) => (
        <section key={meal} className="card-soft overflow-hidden">
          <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-5 py-3">
            <h2 className="font-semibold">{MEAL_LABEL[meal]}</h2>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setItems((l) => [...l, blank(meal)])}
            >
              + Add dish
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Dish</th>
                  <th className="px-2 py-2 font-medium">Serving</th>
                  <th className="px-2 py-2 font-medium">Kcal</th>
                  <th className="px-2 py-2 font-medium">Protein</th>
                  <th className="px-2 py-2 font-medium">Carbs</th>
                  <th className="px-2 py-2 font-medium">Fat</th>
                  <th className="px-2 py-2 font-medium">Max</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.filter((i) => i.meal === meal).length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-muted-foreground">
                      No dishes yet for {MEAL_LABEL[meal].toLowerCase()}.
                    </td>
                  </tr>
                )}
                {items
                  .filter((i) => i.meal === meal)
                  .map((i) => (
                    <tr key={i.id} className="border-t border-border">
                      <td className="px-4 py-2">
                        <Input
                          value={i.name}
                          placeholder="e.g. Paneer curry"
                          onChange={(e) => update(i.id, { name: e.target.value })}
                        />
                      </td>
                      <td className="px-2 py-2">
                        <Input
                          className="w-28"
                          value={i.serving}
                          onChange={(e) => update(i.id, { serving: e.target.value })}
                        />
                      </td>
                      {(["calories", "protein", "carbs", "fat", "maxServings"] as const).map(
                        (field) => (
                          <td key={field} className="px-2 py-2">
                            <Input
                              className="w-20"
                              type="number"
                              step={field === "maxServings" ? "0.5" : "1"}
                              value={i[field]}
                              onChange={(e) => update(i.id, { [field]: Number(e.target.value) })}
                            />
                          </td>
                        ),
                      )}
                      <td className="px-2 py-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setItems((l) => l.filter((x) => x.id !== i.id))}
                        >
                          ✕
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
