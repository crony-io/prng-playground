import type { DslOperation, DslStateVariable } from '@/types/dsl';

export type Uint32 = number;

export type PrngSeed = string | number | bigint | readonly number[] | Uint32Array;

export type PrngAlgorithmTag = 'fast' | 'modern' | 'educational' | 'legacy';

export interface PrngReference {
  labelKey: string;
  url: string;
}

export interface PrngAlgorithmMeta {
  nameKey: string;
  descriptionKey?: string;
  tags: readonly PrngAlgorithmTag[];
  stateSizeBits: number;
  recommendedUseKey?: string;
  warningKeys?: readonly string[];
  references?: readonly PrngReference[];
}

export interface PrngDslTemplate {
  stateVariables: DslStateVariable[];
  operations: Omit<DslOperation, 'id'>[];
  outputVariable: string;
}

export interface PrngNextResult<State> {
  value: number;
  state: State;
}

export interface PrngAlgorithmDefinition<State = unknown> {
  id: string;
  meta: PrngAlgorithmMeta;
  dslTemplate?: PrngDslTemplate;
  init: (seed: PrngSeed) => State;
  next: (state: State) => PrngNextResult<State>;
  peekState?: (state: State) => unknown;
  serializeState?: (state: State) => unknown;
  deserializeState?: (data: unknown) => State;
}

export function definePrngAlgorithm<State>(
  definition: PrngAlgorithmDefinition<State>,
): PrngAlgorithmDefinition<State> {
  return definition;
}
