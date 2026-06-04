export function SlotColumnHeaders() {
  return (
    <div
      className="flex items-center justify-between py-1 text-sm uppercase tracking-wider"
      style={{ color: "var(--text-primary)" }}
    >
      <span className="flex h-[35px] min-w-[62px] items-center justify-end p-1" />
      <span className="flex h-[35px] min-w-[290px] items-center justify-start p-1">
        Name
      </span>
      <span className="flex h-[35px] min-w-[70px] items-center justify-center p-1">
        Time
      </span>
      <span className="flex h-[35px] min-w-[70px] items-center justify-center p-1">
        Range
      </span>
      <span className="flex h-[35px] min-w-[70px] items-center justify-center p-1">
        Hit / DC
      </span>
      <span className="flex h-[35px] min-w-[140px] items-center justify-center p-1">
        Effect
      </span>
      <span className="flex h-[35px] min-w-[140px] items-center justify-start p-1">
        Notes
      </span>
    </div>
  );
}
