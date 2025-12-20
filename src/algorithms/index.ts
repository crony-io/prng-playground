import type { PrngAlgorithmDefinition } from '@/types/prng';

import { lcg } from '@/algorithms/lcg';
import { mulberry32 } from '@/algorithms/mulberry32';
import { sfc32 } from '@/algorithms/sfc32';
import { simpleCounter } from '@/algorithms/simple-counter';
import { splitmix32 } from '@/algorithms/splitmix32';
import { xorshift32 } from '@/algorithms/xorshift32';
import { xoshiro128ss } from '@/algorithms/xoshiro128ss';

/**
 * Registry of all built-in PRNG algorithms.
 * Algorithms are keyed by their unique ID.
 */
export const BUILTIN_ALGORITHMS: ReadonlyMap<string, PrngAlgorithmDefinition> = new Map<
  string,
  PrngAlgorithmDefinition
>([
  [sfc32.id, sfc32 as PrngAlgorithmDefinition],
  [mulberry32.id, mulberry32 as PrngAlgorithmDefinition],
  [splitmix32.id, splitmix32 as PrngAlgorithmDefinition],
  [xorshift32.id, xorshift32 as PrngAlgorithmDefinition],
  [xoshiro128ss.id, xoshiro128ss as PrngAlgorithmDefinition],
  [lcg.id, lcg as PrngAlgorithmDefinition],
  [simpleCounter.id, simpleCounter as PrngAlgorithmDefinition],
]);

/**
 * Default algorithm ID to use when no algorithm is specified.
 */
export const DEFAULT_ALGORITHM_ID = 'sfc32';

/**
 * List of all built-in algorithm IDs in display order.
 */
export const ALGORITHM_IDS = [
  'sfc32',
  'mulberry32',
  'splitmix32',
  'xoshiro128ss',
  'xorshift32',
  'lcg',
  'simple-counter',
] as const;

export type BuiltinAlgorithmId = (typeof ALGORITHM_IDS)[number];

/**
 * Gets an algorithm by ID from the built-in registry.
 *
 * @param id - The algorithm ID
 * @returns The algorithm definition or undefined if not found
 */
export function getAlgorithm(id: string): PrngAlgorithmDefinition | undefined {
  return BUILTIN_ALGORITHMS.get(id);
}

/**
 * Gets all built-in algorithms as an array.
 *
 * @returns Array of algorithm definitions in display order
 */
export function getAllAlgorithms(): PrngAlgorithmDefinition[] {
  return ALGORITHM_IDS.map((id) => BUILTIN_ALGORITHMS.get(id)).filter(
    (alg): alg is PrngAlgorithmDefinition => alg !== undefined,
  );
}
