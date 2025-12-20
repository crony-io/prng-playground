import { defineStore } from 'pinia';
import { ref, toRaw, watch } from 'vue';
import { z } from 'zod';

import { createVersionedLocalStorage, makeStorageKey } from '@/utils/persistence';
import type { DslAlgorithmDefinition, DslStateVariable, DslOperation } from '@/types/dsl';
import { createDefaultAlgorithm, generateOperationId } from '@/types/dsl';

const dslOperandSchema = z.object({
  type: z.enum(['const', 'state', 'temp']),
  value: z.union([z.number(), z.string()]),
});

const dslOperationSchema = z.object({
  id: z.string(),
  op: z.enum([
    'add',
    'sub',
    'xor',
    'and',
    'or',
    'not',
    'shl',
    'shr',
    'ushr',
    'rotl',
    'rotr',
    'mul',
    'mod',
    'const',
    'state',
    'assign',
  ]),
  target: z.string(),
  left: dslOperandSchema.optional(),
  right: dslOperandSchema.optional(),
  amount: z.number().optional(),
});

const dslStateVariableSchema = z.object({
  name: z.string(),
  initialValue: z.number(),
});

const dslAlgorithmSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  stateVariables: z.array(dslStateVariableSchema),
  operations: z.array(dslOperationSchema),
  outputVariable: z.string(),
  parentId: z.string().optional(),
  stateSizeBits: z.number().optional(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

const persistedWorkshopStateV1Schema = z.object({
  schemaVersion: z.literal(1),
  algorithms: z.array(dslAlgorithmSchema),
  activeAlgorithmId: z.string().nullable(),
});

type PersistedWorkshopStateV1 = z.infer<typeof persistedWorkshopStateV1Schema>;

const workshopStorage = createVersionedLocalStorage<PersistedWorkshopStateV1>({
  key: makeStorageKey('workshop', 'algorithms'),
  latestVersion: 1,
  schemas: {
    1: persistedWorkshopStateV1Schema,
  },
  coerce: (input) => {
    if (typeof input !== 'object' || input === null) {
      return undefined;
    }

    const value = input as Record<string, unknown>;

    // Attempt to recover algorithms array from legacy or malformed data
    if (Array.isArray(value.algorithms)) {
      const activeId = typeof value.activeAlgorithmId === 'string' ? value.activeAlgorithmId : null;
      return {
        schemaVersion: 1,
        algorithms: value.algorithms,
        activeAlgorithmId: activeId,
      };
    }

    return undefined;
  },
});

export const useWorkshopStore = defineStore('workshop', () => {
  const persisted = workshopStorage.read();

  const algorithms = ref<DslAlgorithmDefinition[]>(persisted?.algorithms ?? []);
  const activeAlgorithmId = ref<string | null>(persisted?.activeAlgorithmId ?? null);

  const activeAlgorithm = ref<DslAlgorithmDefinition | null>(
    algorithms.value.find((a) => a.id === activeAlgorithmId.value) ?? null,
  );

  function createAlgorithm(): DslAlgorithmDefinition {
    const newAlgorithm = createDefaultAlgorithm();
    algorithms.value = [...algorithms.value, newAlgorithm];
    activeAlgorithmId.value = newAlgorithm.id;
    activeAlgorithm.value = newAlgorithm;
    return newAlgorithm;
  }

  function forkAlgorithm(parentId: string, name: string): DslAlgorithmDefinition | null {
    const parent = algorithms.value.find((a) => a.id === parentId);
    if (!parent) {
      return null;
    }

    // Ensure stateSizeBits is preserved/calculated for the fork
    let stateSizeBits = parent.stateSizeBits;
    if (stateSizeBits === undefined) {
      // Calculate from operations: count variables read as 'state' type
      const stateVarNames = new Set<string>();
      for (const op of parent.operations) {
        if (op.left?.type === 'state' && typeof op.left.value === 'string') {
          stateVarNames.add(op.left.value);
        }
        if (op.right?.type === 'state' && typeof op.right.value === 'string') {
          stateVarNames.add(op.right.value);
        }
      }
      const count = stateVarNames.size > 0 ? stateVarNames.size : parent.stateVariables.length;
      stateSizeBits = count * 32;
    }

    const forked: DslAlgorithmDefinition = {
      ...structuredClone(toRaw(parent)),
      id: crypto.randomUUID(),
      name,
      parentId: parent.id,
      stateSizeBits,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    algorithms.value = [...algorithms.value, forked];
    activeAlgorithmId.value = forked.id;
    activeAlgorithm.value = forked;
    return forked;
  }

  function updateAlgorithm(id: string, updates: Partial<DslAlgorithmDefinition>): void {
    const index = algorithms.value.findIndex((a) => a.id === id);
    if (index === -1) {
      return;
    }

    const existing = algorithms.value[index];
    if (!existing) {
      return;
    }

    const updated: DslAlgorithmDefinition = {
      ...existing,
      ...updates,
      updatedAt: Date.now(),
    };

    algorithms.value = [
      ...algorithms.value.slice(0, index),
      updated,
      ...algorithms.value.slice(index + 1),
    ];

    if (activeAlgorithmId.value === id) {
      activeAlgorithm.value = updated;
    }
  }

  function deleteAlgorithm(id: string): void {
    algorithms.value = algorithms.value.filter((a) => a.id !== id);
    if (activeAlgorithmId.value === id) {
      activeAlgorithmId.value = algorithms.value[0]?.id ?? null;
      activeAlgorithm.value = algorithms.value[0] ?? null;
    }
  }

  function setActiveAlgorithm(id: string | null): void {
    activeAlgorithmId.value = id;
    activeAlgorithm.value = id ? (algorithms.value.find((a) => a.id === id) ?? null) : null;
  }

  function addStateVariable(algorithmId: string, variable: DslStateVariable): void {
    const alg = algorithms.value.find((a) => a.id === algorithmId);
    if (!alg) {
      return;
    }
    updateAlgorithm(algorithmId, {
      stateVariables: [...alg.stateVariables, variable],
    });
  }

  function removeStateVariable(algorithmId: string, name: string): void {
    const alg = algorithms.value.find((a) => a.id === algorithmId);
    if (!alg) {
      return;
    }
    updateAlgorithm(algorithmId, {
      stateVariables: alg.stateVariables.filter((v) => v.name !== name),
    });
  }

  function addOperation(algorithmId: string, operation: Omit<DslOperation, 'id'>): void {
    const alg = algorithms.value.find((a) => a.id === algorithmId);
    if (!alg) {
      return;
    }
    updateAlgorithm(algorithmId, {
      operations: [...alg.operations, { ...operation, id: generateOperationId() }],
    });
  }

  function updateOperation(
    algorithmId: string,
    operationId: string,
    updates: Partial<DslOperation>,
  ): void {
    const alg = algorithms.value.find((a) => a.id === algorithmId);
    if (!alg) {
      return;
    }
    updateAlgorithm(algorithmId, {
      operations: alg.operations.map((op) => (op.id === operationId ? { ...op, ...updates } : op)),
    });
  }

  function removeOperation(algorithmId: string, operationId: string): void {
    const alg = algorithms.value.find((a) => a.id === algorithmId);
    if (!alg) {
      return;
    }
    updateAlgorithm(algorithmId, {
      operations: alg.operations.filter((op) => op.id !== operationId),
    });
  }

  function reorderOperations(algorithmId: string, fromIndex: number, toIndex: number): void {
    const alg = algorithms.value.find((a) => a.id === algorithmId);
    if (!alg) {
      return;
    }
    const ops = [...alg.operations];
    const [removed] = ops.splice(fromIndex, 1);
    if (removed) {
      ops.splice(toIndex, 0, removed);
      updateAlgorithm(algorithmId, { operations: ops });
    }
  }

  watch(
    [algorithms, activeAlgorithmId],
    ([algs, activeId]) => {
      const payload: PersistedWorkshopStateV1 = {
        schemaVersion: 1,
        algorithms: algs,
        activeAlgorithmId: activeId,
      };
      workshopStorage.write(payload);
    },
    { deep: true, immediate: true },
  );

  return {
    algorithms,
    activeAlgorithmId,
    activeAlgorithm,
    createAlgorithm,
    forkAlgorithm,
    updateAlgorithm,
    deleteAlgorithm,
    setActiveAlgorithm,
    addStateVariable,
    removeStateVariable,
    addOperation,
    updateOperation,
    removeOperation,
    reorderOperations,
  };
});
