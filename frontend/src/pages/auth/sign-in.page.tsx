import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useSignIn } from "../../hooks/auth/useSignIn";
import { AuthLayout } from "../../layout/auth.layout";
import axios from "axios";

export function SignInPage() {
  const signIn = useSignIn();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await signIn.mutateAsync({ email, password });
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.message : undefined;
      setError(Array.isArray(msg) ? msg.join(" · ") : (msg ?? "Sign in failed."));
    }
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-field">
          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            autoComplete="email"
            placeholder="arcane@grimoire.dev"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="auth-field">
          <label className="label">Password</label>
          <input
            className="input"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button
          type="submit"
          className="btn-primary w-full justify-center mt-2"
          disabled={signIn.isPending}
        >
          {signIn.isPending ? "Opening the Grimoire…" : "Enter"}
        </button>

        <p className="auth-switch">
          No account?{" "}
          <Link to="/signup" className="auth-link">
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
