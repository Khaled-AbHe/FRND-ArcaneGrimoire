import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../hooks/auth/useCurrentUser";
import { useSignOut } from "../../hooks/auth/useSignOut";
import { useUpdateUser } from "../../hooks/user/useUpdateUser";
import { useChangePassword } from "../../hooks/auth/useChangePassword";
import { Modal } from "../../components/ui/Modal";
import { PageShell } from "../../components/shells/page-shell.component";

export function UserSettingsPage() {
  const { data: user } = useCurrentUser();
  const signOut = useSignOut();
  const updateUser = useUpdateUser();
  const changePassword = useChangePassword();
  const navigate = useNavigate();

  const [username, setUsername] = useState(user?.username ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [signOutConfirmOpen, setSignOutConfirmOpen] = useState(false);

  async function handleAccountSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !email.trim()) return;
    await updateUser.mutateAsync({ username: username.trim(), email: email.trim() });
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }
    if (!user) return;
    await changePassword.mutateAsync({ userId: user.userId, password: newPassword });
    setNewPassword("");
    setConfirmPassword("");
  }

  async function handleSignOut() {
    await signOut.mutateAsync();
    navigate("/signin", { replace: true });
  }

  return (
    <PageShell>
      <div className="mx-auto my-10 space-y-6 min-w-[40%] max-w-[80%]">
        {/* Account info */}
        <section aria-labelledby="section-account">
          <h2
            id="section-account"
            className="font-display text-xs uppercase tracking-widest text-accent mb-3"
          >
            Account
          </h2>
          <form onSubmit={handleAccountSubmit} className="card p-4 space-y-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="label">
                Username
              </label>
              <input
                id="username"
                className="input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={64}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {updateUser.isSuccess && (
              <p className="text-xs text-green-400" role="status">
                Saved.
              </p>
            )}
            {updateUser.isError && (
              <p className="text-xs text-red-400" role="alert">
                Failed to save.
              </p>
            )}
            <button type="submit" className="btn-primary text-sm" disabled={updateUser.isPending}>
              {updateUser.isPending ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </section>

        {/* Password */}
        <section aria-labelledby="section-password">
          <h2
            id="section-password"
            className="font-display text-xs uppercase tracking-widest text-accent mb-3"
          >
            Password
          </h2>
          <form onSubmit={handlePasswordSubmit} className="card p-4 space-y-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="new-password" className="label">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                className="input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirm-password" className="label">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                className="input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
            {passwordError && (
              <p className="text-xs text-red-400" role="alert">
                {passwordError}
              </p>
            )}
            {changePassword.isSuccess && (
              <p className="text-xs text-green-400" role="status">
                Password changed.
              </p>
            )}
            {changePassword.isError && (
              <p className="text-xs text-red-400" role="alert">
                Failed to change password.
              </p>
            )}
            <button
              type="submit"
              className="btn-primary text-sm"
              disabled={changePassword.isPending}
            >
              {changePassword.isPending ? "Saving…" : "Change Password"}
            </button>
          </form>
        </section>

        {/* Sign out */}
        <section aria-labelledby="section-signout">
          <h2
            id="section-signout"
            className="font-display text-xs uppercase tracking-widest mb-3"
            style={{ color: "#ef4444" }}
          >
            Session
          </h2>
          <div className="card p-4" style={{ borderColor: "rgba(239,68,68,0.2)" }}>
            <div className="flex items-center justify-between">
              <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Signed in as {user?.username}
              </div>
              <button className="btn-danger text-xs" onClick={() => setSignOutConfirmOpen(true)}>
                Sign Out
              </button>
            </div>
          </div>
        </section>
      </div>

      <Modal
        open={signOutConfirmOpen}
        onClose={() => setSignOutConfirmOpen(false)}
        title="Sign Out"
        width="max-w-sm"
      >
        <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>
          Are you sure you want to sign out?
        </p>
        <div className="flex gap-2 justify-end">
          <button className="btn-ghost text-sm px-4" onClick={() => setSignOutConfirmOpen(false)}>
            Cancel
          </button>
          <button
            className="btn-danger text-sm px-4"
            onClick={handleSignOut}
            disabled={signOut.isPending}
            autoFocus
          >
            Sign Out
          </button>
        </div>
      </Modal>
    </PageShell>
  );
}
