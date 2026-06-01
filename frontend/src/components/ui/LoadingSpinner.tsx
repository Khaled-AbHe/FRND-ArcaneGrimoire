export function LoadingSpinner() {
  return (
    <div
      className="flex items-center justify-center"
      style={{ height: "100dvh", background: "var(--bg-primary)" }}
      role="status"
      aria-label="Loading"
    >
      <div className="text-muted animate-shimmer">Loading…</div>
    </div>
  );
}
