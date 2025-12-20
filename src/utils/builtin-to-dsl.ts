/**
 * Converts built-in algorithm definitions to DSL format for forking.
 * Templates are derived from algorithms that define a `dslTemplate` property.
 */

import type { DslAlgorithmDefinition, DslOperation, DslStateVariable } from '@/types/dsl';
import type { PrngAlgorithmDefinition, PrngAlgorithmTag } from '@/types/prng';
import { generateOperationId } from '@/types/dsl';
import { getAllAlgorithms } from '@/algorithms';

export interface BuiltinTemplate {
  id: string;
  algorithmId: string;
  nameKey: string;
  descriptionKey?: string;
  tags: readonly PrngAlgorithmTag[];
  stateSizeBits: number;
  stateVariables: DslStateVariable[];
  operations: Omit<DslOperation, 'id'>[];
  outputVariable: string;
}

/**
 * Derives a BuiltinTemplate from a PrngAlgorithmDefinition that has a dslTemplate.
 */
function deriveTemplate(algorithm: PrngAlgorithmDefinition): BuiltinTemplate | null {
  if (!algorithm.dslTemplate) {
    return null;
  }

  return {
    id: `template-${algorithm.id}`,
    algorithmId: algorithm.id,
    nameKey: algorithm.meta.nameKey,
    descriptionKey: algorithm.meta.descriptionKey,
    tags: algorithm.meta.tags,
    stateSizeBits: algorithm.meta.stateSizeBits,
    stateVariables: algorithm.dslTemplate.stateVariables,
    operations: algorithm.dslTemplate.operations,
    outputVariable: algorithm.dslTemplate.outputVariable,
  };
}

/**
 * Built-in templates derived from algorithms with dslTemplate defined.
 * These are the canonical source for Workshop fork templates.
 */
export const BUILTIN_TEMPLATES: BuiltinTemplate[] = getAllAlgorithms()
  .map(deriveTemplate)
  .filter((t): t is BuiltinTemplate => t !== null);

export function createDslFromTemplate(
  template: BuiltinTemplate,
  name: string,
): DslAlgorithmDefinition {
  const allVarNames = new Set<string>();

  for (const v of template.stateVariables) {
    allVarNames.add(v.name);
  }
  for (const op of template.operations) {
    allVarNames.add(op.target);
    if (op.left?.type === 'temp') {
      allVarNames.add(op.left.value as string);
    }
    if (op.right?.type === 'temp') {
      allVarNames.add(op.right.value as string);
    }
  }

  const stateVariables = Array.from(allVarNames).map((varName) => {
    const existing = template.stateVariables.find((v) => v.name === varName);
    return { name: varName, initialValue: existing?.initialValue ?? 0 };
  });

  return {
    id: crypto.randomUUID(),
    name,
    description: '',
    stateVariables,
    operations: template.operations.map((op) => ({
      ...op,
      id: generateOperationId(),
    })),
    outputVariable: template.outputVariable,
    parentId: template.id,
    stateSizeBits: template.stateSizeBits,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}
