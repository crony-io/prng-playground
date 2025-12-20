<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { DslOperand, DslStateVariable } from '@/types/dsl';

interface Props {
  modelValue: DslOperand | undefined;
  variables: DslStateVariable[];
  showCustomConst?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showCustomConst: true,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: DslOperand): void;
}>();

const { t } = useI18n();

/**
 * Normalizes operand value for select matching.
 * Treats 'temp' as 'state' since all temps become state vars after fork.
 */
function getSelectValue(operand: DslOperand | undefined): string {
  if (!operand) {
    return props.variables[0] ? `state:${props.variables[0].name}` : 'state:s';
  }

  if (operand.type === 'const') {
    const numValue = typeof operand.value === 'number' ? operand.value : 0;
    if (numValue === 0) {
      return 'const:0';
    }
    if (numValue === 1) {
      return 'const:1';
    }
    return 'const:custom';
  }

  // Normalize temp to state for matching - all temps are state vars after fork
  const varName = typeof operand.value === 'string' ? operand.value : String(operand.value);
  return `state:${varName}`;
}

const selectedValue = computed(() => getSelectValue(props.modelValue));

const isCustomConst = computed(
  () => props.modelValue?.type === 'const' && ![0, 1].includes(props.modelValue.value as number),
);

function handleSelectChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  const value = target.value;
  const [type, val] = value.split(':');

  if (type === 'const') {
    if (val === 'custom') {
      emit('update:modelValue', { type: 'const', value: props.modelValue?.value ?? 0 });
    } else {
      emit('update:modelValue', { type: 'const', value: parseInt(val ?? '0', 10) });
    }
  } else {
    emit('update:modelValue', { type: 'state', value: val ?? 's' });
  }
}

function handleConstInput(event: Event): void {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', { type: 'const', value: parseInt(target.value, 10) || 0 });
}
</script>

<template>
  <div class="flex items-center gap-1">
    <select
      :value="selectedValue"
      class="min-w-0 shrink rounded border border-border bg-surface px-2 py-1 text-sm font-mono"
      @change="handleSelectChange"
    >
      <option v-for="variable in variables" :key="variable.name" :value="`state:${variable.name}`">
        {{ variable.name }}
      </option>
      <option value="const:0">0</option>
      <option value="const:1">1</option>
      <option v-if="showCustomConst" value="const:custom">
        {{ t('workshop.customConst') }}
      </option>
    </select>
    <input
      v-if="showCustomConst && isCustomConst"
      :value="modelValue?.value ?? 0"
      type="number"
      class="w-28 min-w-0 shrink rounded border border-border bg-surface px-2 py-1 text-sm font-mono"
      @input="handleConstInput"
    />
  </div>
</template>
