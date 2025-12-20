import type { PrngAlgorithmDefinition, PrngSeed } from '@/types/prng';
import { generateSeeds } from '@/utils/seed';

export interface Sfc32State {
  a: number;
  b: number;
  c: number;
  d: number;
}

/**
 * SFC32 - Small Fast Counter PRNG.
 * Part of the PractRand test suite. Passes PractRand and BigCrush.
 * 128-bit state, very fast, excellent quality.
 */
export const sfc32: PrngAlgorithmDefinition<Sfc32State> = {
  id: 'sfc32',
  meta: {
    nameKey: 'algorithms.sfc32.name',
    descriptionKey: 'algorithms.sfc32.description',
    tags: ['fast', 'modern'],
    stateSizeBits: 128,
    recommendedUseKey: 'algorithms.sfc32.recommended',
    references: [
      {
        labelKey: 'algorithms.references.pracrand',
        url: 'http://pracrand.sourceforge.net/',
      },
    ],
  },
  dslTemplate: {
    stateVariables: [
      { name: 'a', initialValue: 0 },
      { name: 'b', initialValue: 0 },
      { name: 'c', initialValue: 0 },
      { name: 'd', initialValue: 1 },
    ],
    operations: [
      {
        op: 'add',
        target: 't',
        left: { type: 'state', value: 'a' },
        right: { type: 'state', value: 'b' },
      },
      {
        op: 'add',
        target: 't',
        left: { type: 'temp', value: 't' },
        right: { type: 'state', value: 'd' },
      },
      {
        op: 'add',
        target: 'd',
        left: { type: 'state', value: 'd' },
        right: { type: 'const', value: 1 },
      },
      { op: 'ushr', target: 'u', left: { type: 'state', value: 'b' }, amount: 9 },
      {
        op: 'xor',
        target: 'a',
        left: { type: 'state', value: 'b' },
        right: { type: 'temp', value: 'u' },
      },
      { op: 'shl', target: 'u', left: { type: 'state', value: 'c' }, amount: 3 },
      {
        op: 'add',
        target: 'b',
        left: { type: 'state', value: 'c' },
        right: { type: 'temp', value: 'u' },
      },
      { op: 'rotl', target: 'c', left: { type: 'state', value: 'c' }, amount: 21 },
      {
        op: 'add',
        target: 'c',
        left: { type: 'state', value: 'c' },
        right: { type: 'temp', value: 't' },
      },
    ],
    outputVariable: 't',
  },
  init(seed: PrngSeed): Sfc32State {
    const [s0, s1, s2] = generateSeeds(seed, 4);
    let state: Sfc32State = {
      a: s0 ?? 0,
      b: s1 ?? 0,
      c: s2 ?? 0,
      d: 1,
    };
    for (let i = 0; i < 12; i++) {
      const result = sfc32.next(state);
      state = result.state;
    }
    return state;
  },
  next(state: Sfc32State) {
    let { a, b, c, d } = state;
    a |= 0;
    b |= 0;
    c |= 0;
    d |= 0;
    const t = ((a + b) | 0) + d;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    return {
      value: (t >>> 0) / 4294967296,
      state: { a, b, c, d },
    };
  },
  peekState(state: Sfc32State) {
    return { a: state.a >>> 0, b: state.b >>> 0, c: state.c >>> 0, d: state.d >>> 0 };
  },
  serializeState(state: Sfc32State) {
    return [state.a >>> 0, state.b >>> 0, state.c >>> 0, state.d >>> 0];
  },
  deserializeState(data: unknown): Sfc32State {
    if (!Array.isArray(data) || data.length !== 4) {
      throw new Error('Invalid sfc32 state');
    }
    return { a: data[0] | 0, b: data[1] | 0, c: data[2] | 0, d: data[3] | 0 };
  },
};
