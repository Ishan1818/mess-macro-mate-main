import type { Targets } from "@/lib/mess-types";

export function getPlanQuality(
  actual: Targets,
  target: Targets,
): {
  score: number;
  label: string;
  color: string;
} {
  let score = 100;

  const calorieDiff =
    Math.abs(actual.calories - target.calories) /
    target.calories;

  const proteinDiff =
    Math.abs(actual.protein - target.protein) /
    target.protein;

  const carbDiff =
    Math.abs(actual.carbs - target.carbs) /
    Math.max(target.carbs, 1);

  const fatDiff =
    Math.abs(actual.fat - target.fat) /
    Math.max(target.fat, 1);

  score -= calorieDiff * 40;
  score -= proteinDiff * 35;
  score -= carbDiff * 15;
  score -= fatDiff * 10;

  score = Math.max(0, Math.min(100, Math.round(score)));

  if (score >= 90)
    return {
      score,
      label: "Excellent",
      color: "text-green-500",
    };

  if (score >= 75)
    return {
      score,
      label: "Good",
      color: "text-lime-500",
    };

  if (score >= 60)
    return {
      score,
      label: "Average",
      color: "text-yellow-500",
    };

  return {
    score,
    label: "Needs Improvement",
    color: "text-red-500",
  };
}