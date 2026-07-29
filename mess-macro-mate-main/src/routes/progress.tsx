import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { MacroBar } from "@/components/MacroBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MEALS } from "@/lib/mess-types";
import { computeTargets, totalsFor } from "@/lib/nutrition";
import { todayKey, useLog, useMenu, useProfile } from "@/lib/store";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress — Mess Macro Planner" },
      {
        name: "description",
        content:
          "Track weight, calories, protein, water intake and your planning streak day by day.",
      },
      { property: "og:title", content: "Progress — Mess Macro Planner" },
      {
        property: "og:description",
        content: "Weight, macros, water and streak tracking for hostel mess eaters.",
      },
    ],
  }),
  component: ProgressPage,
});

const WATER_GOAL = 8;

function ProgressPage() {
  const { value: profile } = useProfile();
  const { value: menu } = useMenu();
  const { value: logs, save } = useLog();

  const date = todayKey();
  const log = logs[date];
  const targets = profile ? computeTargets(profile) : null;

  const eatenTotals = useMemo(() => {
    if (!log?.plan) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    const eaten = log.eaten ?? [];
    return MEALS.map((m) =>
      totalsFor((log.plan![m] ?? []).filter((e) => eaten.includes(e.itemId)), menu.items),
    ).reduce((a, b) => ({
      calories: a.calories + b.calories,
      protein: a.protein + b.protein,
      carbs: a.carbs + b.carbs,
      fat: a.fat + b.fat,
    }));
  }, [log, menu.items]);

  const streak = useMemo(() => {
    let count = 0;
    const d = new Date();
    // count consecutive days (ending today) with a generated plan
    for (;;) {
      const key = todayKey(d);
      if (logs[key]?.plan) count += 1;
      else break;
      d.setDate(d.getDate() - 1);
    }
    return count;
  }, [logs]);

  const update = (patch: Partial<NonNullable<typeof log>>) =>
    save({
      ...logs,
      [date]: { ...log, ...patch, date, water: patch.water ?? log?.water ?? 0 },
    });

  if (!profile || !targets) {
    return (
      <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
        Set up your profile first to see progress.
      </p>
    );
  }

  const water = log?.water ?? 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Today's progress</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Current weight" value={`${profile.weightKg} kg`} />
        <Stat label="Goal weight" value={`${profile.goalWeightKg} kg`} />
        <Stat label="To go" value={`${Math.abs(profile.weightKg - profile.goalWeightKg).toFixed(1)} kg`} />
        <Stat label="Planning streak" value={`${streak} day${streak === 1 ? "" : "s"} 🔥`} />
      </div>

      <section className="card-soft space-y-4 p-6">
        <h2 className="text-lg font-semibold">Eaten so far</h2>
        <p className="text-sm text-muted-foreground">
          Based on the items you ticked off on your plan today.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <MacroBar label="Calories" value={eatenTotals.calories} goal={targets.calories} unit=" kcal" />
          <MacroBar label="Protein" value={eatenTotals.protein} goal={targets.protein} tone="protein" />
          <MacroBar label="Carbs" value={eatenTotals.carbs} goal={targets.carbs} tone="carbs" />
          <MacroBar label="Fat" value={eatenTotals.fat} goal={targets.fat} tone="fat" />
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="card-soft space-y-4 p-6">
          <h2 className="text-lg font-semibold">Water</h2>
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: WATER_GOAL }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => update({ water: idx + 1 === water ? idx : idx + 1 })}
                aria-label={`Set water to ${idx + 1} glasses`}
                className={`h-10 w-8 rounded-md border transition-colors ${
                  idx < water ? "border-primary bg-primary/80" : "border-border bg-secondary"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            {water} of {WATER_GOAL} glasses
          </p>
        </section>

        <section className="card-soft space-y-4 p-6">
          <h2 className="text-lg font-semibold">Log today's weight</h2>
          <div className="flex gap-2">
            <Input
              type="number"
              step="0.1"
              placeholder={String(profile.weightKg)}
              defaultValue={log?.weightKg ?? ""}
              onChange={(e) => update({ weightKg: Number(e.target.value) })}
              className="max-w-40"
            />
            <Button variant="outline" onClick={() => update({ weightKg: profile.weightKg })}>
              Same as profile
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {log?.weightKg ? `Logged: ${log.weightKg} kg` : "Not logged yet today."}
          </p>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-soft p-5">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}
