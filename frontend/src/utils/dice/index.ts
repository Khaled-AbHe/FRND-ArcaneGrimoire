/**
 * Barrel re-export for all dice utilities.
 * Existing imports like `import { rollDie } from "../../utils/dice"` continue
 * to work without modification — this file is a drop-in replacement for the
 * old monolithic dice.ts.
 */

export * from "./core";
export * from "./cantrip";
export * from "./format";
export * from "./slots";
export * from "./spell-info";
export * from "./roll";
