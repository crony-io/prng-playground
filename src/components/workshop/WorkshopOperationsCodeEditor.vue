<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { useToast } from '@/composables/useToast';
import { useWorkshopStore } from '@/stores/workshop';
import type {
  DslAlgorithmDefinition,
  DslOperation,
  DslOperand,
  DslStateVariable,
} from '@/types/dsl';
import { debounce } from '@/utils/debounce';
import {
  formatWorkshopOperationsCode,
  parseWorkshopOperationsCode,
  type WorkshopDslCodeParseError,
} from '@/utils/workshop-operations-code';

const props = defineProps<{
  algorithm: DslAlgorithmDefinition;
}>();

const { t } = useI18n();
const toast = useToast();
const workshopStore = useWorkshopStore();

const code = ref('');
const baselineCode = ref('');

const parseErrors = ref<WorkshopDslCodeParseError[]>([]);
const parsedOperations = ref<DslOperation[]>([]);

const isDirty = computed(() => code.value !== baselineCode.value);
const hasParseErrors = computed(() => parseErrors.value.length > 0);

function formatFromAlgorithm(): string {
  return formatWorkshopOperationsCode(props.algorithm.operations);
}

function syncFromAlgorithm(): void {
  const nextBaseline = formatFromAlgorithm();
  const shouldSyncCode = code.value === baselineCode.value;

  baselineCode.value = nextBaseline;
  if (shouldSyncCode) {
    code.value = nextBaseline;
  }
}

function getOperandVariableName(operand: DslOperand | undefined): string | null {
  if (!operand) {
    return null;
  }
  if (operand.type === 'const') {
    return null;
  }
  return String(operand.value);
}

function collectVariableNames(operations: readonly DslOperation[]): Set<string> {
  const names = new Set<string>();
  for (const op of operations) {
    names.add(op.target);

    const left = getOperandVariableName(op.left);
    if (left) {
      names.add(left);
    }

    const right = getOperandVariableName(op.right);
    if (right) {
      names.add(right);
    }
  }
  return names;
}

const variableNamesFromCode = computed(() => collectVariableNames(parsedOperations.value));

const missingStateVariables = computed(() => {
  const existing = new Set(props.algorithm.stateVariables.map((v) => v.name));
  return Array.from(variableNamesFromCode.value).filter((name) => !existing.has(name));
});

const hasOperations = computed(() => parsedOperations.value.length > 0);
const canApply = computed(() => isDirty.value && !hasParseErrors.value && hasOperations.value);

function parseNow(): void {
  const result = parseWorkshopOperationsCode(code.value);
  parsedOperations.value = result.operations;
  parseErrors.value = result.errors;
}

const parseDebounced = debounce(parseNow, 150);

watch(
  () => code.value,
  () => {
    parseDebounced();
  },
  { immediate: true },
);

watch(
  () => [props.algorithm.id, props.algorithm.updatedAt] as const,
  (next, prev) => {
    const [nextId] = next;
    const [prevId] = prev ?? [];

    const nextBaseline = formatFromAlgorithm();

    if (!prevId || nextId !== prevId) {
      baselineCode.value = nextBaseline;
      code.value = nextBaseline;
      return;
    }

    syncFromAlgorithm();
  },
  { immediate: true },
);

function getParseErrorMessage(error: WorkshopDslCodeParseError): string {
  const details = error.details ?? {};

  switch (error.code) {
    case 'invalid_statement':
      return t('workshop.codeEditor.errors.invalid_statement');
    case 'invalid_target':
      return t('workshop.codeEditor.errors.invalid_target', details);
    case 'invalid_expression':
      return t('workshop.codeEditor.errors.invalid_expression');
    case 'invalid_operand':
      return t('workshop.codeEditor.errors.invalid_operand', details);
    case 'invalid_number':
      return t('workshop.codeEditor.errors.invalid_number', details);
    case 'amount_must_be_number':
      return t('workshop.codeEditor.errors.amount_must_be_number', details);
    case 'amount_out_of_range':
      return t('workshop.codeEditor.errors.amount_out_of_range', details);
    case 'unsupported_operator':
      return t('workshop.codeEditor.errors.unsupported_operator', details);
    case 'unsupported_function':
      return t('workshop.codeEditor.errors.unsupported_function', details);
    default:
      return t('workshop.codeEditor.errors.unknown');
  }
}

const parseErrorItems = computed(() => {
  return parseErrors.value.map((error) => {
    return {
      key: `${error.line}:${error.column}:${error.code}`,
      label: t('workshop.codeEditor.errorAt', {
        line: error.line,
        column: error.column,
        message: getParseErrorMessage(error),
      }),
    };
  });
});

function handleFormat(): void {
  parseNow();
  if (hasParseErrors.value) {
    toast.error(t('workshop.codeEditor.toast.fixErrorsBeforeFormat'));
    return;
  }

  code.value = formatWorkshopOperationsCode(parsedOperations.value);
}

function handleRevert(): void {
  code.value = baselineCode.value;
  parseNow();
}

function handleApply(): void {
  parseNow();
  if (hasParseErrors.value) {
    toast.error(t('workshop.codeEditor.toast.fixErrorsBeforeApply'));
    return;
  }

  if (!hasOperations.value) {
    toast.error(t('workshop.codeEditor.toast.needOneOperation'));
    return;
  }

  const updates: Partial<DslAlgorithmDefinition> = {
    operations: parsedOperations.value,
  };

  if (missingStateVariables.value.length > 0) {
    const additions: DslStateVariable[] = missingStateVariables.value.map((name) => ({
      name,
      initialValue: 0,
    }));
    updates.stateVariables = [...props.algorithm.stateVariables, ...additions];
  }

  workshopStore.updateAlgorithm(props.algorithm.id, updates);
  baselineCode.value = formatWorkshopOperationsCode(parsedOperations.value);
  code.value = baselineCode.value;

  toast.success(t('workshop.codeEditor.toast.applied'));
}
</script>

<template>
  <div class="space-y-2">
    <label class="block text-xs font-medium text-muted">
      {{ $t('workshop.codeEditor.label') }}
    </label>

    <textarea
      v-model="code"
      class="w-full min-h-56 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-mono text-body focus:outline-none focus:ring-2 focus:ring-accent"
      spellcheck="false"
      :placeholder="$t('workshop.codeEditor.placeholder')"
    />

    <div class="flex items-center justify-between gap-2 flex-wrap">
      <div class="text-xs text-muted">
        <template v-if="missingStateVariables.length > 0">
          {{ $t('workshop.codeEditor.newVariables', { vars: missingStateVariables.join(', ') }) }}
        </template>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="btn-outline text-xs px-2 py-1"
          :disabled="hasParseErrors"
          @click="handleFormat"
        >
          {{ $t('workshop.codeEditor.format') }}
        </button>

        <button
          type="button"
          class="btn-ghost text-xs px-2 py-1"
          :disabled="!isDirty"
          @click="handleRevert"
        >
          {{ $t('workshop.codeEditor.revert') }}
        </button>

        <button
          type="button"
          class="btn-primary text-xs px-3 py-1"
          :disabled="!canApply"
          @click="handleApply"
        >
          {{ $t('workshop.codeEditor.apply') }}
        </button>
      </div>
    </div>

    <div
      v-if="parseErrorItems.length > 0"
      class="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-700 dark:text-red-300"
    >
      <ul class="list-disc list-inside">
        <li v-for="item in parseErrorItems" :key="item.key">{{ item.label }}</li>
      </ul>
    </div>
  </div>
</template>
