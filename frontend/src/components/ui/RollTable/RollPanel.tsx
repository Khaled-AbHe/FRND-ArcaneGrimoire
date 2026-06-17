import { useEffect, useRef } from "react";
import { useSessionStorage } from "usehooks-ts";
import type { RollResult } from "../../../types";
import { HitCard } from "./HitCard";
import { DamageCard } from "./DamageCard";

interface RollPanelProps {}

export function RollPanel({}: RollPanelProps) {
  const [value] = useSessionStorage<RollResult[]>("result-logs", []);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [value]);

  return (
    <div className="flex w-[350px] flex-col items-center justify-start overflow-y-auto border border-[var(--border)]">
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
