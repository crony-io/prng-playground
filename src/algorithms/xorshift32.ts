import type { PrngAlgorithmDefinition, PrngSeed } from '@/types/prng';
import { generateSeeds } from '@/utils/seed';

export interface Xorshift32State {
  a: number;
}

/**
 * Xorshift32 - Marsaglia's original 32-bit Xorshift (2003).
 * Educational algorithm. Fast but fails many modern statistical tests.
 * Good for learning about PRNG structure.
 */
export const xorshift32: PrngAlgorithmDefinition<Xorshift32State> = {
  id: 'xorshift32',
  meta: {
    nameKey: 'algorithms.xorshift32.name',
    descriptionKey: 'algorithms.xorshift32.description',
    tags: ['educational', 'legacy'],
    stateSizeBits: 32,
    recommendedUseKey: 'algorithms.xorshift32.recommended',
    warningKeys: ['algorithms.xorshift32.warning'],
    references: [
      {
        labelKey: 'algorithms.references.xorshift_paper',
        url: 'https://www.jstatsoft.org/article/view/v008i14',
      },
    ],
  },
  dslTemplate: {
    stateVariables: [{ name: 'a', initialValue: 1 }],
    operations: [
      { op: 'shl', target: 't', left: { type: 'state', value: 'a' }, amount: 13 },
      {
        op: 'xor',
        target: 'a',
        left: { type: 'state', value: 'a' },
        right: { type: 'temp', value: 't' },
      },
      { op: 'ushr', target: 't', left: { type: 'state', value: 'a' }, amount: 17 },
      {
        op: 'xor',
        target: 'a',
        left: { type: 'state', value: 'a' },
        right: { type: 'temp', value: 't' },
      },
      { op: 'shl', target: 't', left: { type: 'state', value: 'a' }, amount: 5 },
      {
        op: 'xor',
        target: 'a',
        left: { type: 'state', value: 'a' },
        right: { type: 'temp', value: 't' },
      },
    ],
    outputVariable: 'a',
  },
  init(seed: PrngSeed): Xorshift32State {
    const [s0] = generateSeeds(seed, 1);
    let a = s0 ?? 1;
    if (a === 0) {
      a = 1;
    }
    return { a };
  },
  next(state: Xorshift32State) {
    let a = state.a;
    a ^= a << 13;
    a ^= a >>> 17;
    a ^= a << 5;
    return {
      value: (a >>> 0) / 4294967296,
      state: { a },
    };
  },
  peekState(state: Xorshift32State) {
    return { a: state.a >>> 0 };
  },
  serializeState(state: Xorshift32State) {
    return [state.a >>> 0];
  },
  deserializeState(data: unknown): Xorshift32State {
    if (!Array.isArray(data) || data.length !== 1) {
      throw new Error('Invalid xorshift32 state');
    }
    let a = data[0] | 0;
    if (a === 0) {
      a = 1;
    }
    return { a };
  },
};
