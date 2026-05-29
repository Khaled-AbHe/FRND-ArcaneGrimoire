import { HTMLAttributes } from "react";

type Cols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type Gap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 10 | 12 | 16;

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of columns at each breakpoint. Defaults to 1. */
  cols?: Cols | { sm?: Cols; md?: Cols; lg?: Cols; xl?: Cols };
  /** Gap between cells (Tailwind spacing scale). Defaults to 4. */
  gap?: Gap | { x?: Gap; y?: Gap };
  /** If true, uses inline-grid instead of grid. */
  inline?: boolean;
}

const colsMap: Record<Cols, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
  9: "grid-cols-9",
  10: "grid-cols-10",
  11: "grid-cols-11",
  12: "grid-cols-12",
};

const smColsMap: Record<Cols, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  5: "sm:grid-cols-5",
  6: "sm:grid-cols-6",
  7: "sm:grid-cols-7",
  8: "sm:grid-cols-8",
  9: "sm:grid-cols-9",
  10: "sm:grid-cols-10",
  11: "sm:grid-cols-11",
  12: "sm:grid-cols-12",
};

const mdColsMap: Record<Cols, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  5: "md:grid-cols-5",
  6: "md:grid-cols-6",
  7: "md:grid-cols-7",
  8: "md:grid-cols-8",
  9: "md:grid-cols-9",
  10: "md:grid-cols-10",
  11: "md:grid-cols-11",
  12: "md:grid-cols-12",
};

const lgColsMap: Record<Cols, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
  7: "lg:grid-cols-7",
  8: "lg:grid-cols-8",
  9: "lg:grid-cols-9",
  10: "lg:grid-cols-10",
  11: "lg:grid-cols-11",
  12: "lg:grid-cols-12",
};

const xlColsMap: Record<Cols, string> = {
  1: "xl:grid-cols-1",
  2: "xl:grid-cols-2",
  3: "xl:grid-cols-3",
  4: "xl:grid-cols-4",
  5: "xl:grid-cols-5",
  6: "xl:grid-cols-6",
  7: "xl:grid-cols-7",
  8: "xl:grid-cols-8",
  9: "xl:grid-cols-9",
  10: "xl:grid-cols-10",
  11: "xl:grid-cols-11",
  12: "xl:grid-cols-12",
};

const gapMap: Record<Gap, string> = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  7: "gap-7",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
  16: "gap-16",
};

const gapXMap: Record<Gap, string> = {
  0: "gap-x-0",
  1: "gap-x-1",
  2: "gap-x-2",
  3: "gap-x-3",
  4: "gap-x-4",
  5: "gap-x-5",
  6: "gap-x-6",
  7: "gap-x-7",
  8: "gap-x-8",
  10: "gap-x-10",
  12: "gap-x-12",
  16: "gap-x-16",
};

const gapYMap: Record<Gap, string> = {
  0: "gap-y-0",
  1: "gap-y-1",
  2: "gap-y-2",
  3: "gap-y-3",
  4: "gap-y-4",
  5: "gap-y-5",
  6: "gap-y-6",
  7: "gap-y-7",
  8: "gap-y-8",
  10: "gap-y-10",
  12: "gap-y-12",
  16: "gap-y-16",
};

function resolveColsClasses(cols: GridProps["cols"]): string {
  if (cols === undefined) return colsMap[1];
  if (typeof cols === "number") return colsMap[cols];

  const classes: string[] = [colsMap[1]]; // mobile-first base
  if (cols.sm) classes.push(smColsMap[cols.sm]);
  if (cols.md) classes.push(mdColsMap[cols.md]);
  if (cols.lg) classes.push(lgColsMap[cols.lg]);
  if (cols.xl) classes.push(xlColsMap[cols.xl]);
  return classes.join(" ");
}

function resolveGapClasses(gap: GridProps["gap"]): string {
  if (gap === undefined) return gapMap[4];
  if (typeof gap === "number") return gapMap[gap];
  const classes: string[] = [];
  if (gap.x !== undefined) classes.push(gapXMap[gap.x]);
  if (gap.y !== undefined) classes.push(gapYMap[gap.y]);
  return classes.join(" ");
}

export function Grid({
  cols = 1,
  gap = 4,
  inline = false,
  className = "",
  children,
  ...rest
}: GridProps) {
  const display = inline ? "inline-grid" : "grid";
  const colsClasses = resolveColsClasses(cols);
  const gapClasses = resolveGapClasses(gap);

  return (
    <div className={`${display} ${colsClasses} ${gapClasses} ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}
