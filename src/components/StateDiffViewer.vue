<script setup lang="ts">
import { computed } from 'vue';
import BitVisualization from '@/components/BitVisualization.vue';

const props = defineProps<{
  currentState: Record<string, number> | null;
  previousState: Record<string, number> | null;
}>();

const stateEntries = computed(() => {
  if (!props.currentState) {
    return [];
  }

  return Object.entries(props.currentState).map(([key, value]) => {
    const prevValue = props.previousState?.[key];
    return {
      key,
      value: value >>> 0,
      previousValue: prevValue !== undefined ? prevValue >>> 0 : undefined,
      changed: prevValue !== undefined && prevValue >>> 0 !== value >>> 0,
    };
  });
});
</script>

<template>
  <div class="space-y-3">
    <div v-if="stateEntries.length === 0" class="text-sm text-muted">
      {{ $t('workshop.state.empty') }}
    </div>
    <div v-for="entry in stateEntries" :key="entry.key" class="space-y-1">
      <div class="flex items-center gap-2">
        <span
          class="text-xs font-medium"
          :class="entry.changed ? 'text-amber-600 dark:text-amber-400' : 'text-muted'"
        >
          {{ entry.key }}
        </span>
        <span
          v-if="entry.changed"
          class="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300"
        >
          {{ $t('workshop.state.changed') }}
        </span>
      </div>
      <BitVisualization :value="entry.value" :previous-value="entry.previousValue" />
    </div>
  </div>
</template>
