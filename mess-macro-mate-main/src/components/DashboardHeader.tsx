import { MacroBar } from "@/components/MacroBar";
import { Button } from "@/components/ui/button";
import type { Targets } from "@/lib/mess-types";

type Props = {
  name: string;
  targets: Targets;
  dayTotals: Targets;
  generating: boolean;
  hasPlan: boolean;
  onGenerate: () => void;
};

export default function DashboardHeader({
  name,
  targets,
  dayTotals,
  generating,
  hasPlan,
  onGenerate,
}: Props) {
  return (
    <section className="card-soft overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-secondary/50 px-6 py-5">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {new Date().toDateString()}
          </p>

          <h1 className="mt-1 text-2xl font-bold">
            Hey {name.split(" ")[0]} 👋
          </h1>

          <p className="text-sm text-muted-foreground">
            Today's target: {targets.calories} kcal · {targets.protein}g protein
          </p>
        </div>

        <Button
          size="lg"
          onClick={onGenerate}
          disabled={generating}
        >
          {generating
            ? "Optimizing…"
            : hasPlan
            ? "Regenerate plan"
            : "Generate my meal plan"}
        </Button>
      </div>

      <div className="grid gap-4 px-6 py-5 sm:grid-cols-2 lg:grid-cols-4">
        <MacroBar
          label="Calories"
          value={dayTotals.calories}
          goal={targets.calories}
          unit=" kcal"
        />

        <MacroBar
          label="Protein"
          value={dayTotals.protein}
          goal={targets.protein}
          tone="protein"
        />

        <MacroBar
          label="Carbs"
          value={dayTotals.carbs}
          goal={targets.carbs}
          tone="carbs"
        />

        <MacroBar
          label="Fat"
          value={dayTotals.fat}
          goal={targets.fat}
          tone="fat"
        />
      </div>
    </section>
  );
}