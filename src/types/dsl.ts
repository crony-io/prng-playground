/**
 * DSL type definitions for safe algorithm creation.
 * Operations are constrained to prevent arbitrary code execution.
 */

export type DslOperationType =
  | 'add'
  | 'sub'
  | 'xor'
  | 'and'
  | 'or'
  | 'not'
  | 'shl'
  | 'shr'
  | 'ushr'
  | 'rotl'
  | 'rotr'
  | 'mul'
  | 'mod'
  | 'const'
  | 'state'
  | 'assign';

export interface DslOperand {
  type: 'const' | 'state' | 'temp';
  value: number | string;
}

export interface DslOperation {
  id: string;
  op: DslOperationType;
  target: string;
  left?: DslOperand;
  right?: DslOperand;
  amount?: number;
}

export interface DslStateVariable {
  name: string;
  initialValue: number;
}

export interface DslAlgorithmDefinition {
  id: string;
  name: string;
  description: string;
  stateVariables: DslStateVariable[];
  operations: DslOperation[];
  outputVariable: string;
  parentId?: string;
  stateSizeBits?: number;
  createdAt: number;
  updatedAt: number;
}

/**
 * Calculates the state size in bits for a DSL algorithm.
 * Counts variables read as 'state' type in operations.
 * Falls back to stateVariables count if no state reads found.
 */
export function calculateStateSizeBits(alg: DslAlgorithmDefinition): number {
  if (alg.stateSizeBits !== undefined) {
    return alg.stateSizeBits;
  }

  const stateVarNames = new Set<string>();
  for (const op of alg.operations) {
    if (op.left?.type === 'state' && typeof op.left.value === 'string') {
      stateVarNames.add(op.left.value);
    }
    if (op.right?.type === 'state' && typeof op.right.value === 'string') {
      stateVarNames.add(op.right.value);
    }
  }

  const count = stateVarNames.size > 0 ? stateVarNames.size : alg.stateVariables.length;
  return count * 32;
}

export function createOperandFromState(name: string): DslOperand {
  return { type: 'state', value: name };
}

export function createOperandFromConst(value: number): DslOperand {
  return { type: 'const', value };
}

export function createOperandFromTemp(name: string): DslOperand {
  return { type: 'temp', value: name };
}

export function generateOperationId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export function createDefaultAlgorithm(): DslAlgorithmDefinition {
  return {
    id: crypto.randomUUID(),
    name: '',
    description: '',
    stateVariables: [{ name: 's', initialValue: 0 }],
    operations: [
      {
        id: generateOperationId(),
        op: 'add',
        target: 's',
        left: { type: 'state', value: 's' },
        right: { type: 'const', value: 1 },
      },
    ],
    outputVariable: 's',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}
