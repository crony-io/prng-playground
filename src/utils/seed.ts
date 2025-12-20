import type { PrngSeed, Uint32 } from '@/types/prng';

/**
 * xmur3 - A string hash function based on MurmurHash3's mixing function.
 * Returns a function that produces sequential 32-bit hash values.
 * Each call to the returned function yields a new seed value.
 *
 * @param str - The string to hash
 * @returns A function that returns sequential 32-bit unsigned integers
 */
export function xmur3(str: string): () => Uint32 {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

/**
 * Converts any supported seed type to a string for hashing.
 *
 * @param seed - The seed value (string, number, bigint, array of numbers, or Uint32Array)
 * @returns A string representation of the seed
 */
export function seedToString(seed: PrngSeed): string {
  if (typeof seed === 'string') {
    return seed;
  }
  if (typeof seed === 'number') {
    return seed.toString();
  }
  if (typeof seed === 'bigint') {
    return seed.toString();
  }
  if (seed instanceof Uint32Array) {
    return Array.from(seed).join(',');
  }
  if (Array.isArray(seed)) {
    return seed.join(',');
  }
  return String(seed);
}

/**
 * Creates a seed generator from any supported seed type.
 * The generator produces sequential 32-bit hash values suitable for
 * initializing PRNG state variables.
 *
 * @param seed - The seed value
 * @returns A function that returns sequential 32-bit unsigned integers
 */
export function createSeedGenerator(seed: PrngSeed): () => Uint32 {
  return xmur3(seedToString(seed));
}

/**
 * Generates N seed values from a single seed.
 *
 * @param seed - The initial seed value
 * @param count - Number of seed values to generate
 * @returns An array of 32-bit unsigned integers
 */
export function generateSeeds(seed: PrngSeed, count: number): Uint32[] {
  const gen = createSeedGenerator(seed);
  const seeds: Uint32[] = [];
  for (let i = 0; i < count; i++) {
    seeds.push(gen());
  }
  return seeds;
}
