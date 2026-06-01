export function SlotColumnHeaders() {
  return (
    <div
      className="flex justify-between items-center text-sm uppercase tracking-wider py-1"
      style={{ color: "var(--text-primary)" }}
    >
      <span className="flex justify-end    items-center h-[35px] min-w-[62px]  p-1" />
      <span className="flex justify-start  items-center h-[35px] min-w-[290px] p-1">Name</span>
      <span className="flex justify-center items-center h-[35px] min-w-[70px]  p-1">Time</span>
      <span className="flex justify-center items-center h-[35px] min-w-[70px]  p-1">Range</span>
      <span className="flex justify-center items-center h-[35px] min-w-[70px]  p-1">Hit / DC</span>
      <span className="flex justify-center items-center h-[35px] min-w-[140px] p-1">Effect</span>
      <span className="flex justify-start  items-center h-[35px] min-w-[140px] p-1">Notes</span>
    </div>
  );
}
