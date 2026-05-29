import { HTMLAttributes } from "react";

type Span = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | "full";
type StartEnd = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | "auto";

interface GridItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of columns this item spans. */
  colSpan?: Span;
  /** Number of rows this item spans. */
  rowSpan?: Span;
  /** Column start line. */
  colStart?: StartEnd;
  /** Column end line. */
  colEnd?: StartEnd;
  /** Row start line. */
  rowStart?: StartEnd;
  /** Row end line. */
  rowEnd?: StartEnd;
  /** Self-alignment along the block (vertical) axis. */
  alignSelf?: "auto" | "start" | "center" | "end" | "stretch";
  /** Self-alignment along the inline (horizontal) axis. */
  justifySelf?: "auto" | "start" | "center" | "end" | "stretch";
}

const colSpanMap: Record<Span, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
  full: "col-span-full",
};

const rowSpanMap: Record<Span, string> = {
  1: "row-span-1",
  2: "row-span-2",
  3: "row-span-3",
  4: "row-span-4",
  5: "row-span-5",
  6: "row-span-6",
  7: "row-span-7",
  8: "row-span-8",
  9: "row-span-9",
  10: "row-span-10",
  11: "row-span-11",
  12: "row-span-12",
  full: "row-span-full",
};

const colStartMap: Record<StartEnd, string> = {
  1: "col-start-1",
  2: "col-start-2",
  3: "col-start-3",
  4: "col-start-4",
  5: "col-start-5",
  6: "col-start-6",
  7: "col-start-7",
  8: "col-start-8",
  9: "col-start-9",
  10: "col-start-10",
  11: "col-start-11",
  12: "col-start-12",
  13: "col-start-13",
  auto: "col-start-auto",
};

const colEndMap: Record<StartEnd, string> = {
  1: "col-end-1",
  2: "col-end-2",
  3: "col-end-3",
  4: "col-end-4",
  5: "col-end-5",
  6: "col-end-6",
  7: "col-end-7",
  8: "col-end-8",
  9: "col-end-9",
  10: "col-end-10",
  11: "col-end-11",
  12: "col-end-12",
  13: "col-end-13",
  auto: "col-end-auto",
};

const rowStartMap: Record<StartEnd, string> = {
  1: "row-start-1",
  2: "row-start-2",
  3: "row-start-3",
  4: "row-start-4",
  5: "row-start-5",
  6: "row-start-6",
  7: "row-start-7",
  8: "row-start-8",
  9: "row-start-9",
  10: "row-start-10",
  11: "row-start-11",
  12: "row-start-12",
  13: "row-start-13",
  auto: "row-start-auto",
};

const rowEndMap: Record<StartEnd, string> = {
  1: "row-end-1",
  2: "row-end-2",
  3: "row-end-3",
  4: "row-end-4",
  5: "row-end-5",
  6: "row-end-6",
  7: "row-end-7",
  8: "row-end-8",
  9: "row-end-9",
  10: "row-end-10",
  11: "row-end-11",
  12: "row-end-12",
  13: "row-end-13",
  auto: "row-end-auto",
};

const alignSelfMap: Record<NonNullable<GridItemProps["alignSelf"]>, string> = {
  auto: "self-auto",
  start: "self-start",
  center: "self-center",
  end: "self-end",
  stretch: "self-stretch",
};

const justifySelfMap: Record<NonNullable<GridItemProps["justifySelf"]>, string> = {
  auto: "justify-self-auto",
  start: "justify-self-start",
  center: "justify-self-center",
  end: "justify-self-end",
  stretch: "justify-self-stretch",
};

export function GridItem({
  colSpan,
  rowSpan,
  colStart,
  colEnd,
  rowStart,
  rowEnd,
  alignSelf,
  justifySelf,
  className = "",
  children,
  ...rest
}: GridItemProps) {
  const classes = [
    colSpan !== undefined ? colSpanMap[colSpan] : "",
    rowSpan !== undefined ? rowSpanMap[rowSpan] : "",
    colStart !== undefined ? colStartMap[colStart] : "",
    colEnd !== undefined ? colEndMap[colEnd] : "",
    rowStart !== undefined ? rowStartMap[rowStart] : "",
    rowEnd !== undefined ? rowEndMap[rowEnd] : "",
    alignSelf !== undefined ? alignSelfMap[alignSelf] : "",
    justifySelf !== undefined ? justifySelfMap[justifySelf] : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
