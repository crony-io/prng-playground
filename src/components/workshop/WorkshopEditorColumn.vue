<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import AlgorithmTagChips from '@/components/ui/AlgorithmTagChips.vue';
import OptionButtonGroup from '@/components/ui/OptionButtonGroup.vue';
import OperationDocsPanel from '@/components/workshop/OperationDocsPanel.vue';
import OperationRow from '@/components/workshop/OperationRow.vue';
import WorkshopOperationsCodeEditor from '@/components/workshop/WorkshopOperationsCodeEditor.vue';
import { useWorkshopStore } from '@/stores/workshop';
import type { DslAlgorithmDefinition, DslOperand, DslOperationType } from '@/types/dsl';
import { calculateStateSizeBits } from '@/types/dsl';
import type { BuiltinTemplate } from '@/utils/builtin-to-dsl';
import { BUILTIN_TEMPLATES } from '@/utils/builtin-to-dsl';

const { t } = useI18n();
const workshopStore = useWorkshopStore();

const activeAlgorithm = computed(() => workshopStore.activeAlgorithm);

type OperationEditorMode = 'visual' | 'code';
const operationEditorMode = ref<OperationEditorMode>('visual');
const showHelpPanel = ref(false);

const operationEditorModeOptions = computed(() => {
  return [
    { value: 'visual' as const, label: t('workshop.editorModes.visual') },
    { value: 'code' as const, label: t('workshop.editorModes.code') },
  ];
});

function handleOperationEditorModeChange(value: string | number): void {
  if (value === 'visual' || value === 'code') {
    operationEditorMode.value = value;
  }
}

function getParentTemplate(parentId: string | undefined): BuiltinTemplate | null {
  if (!parentId) {
    return null;
  }
  return BUILTIN_TEMPLATES.find((tpl) => tpl.id === parentId) ?? null;
}

function getParentName(parentId: string): string {
  const parent = workshopStore.algorithms.find((a) => a.id === parentId);
  if (parent?.name) {
    return parent.name;
  }

  const template = getParentTemplate(parentId);
  if (template) {
    return t(template.nameKey);
  }

  return t('common.unknown');
}

function getAlgorithmStateBits(alg: DslAlgorithmDefinition): number {
  // Check stored value first
  if (alg.stateSizeBits !== undefined) {
    return alg.stateSizeBits;
  }

  // Traverse parent chain to find template stateSizeBits
  let currentParentId = alg.parentId;
  while (currentParentId) {
    const template = getParentTemplate(currentParentId);
    if (template) {
      return template.stateSizeBits;
    }
    const parentAlg = workshopStore.algorithms.find((a) => a.id === currentParentId);
    if (!parentAlg) {
      break;
    }
    if (parentAlg.stateSizeBits !== undefined) {
      return parentAlg.stateSizeBits;
    }
    currentParentId = parentAlg.parentId;
  }

  // Fall back to calculation
  return calculateStateSizeBits(alg);
}

function handleForkAlgorithm(alg: DslAlgorithmDefinition): void {
  const forkedName = t('workshop.templates.defaultForkName', {
    name: alg.name || t('workshop.untitled'),
  });
  workshopStore.forkAlgorithm(alg.id, forkedName);
}

function isShiftOrRotate(op: DslOperationType): boolean {
  return ['shl', 'shr', 'ushr', 'rotl', 'rotr'].includes(op);
}

function handleDelete(id: string): void {
  workshopStore.deleteAlgorithm(id);
}

function handleNameChange(e: Event): void {
  const target = e.target as HTMLInputElement;
  if (activeAlgorithm.value) {
    workshopStore.updateAlgorithm(activeAlgorithm.value.id, { name: target.value });
  }
}

function handleDescriptionChange(e: Event): void {
  const target = e.target as HTMLTextAreaElement;
  if (activeAlgorithm.value) {
    workshopStore.updateAlgorithm(activeAlgorithm.value.id, { description: target.value });
  }
}

function handleAddStateVariable(): void {
  if (!activeAlgorithm.value) {
    return;
  }
  const existingNames = new Set(activeAlgorithm.value.stateVariables.map((v) => v.name));
  let name = 's';
  let i = 1;
  while (existingNames.has(name)) {
    name = `s${i++}`;
  }
  workshopStore.addStateVariable(activeAlgorithm.value.id, { name, initialValue: 0 });
}

function handleRemoveStateVariable(name: string): void {
  if (activeAlgorithm.value) {
    workshopStore.removeStateVariable(activeAlgorithm.value.id, name);
  }
}

function handleStateVariableNameChange(index: number, e: Event): void {
  const target = e.target as HTMLInputElement;
  if (!activeAlgorithm.value) {
    return;
  }
  const variables = [...activeAlgorithm.value.stateVariables];
  const v = variables[index];
  if (v) {
    variables[index] = { ...v, name: target.value };
    workshopStore.updateAlgorithm(activeAlgorithm.value.id, { stateVariables: variables });
  }
}

