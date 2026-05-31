import {
  useMutation,
  useQueryClient,
  type QueryKey,
  type MutationFunction,
} from "@tanstack/react-query";

/**
 * Mutation that invalidates a query key on success.
 * Replaces the pattern:
 *   const qc = useQueryClient();
 *   return useMutation({ mutationFn, onSuccess: () => qc.invalidateQueries({ queryKey }) });
 */
export function useInvalidatingMutation<TData, TVariables>(
  mutationFn: MutationFunction<TData, TVariables>,
  queryKey: QueryKey,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });
}

/**
 * Mutation that writes the response directly into the cache on success.
 * Replaces the pattern:
 *   const qc = useQueryClient();
 *   return useMutation({ mutationFn, onSuccess: (updated) => qc.setQueryData(key, updated) });
 */
export function useCachingMutation<TData, TVariables>(
  mutationFn: MutationFunction<TData, TVariables>,
  queryKey: QueryKey,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (updated) => qc.setQueryData(queryKey, updated),
  });
}

/**
 * Mutation that both updates a cache entry AND invalidates a related list.
 * Useful for operations that affect both a detail query and a list query.
 */
export function useInvalidatingCachingMutation<TData, TVariables>(
  mutationFn: MutationFunction<TData, TVariables>,
  cacheKey: QueryKey,
  invalidateKey: QueryKey,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (updated) => {
      qc.setQueryData(cacheKey, updated);
      qc.invalidateQueries({ queryKey: invalidateKey });
    },
  });
}
