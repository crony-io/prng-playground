import type { PrngAlgorithmDefinition, PrngSeed } from '@/types/prng';
import { generateSeeds } from '@/utils/seed';

export interface LcgState {
  a: number;
}

/**
 * LCG - Linear Congruential Generator.
 * Classic educational PRNG using the MINSTD parameters (Park-Miller).
 * Simple structure makes it ideal for learning. Fails modern tests quickly.
 * Uses Schrage's method for overflow-safe modular arithmetic.
 */
export const lcg: PrngAlgorithmDefinition<LcgState> = {
  id: 'lcg',
  meta: {
    nameKey: 'algorithms.lcg.name',
    descriptionKey: 'algorithms.lcg.description',
    tags: ['educational', 'legacy'],
    stateSizeBits: 31,
    recommendedUseKey: 'algorithms.lcg.recommended',
    warningKeys: ['algorithms.lcg.warning'],
    references: [
      {
        labelKey: 'algorithms.references.lcg_wikipedia',
        url: 'https://en.wikipedia.org/wiki/Linear_congruential_generator',
      },
      {
        labelKey: 'algorithms.references.park_miller',
        url: 'http://www.firstpr.com.au/dsp/rand31/p1192-park.pdf',
      },
    ],
  },
  dslTemplate: {
    stateVariables: [{ name: 'a', initialValue: 1 }],
    operations: [
      {
        op: 'mul',
        target: 'a',
        left: { type: 'state', value: 'a' },
        right: { type: 'const', value: 1664525 },
      },
      {
        op: 'add',
        target: 'a',
        left: { type: 'state', value: 'a' },
        right: { type: 'const', value: 1013904223 },
      },
    ],
    outputVariable: 'a',
  },
  init(seed: PrngSeed): LcgState {
    const [s0] = generateSeeds(seed, 1);
    let a = (s0 ?? 1) % 2147483647;
    if (a === 0) {
      a = 1;
    }
    return { a };
  },
  next(state: LcgState) {
    const M = 2147483647;
    const A = 48271;
    const Q = Math.floor(M / A);
    const R = M % A;

    let a = state.a;
    const hi = Math.floor(a / Q);
    const lo = a % Q;
    const t = A * lo - R * hi;
    a = t > 0 ? t : t + M;

    return {
      value: a / M,
      state: { a },
    };
  },
  peekState(state: LcgState) {
    return { a: state.a };
  },
  serializeState(state: LcgState) {
    return [state.a];
  },
  deserializeState(data: unknown): LcgState {
    if (!Array.isArray(data) || data.length !== 1) {
      throw new Error('Invalid lcg state');
    }
    let a = Math.abs(Math.floor(data[0])) % 2147483647;
    if (a === 0) {
      a = 1;
    }
    return { a };
  },
};
