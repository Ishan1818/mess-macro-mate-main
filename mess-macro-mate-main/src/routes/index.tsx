import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MEALS } from "@/lib/mess-types";
import ProtectedRoute from "@/auth/ProtectedRoute";
import { useAuthContext } from "@/auth/AuthProvider";
import { getProfile } from "@/lib/api/profile";
import MealCard from "@/components/MealCard";
import DashboardHeader from "@/components/DashboardHeader";
import QueryState from "@/components/QueryState";
import { useMealPlanner } from "@/hooks/useMealPlanner";
import { useQuery } from "@tanstack/react-query";
import { getTodayMenu } from "@/lib/api/menu";
import WelcomeCard from "@/components/WelcomeCard";

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

const {
  targets,
  plan,
  generating,
  dayTotals,
  generate,
  swap,
} = useMealPlanner(profile, menu);




if (!profile || !menu) {
  return (
    <div className="py-20 text-center text-muted-foreground">
      Loading...
    </div>
  );
}

 if (!profile || !targets) {
  return <WelcomeCard />;
}

  return (
  <QueryState
    loading={profileQuery.isLoading || menuQuery.isLoading}
    error={!!profileQuery.error || !!menuQuery.error}
    errorMessage={
      profileQuery.error
        ? "Failed to load profile."
        : "Failed to load today's menu."
    }
  >
    <ProtectedRoute>
      <div className="space-y-6">
        <DashboardHeader
  name={profile.name}
  targets={targets}
  dayTotals={dayTotals}
  generating={generating}
  hasPlan={!!plan}
  onGenerate={generate}
/>

        {!plan ? (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
            No plan yet — hit <strong className="text-foreground">Generate my meal plan</strong> to
            build today's meals from the mess menu.
          </p>
        ) : (
          <div className="grid gap-5 lg:grid-cols-3">
            {MEALS.map((meal) => (
  <MealCard
  key={meal}
  meal={meal}
  plan={plan}
  menuItems={menu.items}
  targets={targets}
  onSwap={swap}
/>
))}
          </div>
        )}
      </div>
    </ProtectedRoute>
    </QueryState>
  );
}
