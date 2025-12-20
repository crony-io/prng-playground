/**
 * Safe DSL executor for user-defined algorithms.
 * All operations are constrained to 32-bit integers.
 */

import { LIMITS } from '@/constants/limits';
import type { DslAlgorithmDefinition, DslOperand, DslOperation } from '@/types/dsl';
import { i18n } from '@/i18n';

export interface DslExecutionState {
  [key: string]: number;
}

export interface DslExecutionResult {
  value: number;
  state: DslExecutionState;
}

export interface DslOperationTraceEntry {
  operation: DslOperation;
  resolvedLeft: number;
  resolvedRight: number;
  resolvedAmount: number;
  beforeTarget: number | undefined;
  afterTarget: number;
}

export interface DslExecutionResultWithTrace extends DslExecutionResult {
  trace: DslOperationTraceEntry[];
}

export interface DslExecutionError {
  operationId: string;
  message: string;
}

const MAX_OPERATIONS_PER_STEP = LIMITS.MAX_OPERATIONS_PER_STEP;

function resolveOperand(operand: DslOperand, state: DslExecutionState): number {
  if (operand.type === 'const') {
    return (operand.value as number) >>> 0;
  }
  const val = state[operand.value as string];
  if (val === undefined) {
    throw new Error(i18n.global.t('dsl.error.unknownVariable', { variable: operand.value }));
  }
  return val >>> 0;
}

function computeOperationResult(
  op: DslOperation,
  left: number,
  right: number,
): { result: number; resolvedAmount: number } {
  const amount = op.amount ?? 0;

  switch (op.op) {
    case 'add':
      return { result: (left + right) | 0, resolvedAmount: amount };
    case 'sub':
      return { result: (left - right) | 0, resolvedAmount: amount };
    case 'xor':
      return { result: left ^ right, resolvedAmount: amount };
    case 'and':
      return { result: left & right, resolvedAmount: amount };
    case 'or':
      return { result: left | right, resolvedAmount: amount };
    case 'not':
      return { result: ~left, resolvedAmount: amount };
    case 'shl': {
      const shift = (op.amount ?? right) & 31;
      return { result: left << shift, resolvedAmount: shift };
    }
    case 'shr': {
      const shift = (op.amount ?? right) & 31;
      return { result: left >> shift, resolvedAmount: shift };
    }
    case 'ushr': {
      const shift = (op.amount ?? right) & 31;
      return { result: left >>> shift, resolvedAmount: shift };
    }
    case 'rotl': {
      const shift = (op.amount ?? right) & 31;
      return { result: (left << shift) | (left >>> (32 - shift)), resolvedAmount: shift };
    }
    case 'rotr': {
      const shift = (op.amount ?? right) & 31;
      return { result: (left >>> shift) | (left << (32 - shift)), resolvedAmount: shift };
    }
    case 'mul':
      return { result: Math.imul(left, right), resolvedAmount: amount };
    case 'mod': {
      if (right === 0) {
        return { result: 0, resolvedAmount: amount };
      }
      return { result: ((left >>> 0) % (right >>> 0)) >>> 0, resolvedAmount: amount };
    }
    case 'const':
      return { result: left, resolvedAmount: amount };
    case 'state':
      return { result: left, resolvedAmount: amount };
    case 'assign':
      return { result: left, resolvedAmount: amount };
    default:
      throw new Error(i18n.global.t('dsl.error.unknownOperation', { operation: op.op }));
  }
}

function executeOperation(op: DslOperation, state: DslExecutionState): void {
  const left = op.left ? resolveOperand(op.left, state) : 0;
  const right = op.right ? resolveOperand(op.right, state) : 0;
  const computed = computeOperationResult(op, left, right);

  state[op.target] = computed.result >>> 0;
}

function executeOperationWithTrace(
  op: DslOperation,
  state: DslExecutionState,
): DslOperationTraceEntry {
  const left = op.left ? resolveOperand(op.left, state) : 0;
  const right = op.right ? resolveOperand(op.right, state) : 0;
  const beforeTarget = state[op.target];
  const computed = computeOperationResult(op, left, right);
  const afterTarget = computed.result >>> 0;

  state[op.target] = afterTarget;

  return {
    operation: op,
    resolvedLeft: left,
    resolvedRight: right,
    resolvedAmount: computed.resolvedAmount,
    beforeTarget: beforeTarget !== undefined ? beforeTarget >>> 0 : undefined,
    afterTarget,
  };
}

