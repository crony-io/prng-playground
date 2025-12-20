import type { PrngAlgorithmDefinition, PrngSeed } from '@/types/prng';
import { generateSeeds } from '@/utils/seed';

export interface Mulberry32State {
  a: number;
}

/**
 * Mulberry32 - Minimalistic 32-bit state PRNG.
 * Very fast, passes gjrand tests. Period ~4 billion.
 * Note: May skip about 1/3 of all 32-bit values.
 */
export const mulberry32: PrngAlgorithmDefinition<Mulberry32State> = {
  id: 'mulberry32',
  meta: {
    nameKey: 'algorithms.mulberry32.name',
    descriptionKey: 'algorithms.mulberry32.description',
    tags: ['fast', 'modern'],
    stateSizeBits: 32,
    recommendedUseKey: 'algorithms.mulberry32.recommended',
    warningKeys: ['algorithms.mulberry32.warning'],
    references: [
      {
        labelKey: 'algorithms.references.mulberry32_gist',
        url: 'https://gist.github.com/tommyettinger/46a874533244883189143505d203312c',
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
        right: { type: 'const', value: 0x6d2b79f5 },
      },
      { op: 'ushr', target: 't', left: { type: 'state', value: 'a' }, amount: 15 },
      {
        op: 'xor',
        target: 't',
        left: { type: 'state', value: 'a' },
        right: { type: 'temp', value: 't' },
      },
      {
        op: 'or',
        target: 'u',
        left: { type: 'state', value: 'a' },
        right: { type: 'const', value: 1 },
      },
      {
        op: 'mul',
        target: 't',
        left: { type: 'temp', value: 't' },
        right: { type: 'temp', value: 'u' },
      },
      { op: 'ushr', target: 'u', left: { type: 'temp', value: 't' }, amount: 7 },
      {
        op: 'xor',
        target: 'u',
        left: { type: 'temp', value: 't' },
        right: { type: 'temp', value: 'u' },
      },
      {
        op: 'or',
        target: 'v',
        left: { type: 'temp', value: 't' },
        right: { type: 'const', value: 61 },
      },
      {
        op: 'mul',
        target: 'u',
        left: { type: 'temp', value: 'u' },
        right: { type: 'temp', value: 'v' },
      },
      {
        op: 'xor',
        target: 't',
        left: { type: 'temp', value: 't' },
        right: { type: 'temp', value: 'u' },
      },
      { op: 'ushr', target: 'u', left: { type: 'temp', value: 't' }, amount: 14 },
      {
        op: 'xor',
        target: 't',
        left: { type: 'temp', value: 't' },
        right: { type: 'temp', value: 'u' },
      },
    ],
    outputVariable: 't',
  },
  init(seed: PrngSeed): Mulberry32State {
    const [s0] = generateSeeds(seed, 1);
    return { a: s0 ?? 0 };
  },
  next(state: Mulberry32State) {
    let a = state.a | 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return {
      value: ((t ^ (t >>> 14)) >>> 0) / 4294967296,
      state: { a },
    };
  },
  peekState(state: Mulberry32State) {
    return { a: state.a >>> 0 };
  },
  serializeState(state: Mulberry32State) {
    return [state.a >>> 0];
  },
  deserializeState(data: unknown): Mulberry32State {
    if (!Array.isArray(data) || data.length !== 1) {
      throw new Error('Invalid mulberry32 state');
    }
    return { a: data[0] | 0 };
  },
};
