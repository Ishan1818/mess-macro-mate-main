import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError(null);

    const { error: authError } =
      mode === "login"
        ? await supabase.auth.signInWithPassword({
            email,
            password,
          })
        : await supabase.auth.signUp({
            email,
            password,
          });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    navigate({ to: "/" });
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    setError(null);

    const { error: authError } =
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

    if (authError) {
      setError(authError.message);
      setGoogleLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="card-soft w-full space-y-6 p-6"
      >
        <div>
          <h1 className="text-2xl font-bold">
            Mess Macro Mate
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Plan your hostel meals around your macros.
          </p>
        </div>

        <div className="flex gap-1 rounded-lg bg-secondary p-1">
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setError(null);
              }}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm transition-colors ${
                mode === m
                  ? "bg-card font-medium text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "login" ? "Log in" : "Sign up"}
            </button>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          size="lg"
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading}
        >
          {googleLoading
            ? "Connecting to Google…"
            : "Continue with Google"}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>

          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-3 text-muted-foreground">
              or continue with email
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        {error && (
          <p className="text-sm text-destructive">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={loading || googleLoading}
        >
          {loading
            ? "Please wait…"
            : mode === "login"
              ? "Log in"
              : "Create account"}
        </Button>
      </form>
    </div>
  );
}