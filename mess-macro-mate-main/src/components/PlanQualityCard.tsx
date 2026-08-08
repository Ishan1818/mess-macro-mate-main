import { getPlanQuality } from "@/lib/plan-quality";
import type { Targets } from "@/lib/mess-types";
type Props = {
  actual: Targets;
  target: Targets;
};
export default function PlanQualityCard({ actual, target }: Props) {
  const quality = getPlanQuality(actual, target);
  return (
    <section className="card-soft flex items-center gap-5 p-5">
      <div
        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 ${
          quality.score >= 90
            ? "border-green-500"
            : quality.score >= 75
              ? "border-lime-500"
              : quality.score >= 60
                ? "border-yellow-500"
                : "border-red-500"
        }`}
      >
        <div className="text-center">
          <div className="text-xl font-bold">{quality.score}</div>
          <div className="text-[10px] text-muted-foreground">/100</div>
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Plan quality
        </p>
        <h2 className={`text-lg font-bold ${quality.color}`}>{quality.label}</h2>
        <p className="text-sm text-muted-foreground">
          How closely today's plan matches your macro targets.
        </p>
      </div>
    </section>
  );
}