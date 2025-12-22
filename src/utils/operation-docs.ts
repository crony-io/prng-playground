/**
 * Educational documentation for DSL operations.
 * Each operation includes metadata and i18n keys for translated content.
 * This helps new developers understand what each operation does at the bit level.
 */

import type { DslOperationType } from '@/types/dsl';

export type OperationCategory = 'arithmetic' | 'bitwise' | 'shift' | 'rotate' | 'assignment';

/**
 * Static metadata for an operation (not translated).
 */
export interface OperationMeta {
  /** Short symbol shown in UI (e.g., "+", "⊕") */
  symbol: string;
  /** Category for grouping in UI */
  category: OperationCategory;
  /** Whether this operation needs a right operand */
  needsRight: boolean;
  /** Whether this uses a shift/rotate amount instead of right operand */
  usesAmount: boolean;
  /** i18n key for this operation (e.g., "add" -> "operationDocs.operations.add") */
  i18nKey: string;
}

/**
 * Static metadata for all DSL operations.
 * Text content is retrieved via i18n using the i18nKey.
 */
export const OPERATION_META: Record<DslOperationType, OperationMeta> = {
  add: {
    symbol: '+',
    category: 'arithmetic',
    needsRight: true,
    usesAmount: false,
    i18nKey: 'operationDocs.operations.add',
  },
  sub: {
    symbol: '−',
    category: 'arithmetic',
    needsRight: true,
    usesAmount: false,
    i18nKey: 'operationDocs.operations.sub',
  },
  mul: {
    symbol: '×',
    category: 'arithmetic',
    needsRight: true,
    usesAmount: false,
    i18nKey: 'operationDocs.operations.mul',
  },
  mod: {
    symbol: '%',
    category: 'arithmetic',
    needsRight: true,
    usesAmount: false,
    i18nKey: 'operationDocs.operations.mod',
  },
  xor: {
    symbol: '⊕',
    category: 'bitwise',
    needsRight: true,
    usesAmount: false,
    i18nKey: 'operationDocs.operations.xor',
  },
  and: {
    symbol: '&',
    category: 'bitwise',
    needsRight: true,
    usesAmount: false,
    i18nKey: 'operationDocs.operations.and',
  },
  or: {
    symbol: '|',
    category: 'bitwise',
    needsRight: true,
    usesAmount: false,
    i18nKey: 'operationDocs.operations.or',
  },
  not: {
    symbol: '~',
    category: 'bitwise',
    needsRight: false,
    usesAmount: false,
    i18nKey: 'operationDocs.operations.not',
  },
  shl: {
    symbol: '<<',
    category: 'shift',
    needsRight: false,
    usesAmount: true,
    i18nKey: 'operationDocs.operations.shl',
  },
  shr: {
    symbol: '>>',
    category: 'shift',
    needsRight: false,
    usesAmount: true,
    i18nKey: 'operationDocs.operations.shr',
  },
  ushr: {
    symbol: '>>>',
    category: 'shift',
    needsRight: false,
    usesAmount: true,
    i18nKey: 'operationDocs.operations.ushr',
  },
  rotl: {
    symbol: '↻',
    category: 'rotate',
    needsRight: false,
    usesAmount: true,
    i18nKey: 'operationDocs.operations.rotl',
  },
  rotr: {
    symbol: '↺',
    category: 'rotate',
    needsRight: false,
    usesAmount: true,
    i18nKey: 'operationDocs.operations.rotr',
  },
  const: {
    symbol: '#',
    category: 'assignment',
    needsRight: false,
    usesAmount: false,
    i18nKey: 'operationDocs.operations.const',
  },
  state: {
    symbol: '$',
    category: 'assignment',
    needsRight: false,
    usesAmount: false,
    i18nKey: 'operationDocs.operations.state',
  },
  assign: {
    symbol: '=',
    category: 'assignment',
    needsRight: true,
    usesAmount: false,
    i18nKey: 'operationDocs.operations.assign',
  },
};

/**
 * Get the metadata for an operation type.
 */
export function getOperationMeta(op: DslOperationType): OperationMeta {
  return OPERATION_META[op];
}

/**
 * Get all operations grouped by category.
 */
export function getOperationsByCategory(): Record<OperationCategory, DslOperationType[]> {
  const result: Record<OperationCategory, DslOperationType[]> = {
    arithmetic: [],
    bitwise: [],
    shift: [],
    rotate: [],
    assignment: [],
  };

  for (const [op, meta] of Object.entries(OPERATION_META)) {
    const category = result[meta.category];
    if (category) {
      category.push(op as DslOperationType);
    }
  }

  return result;
}

/**
 * Operations available for the Workshop editor (excludes internal types like const, state, assign).
 */
export const EDITOR_OPERATIONS: DslOperationType[] = [
  'add',
  'sub',
  'mul',
  'mod',
  'xor',
  'and',
  'or',
  'shl',
  'shr',
  'ushr',
  'rotl',
  'rotr',
];

/**
 * All categories with their i18n keys.
 */
export const OPERATION_CATEGORIES: { key: OperationCategory; i18nKey: string }[] = [
  { key: 'arithmetic', i18nKey: 'operationDocs.categories.arithmetic' },
  { key: 'bitwise', i18nKey: 'operationDocs.categories.bitwise' },
  { key: 'shift', i18nKey: 'operationDocs.categories.shift' },
  { key: 'rotate', i18nKey: 'operationDocs.categories.rotate' },
];
