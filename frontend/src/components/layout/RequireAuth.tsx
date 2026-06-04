import { Navigate, useLocation } from "react-router-dom";
import { useCurrentUser } from "../../hooks/auth/useCurrentUser";

/**
 * Wraps routes that require authentication.
 * Shows a loading shimmer while the session check is in flight,
 * then redirects to /signin if no user is found.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useCurrentUser();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ height: "100dvh", background: "var(--bg-primary)" }}
      >
        <div className="text-muted animate-shimmer font-display text-sm uppercase tracking-widest">
          Consulting the library…
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