function handleStateVariableValueChange(index: number, e: Event): void {
  const target = e.target as HTMLInputElement;
  if (!activeAlgorithm.value) {
    return;
  }
  const variables = [...activeAlgorithm.value.stateVariables];
  const v = variables[index];
  if (v) {
    variables[index] = { ...v, initialValue: parseInt(target.value, 10) || 0 };
    workshopStore.updateAlgorithm(activeAlgorithm.value.id, { stateVariables: variables });
  }
}

function handleOutputVariableChange(e: Event): void {
  const target = e.target as HTMLSelectElement;
  if (activeAlgorithm.value) {
    workshopStore.updateAlgorithm(activeAlgorithm.value.id, { outputVariable: target.value });
  }
}

function handleAddOperation(): void {
  if (!activeAlgorithm.value) {
    return;
  }
  const firstVar = activeAlgorithm.value.stateVariables[0]?.name ?? 's';
  workshopStore.addOperation(activeAlgorithm.value.id, {
    op: 'add',
    target: firstVar,
    left: { type: 'state', value: firstVar },
    right: { type: 'const', value: 1 },
  });
}

function handleRemoveOperation(operationId: string): void {
  if (activeAlgorithm.value) {
    workshopStore.removeOperation(activeAlgorithm.value.id, operationId);
  }
}

function handleMoveOperation(fromIndex: number, toIndex: number): void {
  if (activeAlgorithm.value) {
    workshopStore.reorderOperations(activeAlgorithm.value.id, fromIndex, toIndex);
  }
}

function handleOperationTargetChange(operationId: string, value: string): void {
  if (activeAlgorithm.value) {
    workshopStore.updateOperation(activeAlgorithm.value.id, operationId, { target: value });
  }
}

function handleOperationTypeChange(operationId: string, value: DslOperationType): void {
  if (activeAlgorithm.value) {
    const updates: Partial<DslAlgorithmDefinition['operations'][0]> = { op: value };

    if (isShiftOrRotate(value)) {
      updates.amount = 1;
    }

    workshopStore.updateOperation(activeAlgorithm.value.id, operationId, updates);
  }
}

function handleOperationLeftChange(operationId: string, value: DslOperand): void {
  if (activeAlgorithm.value) {
    workshopStore.updateOperation(activeAlgorithm.value.id, operationId, { left: value });
  }
}

function handleOperationRightChange(operationId: string, value: DslOperand): void {
  if (activeAlgorithm.value) {
    workshopStore.updateOperation(activeAlgorithm.value.id, operationId, { right: value });
  }
}

function handleOperationAmountChange(operationId: string, value: number): void {
  if (activeAlgorithm.value) {
    workshopStore.updateOperation(activeAlgorithm.value.id, operationId, { amount: value });
  }
}
</script>

