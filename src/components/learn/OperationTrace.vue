<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineProps<{
  steps: {
    operation: string;
    before: number;
    after: number;
    description?: string;
  }[];
  showBinary?: boolean;
}>();

const { t } = useI18n();

function formatBinary(value: number): string {
  return value.toString(2).padStart(32, '0');
}

function formatValue(value: number): string {
  if (value > 1000000) {
    return value.toExponential(2);
  }
  return value.toLocaleString();
}
</script>

<template>
  <div class="flex flex-col gap-2 w-full max-w-[600px]">
    <h4 class="text-base font-semibold text-body mb-2">
      {{ t('learn.operationTrace.title') }}
    </h4>

    <div v-for="(step, idx) in steps" :key="idx" class="p-3 glass rounded-lg">
      <div class="flex items-center gap-3 flex-wrap">
        <span class="text-sm text-muted">{{ idx + 1 }}.</span>
        <code
          class="px-2 py-1 bg-primary/10 dark:bg-primary/20 rounded text-primary font-mono text-sm"
        >
          {{ step.operation }}
        </code>
      </div>

      <div class="flex items-center gap-2 mt-2 text-sm font-mono">
        <span class="text-muted">{{ formatValue(step.before) }}</span>
        <span class="text-primary">→</span>
        <span class="text-accent font-bold">{{ formatValue(step.after) }}</span>
      </div>

      <div v-if="showBinary" class="mt-2 text-xs font-mono text-muted overflow-x-auto">
        <div>{{ formatBinary(step.before) }}</div>
        <div class="text-accent">{{ formatBinary(step.after) }}</div>
      </div>

      <p v-if="step.description" class="text-xs text-muted mt-2">
        {{ step.description }}
      </p>
    </div>
  </div>
</template>
