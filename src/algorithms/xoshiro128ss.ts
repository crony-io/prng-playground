import type { PrngAlgorithmDefinition, PrngSeed } from '@/types/prng';
import { generateSeeds } from '@/utils/seed';

export interface Xoshiro128ssState {
  a: number;
  b: number;
  c: number;
  d: number;
}

/**
 * xoshiro128** - Modern Xorshift derivative (2018).
 * 128-bit state, fast, good quality. Preferred version of xoshiro128.
 * Has some LFSR-related issues but better than plain xorshift.
 */
export const xoshiro128ss: PrngAlgorithmDefinition<Xoshiro128ssState> = {
  id: 'xoshiro128ss',
  meta: {
    nameKey: 'algorithms.xoshiro128ss.name',
    descriptionKey: 'algorithms.xoshiro128ss.description',
    tags: ['fast', 'modern'],
    stateSizeBits: 128,
    recommendedUseKey: 'algorithms.xoshiro128ss.recommended',
    warningKeys: ['algorithms.xoshiro128ss.warning'],
    references: [
      {
        labelKey: 'algorithms.references.xoshiro_paper',
        url: 'http://vigna.di.unimi.it/ftp/papers/ScrambledLinear.pdf',
      },
    ],
  },
  dslTemplate: {
    stateVariables: [
      { name: 'a', initialValue: 1 },
      { name: 'b', initialValue: 0 },
      { name: 'c', initialValue: 0 },
      { name: 'd', initialValue: 0 },
    ],
    operations: [
      { op: 'shl', target: 't', left: { type: 'state', value: 'b' }, amount: 9 },
      {
        op: 'mul',
        target: 'r',
        left: { type: 'state', value: 'b' },
        right: { type: 'const', value: 5 },
      },
      { op: 'rotl', target: 'r', left: { type: 'temp', value: 'r' }, amount: 7 },
      {
        op: 'mul',
        target: 'r',
        left: { type: 'temp', value: 'r' },
        right: { type: 'const', value: 9 },
      },
      {
        op: 'xor',
        target: 'c',
        left: { type: 'state', value: 'c' },
        right: { type: 'state', value: 'a' },
      },
      {
        op: 'xor',
        target: 'd',
        left: { type: 'state', value: 'd' },
        right: { type: 'state', value: 'b' },
      },
      {
        op: 'xor',
        target: 'b',
        left: { type: 'state', value: 'b' },
        right: { type: 'state', value: 'c' },
      },
      {
        op: 'xor',
        target: 'a',
        left: { type: 'state', value: 'a' },
        right: { type: 'state', value: 'd' },
      },
      {
        op: 'xor',
        target: 'c',
        left: { type: 'state', value: 'c' },
        right: { type: 'temp', value: 't' },
      },
      { op: 'rotl', target: 'd', left: { type: 'state', value: 'd' }, amount: 11 },
    ],
    outputVariable: 'r',
  },
  init(seed: PrngSeed): Xoshiro128ssState {
    const [s0, s1, s2, s3] = generateSeeds(seed, 4);
    let a = s0 ?? 0;
    const b = s1 ?? 0;
    const c = s2 ?? 0;
    const d = s3 ?? 0;
    if ((a | b | c | d) === 0) {
      a = 1;
    }
    return { a, b, c, d };
  },
  next(state: Xoshiro128ssState) {
    let { a, b, c, d } = state;
    const t = b << 9;
    let r = b * 5;
    r = ((r << 7) | (r >>> 25)) * 9;
    c = c ^ a;
    d = d ^ b;
    b = b ^ c;
    a = a ^ d;
    c = c ^ t;
    d = (d << 11) | (d >>> 21);
    return {
      value: (r >>> 0) / 4294967296,
      state: { a, b, c, d },
    };
  },
  peekState(state: Xoshiro128ssState) {
    return { a: state.a >>> 0, b: state.b >>> 0, c: state.c >>> 0, d: state.d >>> 0 };
  },
  serializeState(state: Xoshiro128ssState) {
    return [state.a >>> 0, state.b >>> 0, state.c >>> 0, state.d >>> 0];
  },
  deserializeState(data: unknown): Xoshiro128ssState {
    if (!Array.isArray(data) || data.length !== 4) {
      throw new Error('Invalid xoshiro128ss state');
    }
    const [d0, d1, d2, d3] = data as number[];
    let a = (d0 ?? 0) | 0;
    const b = (d1 ?? 0) | 0;
    const c = (d2 ?? 0) | 0;
    const d = (d3 ?? 0) | 0;
    if ((a | b | c | d) === 0) {
      a = 1;
    }
    return { a, b, c, d };
  },
};
