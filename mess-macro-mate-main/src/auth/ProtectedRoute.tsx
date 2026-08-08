import { ReactNode } from "react";
import { Navigate } from "@tanstack/react-router";
import { useAuth } from "./useAuth";
export default function ProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="py-20 text-center text-muted-foreground">Loading...</div>
    );
  }
  if (!session) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
}
