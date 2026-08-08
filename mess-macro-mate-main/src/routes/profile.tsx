import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MacroBar } from "@/components/MacroBar";
import type { Activity, Goal, Profile } from "@/lib/mess-types";
import { ACTIVITY_LABEL, GOAL_LABEL, computeTargets } from "@/lib/nutrition";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuthContext } from "@/auth/AuthProvider";
import {
  getProfile,
  saveProfile,
} from "@/lib/api/profile";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — Mess Macro Planner" },
      {
        name: "description",
        content:
          "Set your age, weight, activity level and goal so the planner can calculate your daily calorie and protein targets.",
      },
      {
        property: "og:title",
        content: "Your Profile — Mess Macro Planner",
      },
      {
        property: "og:description",
        content:
          "Body stats and goals that drive your daily macro targets.",
      },
    ],
  }),
  component: ProfilePage,
});

const DEFAULTS: Profile = {
  name: "",
  age: 20,
  gender: "male",
  heightCm: 175,
  weightKg: 70,
  goalWeightKg: 70,
  goal: "lose",
  activity: "moderate",
};

function ProfilePage() {
  const { session } = useAuthContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [form, setForm] = useState<Profile>(DEFAULTS);
  const [saved, setSaved] = useState(false);

  const profileQuery = useQuery({
    queryKey: ["profile", session?.user.id],
    enabled: !!session,
    queryFn: () => getProfile(session!.user.id),
  });

  useEffect(() => {
    if (profileQuery.data) {
      setForm(profileQuery.data);
    }
  }, [profileQuery.data]);

  const saveMutation = useMutation({
    mutationFn: (profile: Profile) =>
      saveProfile(session!.user.id, profile),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", session?.user.id],
      });

      setSaved(true);

      setTimeout(() => {
        navigate({ to: "/" });
      }, 500);
    },
  });

  const set = <K extends keyof Profile>(
    key: K,
    value: Profile[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const preview = computeTargets(form);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) return;

    saveMutation.mutate({ ...form, goalWeightKg: form.weightKg });
  };

  if (profileQuery.isLoading) {
    return (
      <div className="flex justify-center p-10">
        Loading profile...
      </div>
    );
  }

  if (profileQuery.error) {
    return (
      <div className="flex justify-center p-10 text-red-500">
        Failed to load profile.
      </div>
    );
  }

  return (
    <ProtectedRoute>
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <form
        onSubmit={submit}
        className="card-soft space-y-6 p-6"
      >
        <div>
          <h1 className="text-2xl font-bold">
            Your profile
          </h1>

          <p className="text-sm text-muted-foreground">
            Used to calculate your daily calorie and macro
            targets.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Name">
            <Input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
            />
          </Field>

          <Field label="Age">
            <Input
              type="number"
              min={12}
              max={90}
              value={form.age}
              onChange={(e) => set("age", Number(e.target.value))}
            />
          </Field>

          <Field label="Gender">
            <Segmented
              value={form.gender}
              onChange={(v) =>
                set("gender", v as Profile["gender"])
              }
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
              ]}
            />
          </Field>

          <Field label="Activity level">
            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={form.activity}
              onChange={(e) =>
                set("activity", e.target.value as Activity)
              }
            >
              {Object.entries(ACTIVITY_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Height (cm)">
            <Input
              type="number"
              value={form.heightCm}
              onChange={(e) =>
                set("heightCm", Number(e.target.value))
              }
            />
          </Field>

          <Field label="Current weight (kg)">
            <Input
              type="number"
              step="0.1"
              value={form.weightKg}
              onChange={(e) =>
                set("weightKg", Number(e.target.value))
              }
            />
          </Field>
        </div>

        <Field label="Goal">
          <Segmented
            value={form.goal}
            onChange={(v) => set("goal", v as Goal)}
            options={(Object.keys(GOAL_LABEL) as Goal[]).map(
              (g) => ({
                value: g,
                label: GOAL_LABEL[g],
              })
            )}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Target calories (optional)">
            <Input
              type="number"
              placeholder={`Auto: ${preview.calories}`}
              value={form.targetCalories ?? ""}
              onChange={(e) =>
                set(
                  "targetCalories",
                  e.target.value
                    ? Number(e.target.value)
                    : undefined
                )
              }
            />
          </Field>

          <Field label="Protein goal in g (optional)">
            <Input
              type="number"
              placeholder={`Auto: ${preview.protein}`}
              value={form.proteinGoal ?? ""}
              onChange={(e) =>
                set(
                  "proteinGoal",
                  e.target.value
                    ? Number(e.target.value)
                    : undefined
                )
              }
            />
          </Field>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending
            ? "Saving..."
            : saved
            ? "Saved ✓"
            : "Save profile"}
        </Button>
      </form>

      <aside className="card-soft h-fit space-y-4 p-6">
        <h2 className="text-lg font-semibold">
          Your daily targets
        </h2>

        <p className="text-sm text-muted-foreground">
          Calculated with the Mifflin-St Jeor equation,
          adjusted for your goal.
        </p>

        <div className="rounded-xl bg-secondary/60 p-4">
          <p className="font-display text-4xl font-bold">
            {preview.calories}
          </p>

          <p className="text-sm text-muted-foreground">
            kcal / day
          </p>
        </div>

        <div className="space-y-3">
          <MacroBar
            label="Protein"
            value={preview.protein}
            goal={preview.protein}
            tone="protein"
          />

          <MacroBar
            label="Carbs"
            value={preview.carbs}
            goal={preview.carbs}
            tone="carbs"
          />

          <MacroBar
            label="Fat"
            value={preview.fat}
            goal={preview.fat}
            tone="fat"
          />
        </div>
      </aside>
    </div>
    </ProtectedRoute>
  );
}
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function Segmented({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex gap-1 rounded-lg bg-secondary p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm transition-colors ${
            value === o.value
              ? "bg-card font-medium text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
  