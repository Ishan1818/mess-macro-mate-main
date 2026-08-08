import type { MealName } from "@/lib/mess-types";

export const MEAL_TIMES: Record<
  MealName,
  { start: string; end: string }
> = {
  breakfast: {
    start: "07:30",
    end: "09:00",
  },

  lunch: {
    start: "12:00",
    end: "14:00",
  },

  dinner: {
    start: "19:00",
    end: "21:00",
  },
};

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function currentMinutes() {
  const now = new Date();

  return now.getHours() * 60 + now.getMinutes();
}

export function mealStarted(meal: MealName) {
  return currentMinutes() >= toMinutes(MEAL_TIMES[meal].start);
}

export function mealFinished(meal: MealName) {
  return currentMinutes() >= toMinutes(MEAL_TIMES[meal].end);
}

/**
 * Only ONE review should ever be visible.
 *
 * 09:00 → 13:59  = Breakfast review
 * 14:00 → 20:59  = Lunch review
 * 21:00 onwards  = Dinner review
 */

export function shouldShowReview(meal: MealName) {
  const now = currentMinutes();

  const breakfastEnd = toMinutes(MEAL_TIMES.breakfast.end);
  const lunchEnd = toMinutes(MEAL_TIMES.lunch.end);
  const dinnerEnd = toMinutes(MEAL_TIMES.dinner.end);

  switch (meal) {
    case "breakfast":
      return now >= breakfastEnd && now < lunchEnd;

    case "lunch":
      return now >= lunchEnd && now < dinnerEnd;

    case "dinner":
      return now >= dinnerEnd;

    default:
      return false;
  }
}