export function initializeState(
  algorithm: DslAlgorithmDefinition,
  seed: number,
): DslExecutionState {
  const state: DslExecutionState = {};

  for (const variable of algorithm.stateVariables) {
    state[variable.name] = (variable.initialValue ^ seed) >>> 0;
  }

  return state;
}

export function executeStep(
  algorithm: DslAlgorithmDefinition,
  state: DslExecutionState,
): DslExecutionResult {
  const newState = { ...state };
  let operationCount = 0;

  for (const operation of algorithm.operations) {
    if (operationCount >= MAX_OPERATIONS_PER_STEP) {
      throw new Error(i18n.global.t('dsl.error.tooManyOperations'));
    }
    executeOperation(operation, newState);
    operationCount++;
  }

  const outputValue = newState[algorithm.outputVariable];
  if (outputValue === undefined) {
    throw new Error(
      i18n.global.t('dsl.error.outputVariableNotFound', { variable: algorithm.outputVariable }),
    );
  }

  return {
    value: (outputValue >>> 0) / 4294967296,
    state: newState,
  };
}

export function executeStepWithTrace(
  algorithm: DslAlgorithmDefinition,
  state: DslExecutionState,
): DslExecutionResultWithTrace {
  const newState = { ...state };
  const trace: DslOperationTraceEntry[] = [];
  let operationCount = 0;

  for (const operation of algorithm.operations) {
    if (operationCount >= MAX_OPERATIONS_PER_STEP) {
      throw new Error(i18n.global.t('dsl.error.tooManyOperations'));
    }
    trace.push(executeOperationWithTrace(operation, newState));
    operationCount++;
  }

  const outputValue = newState[algorithm.outputVariable];
  if (outputValue === undefined) {
    throw new Error(
      i18n.global.t('dsl.error.outputVariableNotFound', { variable: algorithm.outputVariable }),
    );
  }

  return {
    value: (outputValue >>> 0) / 4294967296,
    state: newState,
    trace,
  };
}

export function validateAlgorithm(algorithm: DslAlgorithmDefinition): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!algorithm.name.trim()) {
    errors.push(i18n.global.t('dsl.validate.nameRequired'));
  }

  if (algorithm.stateVariables.length === 0) {
    errors.push(i18n.global.t('dsl.validate.stateRequired'));
  }

  if (algorithm.operations.length === 0) {
    errors.push(i18n.global.t('dsl.validate.operationRequired'));
  }

  const stateNames = new Set(algorithm.stateVariables.map((v) => v.name));

  if (!stateNames.has(algorithm.outputVariable)) {
    errors.push(
      i18n.global.t('dsl.validate.outputVariableNotFound', { variable: algorithm.outputVariable }),
    );
  }

  for (const op of algorithm.operations) {
    if (op.left?.type === 'state' && !stateNames.has(op.left.value as string)) {
      errors.push(i18n.global.t('dsl.validate.undefinedVariable', { variable: op.left.value }));
    }
    if (op.right?.type === 'state' && !stateNames.has(op.right.value as string)) {
      errors.push(i18n.global.t('dsl.validate.undefinedVariable', { variable: op.right.value }));
    }
  }

  return { valid: errors.length === 0, errors };
}

export function testAlgorithm(
  algorithm: DslAlgorithmDefinition,
  seed: number,
  count: number,
): { success: boolean; samples: number[]; error?: string } {
  try {
    const state = initializeState(algorithm, seed);
    const samples: number[] = [];
    let currentState = state;

    for (let i = 0; i < count; i++) {
      const result = executeStep(algorithm, currentState);
      samples.push(result.value);
      currentState = result.state;
    }

    return { success: true, samples };
  } catch (err) {
    return {
      success: false,
      samples: [],
      error: err instanceof Error ? err.message : i18n.global.t('dsl.error.unknown'),
    };
  }
}
