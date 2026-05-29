import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSignUp } from "../hooks/auth/useSignUp";
import { AuthShell } from "./AuthShell";
import axios from "axios";

export function SignUpPage() {
  const navigate = useNavigate();
  const signUp = useSignUp();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      await signUp.mutateAsync({ username, email, password });
      navigate("/");
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message
        : undefined;
      setError(Array.isArray(msg) ? msg.join(" · ") : msg ?? "Sign up failed.");
    }
  }

  return (
    <AuthShell>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-field">
          <label className="label">Username</label>
          <input
            className="input"
            type="text"
            autoComplete="username"
            placeholder="GandalfTheStupid"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={64}
            required
          />
        </div>

        <div className="auth-field">
          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            autoComplete="email"
            placeholder="sarumanthewhite@outlook.com"
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
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="auth-field">
          <label className="label">Confirm Password</label>
          <input
            className="input"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button
          type="submit"
          className="btn-primary w-full justify-center mt-2"
          disabled={signUp.isPending}
        >
          {signUp.isPending ? "Fetching your Grimoire…" : "Create Account"}
        </button>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/signin" className="auth-link">
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
