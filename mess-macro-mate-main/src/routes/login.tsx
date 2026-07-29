import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAuth() {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        alert(signUpError.message);
        setLoading(false);
        return;
      }
    }

    navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-96 rounded-xl border p-8 space-y-4">
        <h1 className="text-3xl font-bold">Mess Macro Mate</h1>

        <input
          className="w-full border rounded p-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border rounded p-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full rounded bg-blue-600 text-white py-2"
        >
          {loading ? "Loading..." : "Login / Sign Up"}
        </button>
      </div>
    </div>
  );
}