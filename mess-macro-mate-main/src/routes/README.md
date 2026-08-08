# Mess Macro Mate

A meal planning tool built for my hostel mess. It takes a student's personal
nutrition targets and matches them against the actual daily mess menu, so
they know exactly what to pick — no generic diet plan, no guessing.

Live and in use for the mess — not a template or a boilerplate for others
to spin up.

## What it does

- **Calculates personal targets** — calories, protein, carbs, and fat via
  the Mifflin–St Jeor equation, adjusted for activity level and goal (lose
  / maintain / gain).
- **Reads the day's actual mess menu** and generates a breakfast, lunch,
  and dinner combo built to hit those targets as closely as the menu
  allows.
- **Optimizes servings, not just item picks** — a constrained search
  chooses quantities (half-servings included) to minimize the gap between
  the plan and the target.
- **Lets students swap** any recommended item for another option on the
  same meal without breaking the plan.
- **Collects private meal reviews** after each meal window closes, visible
  only to mess management — a real feedback channel instead of a
  suggestion box nobody uses.

## How the optimizer works

`optimizeMeal` in `src/lib/nutrition.ts` runs a constrained search over
serving-size combinations for the day's menu items (grouped into base,
protein, vegetable, drink, and side), scoring each combination against the
meal's target macros. Protein deficits and calorie overshoots are penalized
more heavily, and plans missing a base or protein item are penalized to
avoid degenerate results. The lowest-scoring combination wins.

## Tech stack

- [TanStack Start](https://tanstack.com/start) (file-based routing, SSR)
- React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui components
- [Supabase](https://supabase.com) (auth, database)
- TanStack Query for data fetching

## Structure

src/
├── routes/ # index, menu, profile, login, about
├── components/ # MealCard, FoodCard, DashboardHeader...
│ └── ui/ # shadcn/ui primitives
├── lib/
│ ├── nutrition.ts # BMR/TDEE calculation + meal plan optimizer
│ ├── mess-types.ts # Core types (FoodItem, Profile, MealPlan...)
│ ├── meal-classifier.ts
│ ├── plan-quality.ts
│ ├── review.ts # Meal review time-window logic
│ ├── swapMeal.ts
│ └── api/ # Supabase queries (food, menu, profile, reviews, logs)
├── hooks/
│ └── useMealPlanner.ts
└── auth/ # Supabase auth provider + protected routes


## Routes

| Route | Description |
| --- | --- |
| `/` | Dashboard — today's plan, macros, meal cards |
| `/menu` | Today's mess menu |
| `/profile` | Nutrition profile setup |
| `/login` | Auth |
| `/about` | How it works, FAQ, privacy |

## Built by

[Ishan Dhawan](https://github.com/ishan1818) —
[LinkedIn](https://www.linkedin.com/in/ishan-dhawan-130a17351)