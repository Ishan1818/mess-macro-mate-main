import { createFileRoute, Link } from "@tanstack/react-router";
import ProtectedRoute from "@/auth/ProtectedRoute";
import { useAuthContext } from "@/auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";

import { getProfile } from "@/lib/api/profile";
import { getTodayMenu } from "@/lib/api/menu";
import { MEALS } from "@/lib/mess-types";

import DashboardHeader from "@/components/DashboardHeader";
import MealCard from "@/components/MealCard";
import PlanQualityCard from "@/components/PlanQualityCard";
import QueryState from "@/components/QueryState";
import WelcomeCard from "@/components/WelcomeCard";

import { useMealPlanner } from "@/hooks/useMealPlanner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Mess Macro Planner — Hit your macros on hostel food",
      },
      {
        name: "description",
        content:
          "Enter your goals, upload today's mess menu, and get an optimized breakfast, lunch and dinner plan that hits your calories and protein.",
      },
      {
        property: "og:title",
        content: "Mess Macro Planner",
      },
      {
        property: "og:description",
        content:
          "Turn today's mess menu into a macro-perfect meal plan in one tap.",
      },
    ],
  }),
  component: Home,
});

function Loading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="py-20 text-center text-muted-foreground">{message}</div>
  );
}

function EmptyMenu() {
  return (
    <div className="rounded-xl border border-dashed border-border p-8 text-center">
      <p className="text-muted-foreground">
        Today's mess menu hasn't been uploaded yet.
      </p>
      <Link
        to="/menu"
        className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
      >
        View menu page →
      </Link>
    </div>
  );
}

function Home() {
  const { session, loading: authLoading } = useAuthContext();

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

  const {
  targets,
  plan,
  generating,
  dayTotals,
  generate,
  swap,
  increaseServing,
  decreaseServing,
} = useMealPlanner(profile, menu);

  if (authLoading) {
    return <Loading />;
  }

  return (
    <ProtectedRoute>
      <QueryState
        loading={
          (!!session && profileQuery.isLoading) || menuQuery.isLoading
        }
        error={!!profileQuery.error || !!menuQuery.error}
        errorMessage={
          profileQuery.error
            ? "Failed to load profile."
            : "Failed to load today's menu."
        }
      >
        {!profile ? (
  <WelcomeCard />
) : !menu ? (
  <Loading message="Loading today's menu..." />
) : menu.items.length === 0 ? (
  <EmptyMenu />
) : !targets ? (
  <Loading />
) : (
          <div className="space-y-6">
            <DashboardHeader
              name={profile.name}
              targets={targets}
              dayTotals={dayTotals}
              generating={generating}
              hasPlan={!!plan}
              onGenerate={generate}
            />

            {plan ? (
              <>
                <PlanQualityCard actual={dayTotals} target={targets} />

                <div className="grid gap-5 lg:grid-cols-3">
                  {MEALS.map((meal) => (
                    <MealCard
  key={meal}
  meal={meal}
  plan={plan}
  menuItems={menu.items}
  targets={targets}
  onSwap={swap}
  onIncreaseServing={increaseServing}
  onDecreaseServing={decreaseServing}
/>
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-8 text-center">
                <p className="text-muted-foreground">
                  No meal plan generated for today.
                </p>

                <p className="mt-2 text-sm text-muted-foreground">
                  Tap <strong>Generate Plan</strong> to create today's recommendations.
                </p>
              </div>
            )}
          </div>
        )}
      </QueryState>
    </ProtectedRoute>
  );
}
