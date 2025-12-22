<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import OperandSelect from '@/components/workshop/OperandSelect.vue';
import type { DslOperation, DslOperand, DslOperationType, DslStateVariable } from '@/types/dsl';
import { EDITOR_OPERATIONS, getOperationMeta } from '@/utils/operation-docs';

interface Props {
  operation: DslOperation;
  index: number;
  variables: DslStateVariable[];
  totalOperations: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:target', value: string): void;
  (e: 'update:op', value: DslOperationType): void;
  (e: 'update:left', value: DslOperand): void;
  (e: 'update:right', value: DslOperand): void;
  (e: 'update:amount', value: number): void;
  (e: 'move', fromIndex: number, toIndex: number): void;
  (e: 'remove'): void;
}>();

const { t } = useI18n();

function needsRightOperand(op: DslOperationType): boolean {
  return !['not', 'assign'].includes(op);
}

function isShiftOrRotate(op: DslOperationType): boolean {
  return ['shl', 'shr', 'ushr', 'rotl', 'rotr'].includes(op);
}

function getOperationTooltip(op: DslOperationType): string {
  const meta = getOperationMeta(op);
  const brief = t(`${meta.i18nKey}.brief`);
  const example = t(`${meta.i18nKey}.example`);
  return `${op}: ${brief}\n\n${t('common.example')}: ${example}`;
}

const showMoveUp = computed(() => props.index > 0);
const showMoveDown = computed(() => props.index < props.totalOperations - 1);
const showRemove = computed(() => props.totalOperations > 1);

function handleTargetChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  emit('update:target', target.value);
}

function handleOpChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  emit('update:op', target.value as DslOperationType);
}

function handleLeftChange(value: DslOperand): void {
  emit('update:left', value);
}

function handleRightChange(value: DslOperand): void {
  emit('update:right', value);
}

function handleAmountChange(event: Event): void {
  const target = event.target as HTMLInputElement;
  emit('update:amount', parseInt(target.value, 10) || 0);
}
</script>

<template>
  <div class="glass-card p-3">
    <div class="flex flex-wrap items-center gap-2 text-sm">
      <span class="text-muted w-6 shrink-0">{{ index + 1 }}.</span>

      <!-- Target variable -->
      <select
        :value="operation.target"
        class="min-w-0 shrink rounded border border-border bg-surface px-2 py-1 text-sm font-mono"
        @change="handleTargetChange"
      >
        <option v-for="variable in variables" :key="variable.name" :value="variable.name">
          {{ variable.name }}
        </option>
      </select>

      <span class="text-muted">=</span>

      <!-- Left operand -->
      <OperandSelect
        :model-value="operation.left"
        :variables="variables"
        :show-custom-const="false"
        @update:model-value="handleLeftChange"
      />

      <!-- Operation type -->
      <select
        :value="operation.op"
        class="min-w-0 shrink rounded border border-border bg-surface px-2 py-1 text-sm font-mono"
        :title="getOperationTooltip(operation.op)"
        @change="handleOpChange"
      >
        <option
          v-for="op in EDITOR_OPERATIONS"
          :key="op"
          :value="op"
          :title="t(`${getOperationMeta(op).i18nKey}.brief`)"
        >
          {{ getOperationMeta(op).symbol }} {{ op }}
        </option>
      </select>

      <!-- Right operand (shift amount or operand) -->
      <template v-if="needsRightOperand(operation.op)">
        <input
          v-if="isShiftOrRotate(operation.op)"
          :value="operation.amount ?? 0"
          type="number"
          min="0"
          max="31"
          class="w-16 min-w-0 shrink rounded border border-border bg-surface px-2 py-1 text-sm font-mono"
          @input="handleAmountChange"
        />
        <OperandSelect
          v-else
          :model-value="operation.right"
          :variables="variables"
          :show-custom-const="true"
          @update:model-value="handleRightChange"
        />
      </template>

      <!-- Action buttons -->
      <div class="flex items-center gap-1 ml-auto shrink-0">
        <button
          v-if="showMoveUp"
          type="button"
          class="text-muted hover:text-accent p-1"
          :title="t('workshop.moveUp')"
          @click="emit('move', index, index - 1)"
        >
          ↑
        </button>
        <button
          v-if="showMoveDown"
          type="button"
          class="text-muted hover:text-accent p-1"
          :title="t('workshop.moveDown')"
          @click="emit('move', index, index + 1)"
        >
          ↓
        </button>
        <button
          v-if="showRemove"
          type="button"
          class="text-muted hover:text-red-500 p-1"
          @click="emit('remove')"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>
