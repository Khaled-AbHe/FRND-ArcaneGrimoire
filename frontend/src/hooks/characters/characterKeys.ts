/**
 * Centralized query key definitions for all character-related queries.
 * Import from here instead of useCharacters to avoid circular dependencies.
 */
export const characterKeys = {
  all: () => ["characters"] as const,
  detail: (id: number) => ["characters", id] as const,
  computed: (id: number) => ["characters", id, "computed"] as const,
} as const;
