import type { PrngAlgorithmDefinition, PrngSeed } from '@/types/prng';
import { generateSeeds } from '@/utils/seed';

export interface SimpleCounterState {
  a: number;
}

/**
 * Simple Counter - The worst possible PRNG.
 * Just increments state by 1 each step. Completely predictable.
 * Useful for learning what makes a bad PRNG and why randomness matters.
 */
export const simpleCounter: PrngAlgorithmDefinition<SimpleCounterState> = {
  id: 'simple-counter',
  meta: {
    nameKey: 'algorithms.simpleCounter.name',
    descriptionKey: 'algorithms.simpleCounter.description',
    tags: ['educational'],
    stateSizeBits: 32,
    recommendedUseKey: 'algorithms.simpleCounter.recommended',
    warningKeys: ['algorithms.simpleCounter.warning'],
  },
  dslTemplate: {
    stateVariables: [{ name: 'a', initialValue: 0 }],
    operations: [
      {
        op: 'add',
        target: 'a',
        left: { type: 'state', value: 'a' },
        right: { type: 'const', value: 1 },
      },
    ],
    outputVariable: 'a',
  },
  init(seed: PrngSeed): SimpleCounterState {
    const [s0] = generateSeeds(seed, 1);
    return { a: s0 ?? 0 };
  },
  next(state: SimpleCounterState) {
    const a = (state.a + 1) | 0;
    return {
      value: (a >>> 0) / 4294967296,
      state: { a },
    };
  },
  peekState(state: SimpleCounterState) {
    return { a: state.a >>> 0 };
  },
  serializeState(state: SimpleCounterState) {
    return [state.a >>> 0];
  },
  deserializeState(data: unknown): SimpleCounterState {
    if (!Array.isArray(data) || data.length !== 1) {
      throw new Error('Invalid simple-counter state');
    }
    return { a: data[0] | 0 };
  },
};
