interface MacroBarProps {
  label: string;
  value: number;
  goal: number;
  unit?: string;
  tone?: "primary" | "protein" | "carbs" | "fat";
}

const TONE: Record<NonNullable<MacroBarProps["tone"]>, string> = {
  primary: "bg-primary",
  protein: "bg-protein",
  carbs: "bg-carbs",
  fat: "bg-fat",
};

export function MacroBar({ label, value, goal, unit = "g", tone = "primary" }: MacroBarProps) {
  const pct = goal > 0 ? Math.min(100, Math.round((value / goal) * 100)) : 0;
  const onTarget = goal > 0 && value >= goal * 0.9 && value <= goal * 1.1;

  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums text-muted-foreground">
          {Math.round(value)}
          <span className="text-muted-foreground/70">/{Math.round(goal)}{unit}</span>
          {onTarget ? <span className="ml-1 text-primary">✓</span> : null}
        </span>
      </div>
      <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={`h-full rounded-full transition-all duration-500 ${TONE[tone]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