<template>
  <div class="flex flex-col gap-3 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
    <section class="panel">
      <h3 class="panel-title">{{ $t('workshop.algorithms') }}</h3>
      <div v-if="workshopStore.algorithms.length === 0" class="text-sm text-muted py-4">
        {{ $t('workshop.noAlgorithms') }}
      </div>
      <div v-else class="flex flex-col gap-2">
        <button
          v-for="alg in workshopStore.algorithms"
          :key="alg.id"
          type="button"
          class="glass-card p-3 text-left transition hover:ring-2 hover:ring-accent"
          :class="{ 'ring-2 ring-accent': workshopStore.activeAlgorithmId === alg.id }"
          @click="workshopStore.setActiveAlgorithm(alg.id)"
        >
          <div class="flex items-center justify-between gap-2">
            <span class="font-medium text-body text-sm truncate">
              {{ alg.name || $t('workshop.untitled') }}
            </span>
            <div class="flex items-center gap-1 shrink-0">
              <span class="text-xs text-muted">{{ getAlgorithmStateBits(alg) }}b</span>
              <button
                type="button"
                class="text-muted hover:text-accent p-1"
                :title="$t('workshop.fork')"
                @click.stop="handleForkAlgorithm(alg)"
              >
                ⑂
              </button>
              <button
                type="button"
                class="text-muted hover:text-red-500 p-1"
                :title="$t('common.delete')"
                @click.stop="handleDelete(alg.id)"
              >
                ✕
              </button>
            </div>
          </div>
          <div class="mt-1 flex items-center justify-between gap-2">
            <AlgorithmTagChips
              v-if="getParentTemplate(alg.parentId)?.tags"
              :tags="getParentTemplate(alg.parentId)!.tags"
              size="xs"
            />
            <span v-else class="text-[9px] text-muted italic">{{ $t('workshop.custom') }}</span>
          </div>
          <div v-if="alg.parentId" class="text-[10px] text-muted mt-1">
            {{ $t('workshop.forkedFrom') }}: {{ getParentName(alg.parentId) }}
          </div>
        </button>
      </div>
    </section>

    <section v-if="activeAlgorithm" class="panel">
      <h3 class="panel-title">{{ $t('workshop.editor') }}</h3>

      <div class="space-y-3">
        <div>
          <label class="block text-sm font-medium text-body mb-1">
            {{ $t('workshop.name') }}
          </label>
          <input
            :value="activeAlgorithm.name"
            type="text"
            class="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-body focus:outline-none focus:ring-2 focus:ring-accent"
            :placeholder="$t('workshop.namePlaceholder')"
            @input="handleNameChange"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-body mb-1">
            {{ $t('workshop.algorithmDescription') }}
          </label>
          <textarea
            :value="activeAlgorithm.description"
            rows="2"
            class="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-body focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            :placeholder="$t('workshop.descriptionPlaceholder')"
            @input="handleDescriptionChange"
          />
        </div>
      </div>
    </section>

    <section v-if="activeAlgorithm" class="panel">
      <div class="flex items-center justify-between mb-3">
        <h3 class="panel-title mb-0">{{ $t('workshop.stateVariables') }}</h3>
        <button type="button" class="btn-ghost text-sm" @click="handleAddStateVariable">
          + {{ $t('workshop.addVariable') }}
        </button>
      </div>

      <div class="space-y-2">
        <div
          v-for="(variable, index) in activeAlgorithm.stateVariables"
          :key="index"
          class="flex items-center gap-2"
        >
          <input
            :value="variable.name"
            type="text"
            class="w-20 rounded border border-border bg-surface px-2 py-1 text-sm font-mono"
            @input="(e) => handleStateVariableNameChange(index, e)"
          />
          <span class="text-muted">=</span>
          <input
            :value="variable.initialValue"
            type="number"
            class="w-32 rounded border border-border bg-surface px-2 py-1 text-sm font-mono"
            @input="(e) => handleStateVariableValueChange(index, e)"
          />
          <button
            v-if="activeAlgorithm.stateVariables.length > 1"
            type="button"
            class="text-muted hover:text-red-500 p-1"
            @click="handleRemoveStateVariable(variable.name)"
          >
            ✕
          </button>
        </div>
      </div>

      <div class="mt-3">
        <label class="block text-xs font-medium text-muted mb-1">
          {{ $t('workshop.outputVariable') }}
        </label>
        <select
          :value="activeAlgorithm.outputVariable"
          class="rounded border border-border bg-surface px-2 py-1 text-sm font-mono"
          @change="handleOutputVariableChange"
        >
          <option
            v-for="variable in activeAlgorithm.stateVariables"
            :key="variable.name"
            :value="variable.name"
          >
            {{ variable.name }}
          </option>
        </select>
      </div>
    </section>

    <section v-if="activeAlgorithm" class="panel">
      <div class="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <h3 class="panel-title mb-0">{{ $t('workshop.operations') }}</h3>

        <div class="flex items-center gap-2">
          <OptionButtonGroup
            :options="operationEditorModeOptions"
            :model-value="operationEditorMode"
            container-class="flex gap-1"
            button-class="btn-ghost px-2 py-1 text-xs"
            active-button-class="ring-2 ring-accent"
            @update:modelValue="handleOperationEditorModeChange"
          />

          <button
            v-if="operationEditorMode === 'visual'"
            type="button"
            class="btn-ghost text-sm"
            @click="handleAddOperation"
          >
            + {{ $t('workshop.addOperation') }}
          </button>
        </div>
      </div>

      <WorkshopOperationsCodeEditor
        v-if="operationEditorMode === 'code'"
        :algorithm="activeAlgorithm"
      />

      <div v-else class="space-y-2">
        <OperationRow
          v-for="(operation, index) in activeAlgorithm.operations"
          :key="operation.id"
          :operation="operation"
          :index="index"
          :variables="activeAlgorithm.stateVariables"
          :total-operations="activeAlgorithm.operations.length"
          @update:target="(v) => handleOperationTargetChange(operation.id, v)"
          @update:op="(v) => handleOperationTypeChange(operation.id, v)"
          @update:left="(v) => handleOperationLeftChange(operation.id, v)"
          @update:right="(v) => handleOperationRightChange(operation.id, v)"
          @update:amount="(v) => handleOperationAmountChange(operation.id, v)"
          @move="handleMoveOperation"
          @remove="handleRemoveOperation(operation.id)"
        />
      </div>

      <div class="mt-3 pt-3 border-t border-border/50">
        <button
          type="button"
          class="btn-ghost text-sm flex items-center gap-1 w-full justify-center"
          @click="showHelpPanel = !showHelpPanel"
        >
          <span>📚</span>
          {{ showHelpPanel ? $t('workshop.hideHelp') : $t('workshop.showHelp') }}
        </button>
      </div>

      <OperationDocsPanel v-if="showHelpPanel" class="mt-3" />
    </section>
  </div>
</template>
