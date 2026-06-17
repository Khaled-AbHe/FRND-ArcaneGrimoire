import { useEffect, useRef } from "react";
import { useSessionStorage } from "usehooks-ts";
import type { RollResult } from "../../../types";
import { HitCard } from "./HitCard";
import { DamageCard } from "./DamageCard";

export function RollPanel() {
  const [value] = useSessionStorage<RollResult[]>("result-logs", []);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [value]);

  return (
    <div className="flex w-[360px] flex-col items-center justify-start overflow-y-auto border border-[var(--border)]">
      {value.map((r) =>
        r.kind === "hit" ? (
          <HitCard key={r.id} result={r} />
        ) : (
          <DamageCard key={r.id} result={r} />
        ),
      )}
      <div ref={bottomRef} />
    </div>
  );
}
