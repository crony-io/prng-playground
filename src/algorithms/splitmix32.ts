import type { PrngAlgorithmDefinition, PrngSeed } from '@/types/prng';
import { generateSeeds } from '@/utils/seed';

export interface Splitmix32State {
  a: number;
}

/**
 * SplitMix32 - Based on MurmurHash3's fmix32 finalizer.
 * 32-bit state, very fast. Uses improved constants from later research.
 */
export const splitmix32: PrngAlgorithmDefinition<Splitmix32State> = {
  id: 'splitmix32',
  meta: {
    nameKey: 'algorithms.splitmix32.name',
    descriptionKey: 'algorithms.splitmix32.description',
    tags: ['fast', 'modern'],
    stateSizeBits: 32,
    recommendedUseKey: 'algorithms.splitmix32.recommended',
    references: [
      {
        labelKey: 'algorithms.references.splitmix_paper',
        url: 'http://gee.cs.oswego.edu/dl/papers/oopsla14.pdf',
      },
    ],
  },
  dslTemplate: {
    stateVariables: [{ name: 'a', initialValue: 0 }],
    operations: [
      {
        op: 'add',
        target: 'a',
        left: { type: 'state', value: 'a' },
        right: { type: 'const', value: 0x9e3779b9 },
      },
      { op: 'ushr', target: 't', left: { type: 'state', value: 'a' }, amount: 16 },
      {
        op: 'xor',
        target: 't',
        left: { type: 'state', value: 'a' },
        right: { type: 'temp', value: 't' },
      },
      {
        op: 'mul',
        target: 't',
        left: { type: 'temp', value: 't' },
        right: { type: 'const', value: 0x21f0aaad },
      },
      { op: 'ushr', target: 'u', left: { type: 'temp', value: 't' }, amount: 15 },
      {
        op: 'xor',
        target: 't',
        left: { type: 'temp', value: 't' },
        right: { type: 'temp', value: 'u' },
      },
      {
        op: 'mul',
        target: 't',
        left: { type: 'temp', value: 't' },
        right: { type: 'const', value: 0x735a2d97 },
      },
      { op: 'ushr', target: 'u', left: { type: 'temp', value: 't' }, amount: 15 },
      {
        op: 'xor',
        target: 't',
        left: { type: 'temp', value: 't' },
        right: { type: 'temp', value: 'u' },
      },
    ],
    outputVariable: 't',
  },
  init(seed: PrngSeed): Splitmix32State {
    const [s0] = generateSeeds(seed, 1);
    return { a: s0 ?? 0 };
  },
  next(state: Splitmix32State) {
    let a = state.a | 0;
    a = (a + 0x9e3779b9) | 0;
    let t = a ^ (a >>> 16);
    t = Math.imul(t, 0x21f0aaad);
    t = t ^ (t >>> 15);
    t = Math.imul(t, 0x735a2d97);
    return {
      value: ((t ^ (t >>> 15)) >>> 0) / 4294967296,
      state: { a },
    };
  },
  peekState(state: Splitmix32State) {
    return { a: state.a >>> 0 };
  },
  serializeState(state: Splitmix32State) {
    return [state.a >>> 0];
  },
  deserializeState(data: unknown): Splitmix32State {
    if (!Array.isArray(data) || data.length !== 1) {
      throw new Error('Invalid splitmix32 state');
    }
    return { a: data[0] | 0 };
  },
};
