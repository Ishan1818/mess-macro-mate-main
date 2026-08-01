import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MacroBar } from "@/components/MacroBar";
import { Button } from "@/components/ui/button";
import { MEALS, MEAL_LABEL, type MealPlan } from "@/lib/mess-types";
import ProtectedRoute from "@/auth/ProtectedRoute";
import {
  computeTargets,
  formatServings, 
  generatePlan,
  mealTargets,
  totalsFor,
} from "@/lib/nutrition";
import { todayKey } from "@/lib/store";
import {
  getDailyLog,
  saveDailyLog,
  type DailyLog,
} from "@/lib/api/logs";
import { useAuthContext } from "@/auth/AuthProvider";
import { getProfile } from "@/lib/api/profile";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getTodayMenu } from "@/lib/api/menu";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mess Macro Planner — Hit your macros on hostel food" },
      {
        name: "description",
        content:
          "Enter your goals, upload today's mess menu, and get an optimized breakfast, lunch and dinner plan that hits your calories and protein.",
      },
      { property: "og:title", content: "Mess Macro Planner" },
      {
        property: "og:description",
        content: "Turn today's mess menu into a macro-perfect meal plan in one tap.",
      },
    ],
  }),
  component: Home,
});

function Home() {
const { session } = useAuthContext();

const profileQuery = useQuery({
  queryKey: ["profile", session?.user.id],
  enabled: !!session,
  queryFn: () => getProfile(session!.user.id),
});

const menuQuery = useQuery({
  queryKey: ["today-menu"],
  queryFn: getTodayMenu,
});

const profile = profileQuery.data;
const menu = menuQuery.data;
const queryClient = useQueryClient();
const [generating, setGenerating] = useState(false);

const date = todayKey();

const logQuery = useQuery({
  queryKey: ["daily-log", session?.user.id, date],
  enabled: !!session,
  queryFn: () => getDailyLog(session!.user.id, date),
});

const saveMutation = useMutation({
  mutationFn: (log: DailyLog) =>
    saveDailyLog(session!.user.id, log),
  onSuccess: async () => {
    await queryClient.invalidateQueries({
      queryKey: ["daily-log", session?.user.id, date],
    });
  },
});

const log = logQuery.data;

const plan = log?.plan ?? null;

const eaten = log?.eaten ?? [];

  const targets = useMemo(() => (profile ? computeTargets(profile) : null), [profile]);

    const updateLog = (patch: Partial<DailyLog>) => {
  saveMutation.mutate({
    log_date: date,
    plan: patch.plan ?? log?.plan ?? null,
    eaten: patch.eaten ?? log?.eaten ?? [],
    water: patch.water ?? log?.water ?? 0,
    weight_kg: patch.weight_kg ?? log?.weight_kg ?? null,
  });
};

  const handleGenerate = () => {
    if (!targets || !menu) return;
    setGenerating(true);
    const next: MealPlan = generatePlan(menu.items, targets);
    updateLog({ plan: next, eaten: [] });
    setTimeout(() => setGenerating(false), 250);
  };

  const dayTotals = useMemo(() => {
  if (!menu || !plan) {
    return {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    };
  }

  return MEALS.map((m) => totalsFor(plan[m] ?? [], menu.items)).reduce(
    (a, b) => ({
      calories: a.calories + b.calories,
      protein: a.protein + b.protein,
      carbs: a.carbs + b.carbs,
      fat: a.fat + b.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
}, [plan, menu]);

  

  if (
  profileQuery.isLoading ||
  menuQuery.isLoading ||
  logQuery.isLoading
) {
  return (
    <div className="py-20 text-center text-muted-foreground">
      Loading...
    </div>
  );
}

if (profileQuery.error) {
  return (
    <div className="py-20 text-center text-red-500">
      Failed to load profile.
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

if (logQuery.error) {
  return (
    <div className="py-20 text-center text-red-500">
      Failed to load today's log.
    </div>
  );
}

if (!profile || !menu) {
  return (
    <div className="py-20 text-center text-muted-foreground">
      Loading...
    </div>
  );
}

  if (!profile || !targets) {
    return (
      <section className="card-soft mx-auto mt-10 max-w-xl p-8 text-center">
        <h1 className="text-2xl font-bold">Welcome to Mess Macro Planner</h1>
        <p className="mt-2 text-muted-foreground">
          Tell us your body stats and goal once. We'll do the math on every mess meal after that.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link to="/profile">Set up my profile</Link>
        </Button>
      </section>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <section className="card-soft overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-secondary/50 px-6 py-5">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {new Date().toDateString()}
              </p>
              <h1 className="mt-1 text-2xl font-bold">Hey {profile.name.split(" ")[0]} 👋</h1>
              <p className="text-sm text-muted-foreground">
                Today's target: {targets.calories} kcal · {targets.protein}g protein
              </p>
            </div>
            <Button size="lg" onClick={handleGenerate} disabled={generating}>
              {generating ? "Optimizing…" : plan ? "Regenerate plan" : "Generate my meal plan"}
            </Button>
          </div>
          <div className="grid gap-4 px-6 py-5 sm:grid-cols-2 lg:grid-cols-4">
            <MacroBar label="Calories" value={dayTotals.calories} goal={targets.calories} unit=" kcal" />
            <MacroBar label="Protein" value={dayTotals.protein} goal={targets.protein} tone="protein" />
            <MacroBar label="Carbs" value={dayTotals.carbs} goal={targets.carbs} tone="carbs" />
            <MacroBar label="Fat" value={dayTotals.fat} goal={targets.fat} tone="fat" />
          </div>
        </section>

        {!plan ? (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
            No plan yet — hit <strong className="text-foreground">Generate my meal plan</strong> to
            build today's meals from the mess menu.
          </p>
        ) : (
          <div className="grid gap-5 lg:grid-cols-3">
            {MEALS.map((meal) => {
              const entries = plan[meal] ?? [];
              const t = totalsFor(entries, menu.items);
              const goal = mealTargets(targets, meal);
              const skipped = menu.items.filter(
                (i) => i.meal === meal && !entries.some((e) => e.itemId === i.id),
              );
              return (
                <section key={meal} className="card-soft flex flex-col p-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">{MEAL_LABEL[meal]}</h2>
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                      {Math.round(t.calories)} kcal · {Math.round(t.protein)}g P
                    </span>
                  </div>

                  {entries.length === 0 ? (
                    <p className="mt-4 text-sm text-muted-foreground">
                      Nothing on the menu for this meal.
                    </p>
                  ) : (
                    <ul className="mt-4 space-y-2">
                      {entries.map((e) => {
                        const item = menu.items.find((i) => i.id === e.itemId)!;
                        const done = eaten.includes(item.id);
                        return (
                          <li key={e.itemId}>
                            <button
                              onClick={() =>
                                updateLog({
                                  eaten: done
                                    ? eaten.filter((x) => x !== item.id)
                                    : [...eaten, item.id],
                                })
                              }
                              className={`flex w-full items-center gap-3 rounded-lg border border-border px-3 py-2 text-left text-sm transition-colors hover:bg-secondary/70 ${
                                done ? "bg-secondary" : ""
                              }`}
                            >
                              <span
                                className={`flex size-5 shrink-0 items-center justify-center rounded-md border text-[11px] ${
                                  done
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border"
                                }`}
                              >
                                {done ? "✓" : ""}
                              </span>
                              <span className="flex-1">
                                <span className="font-medium">{item.name}</span>{" "}
                                <span className="text-muted-foreground">
                                  — {formatServings(e.servings, item.serving)}
                                </span>
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {skipped.length > 0 && (
                    <p className="mt-3 text-xs text-muted-foreground">
                      Skip today: {skipped.map((s) => s.name).join(", ")}
                    </p>
                  )}

                  <div className="mt-4 space-y-2 border-t border-border pt-4">
                    <MacroBar label="Calories" value={t.calories} goal={goal.calories} unit=" kcal" />
                    <MacroBar label="Protein" value={t.protein} goal={goal.protein} tone="protein" />
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
