<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  value: number;
  previousValue?: number;
  label?: string;
  showHex?: boolean;
}>();

const bits = computed(() => {
  const v = props.value >>> 0;
  const pv = props.previousValue !== undefined ? props.previousValue >>> 0 : null;
  const result: { bit: number; changed: boolean; index: number }[] = [];

  for (let i = 31; i >= 0; i--) {
    const bit = (v >>> i) & 1;
    const prevBit = pv !== null ? (pv >>> i) & 1 : bit;
    result.push({
      bit,
      changed: pv !== null && bit !== prevBit,
      index: i,
    });
  }
  return result;
});

const hexValue = computed(() => {
  return '0x' + (props.value >>> 0).toString(16).padStart(8, '0').toUpperCase();
});

const decValue = computed(() => {
  return (props.value >>> 0).toLocaleString();
});
</script>

<template>
  <div class="space-y-1">
    <div v-if="label" class="text-xs font-medium text-muted uppercase tracking-wide">
      {{ label }}
    </div>
    <div class="flex flex-wrap gap-px font-mono text-[10px]">
      <span
        v-for="(b, idx) in bits"
        :key="idx"
        class="w-3.5 h-5 flex items-center justify-center rounded-sm transition-colors"
        :class="[
          b.bit ? 'bg-accent/80 text-white' : 'bg-surface-alt text-muted',
          b.changed ? 'ring-1 ring-amber-400' : '',
        ]"
        :title="`bit ${b.index}`"
      >
        {{ b.bit }}
      </span>
    </div>
    <div v-if="showHex !== false" class="flex gap-3 text-xs text-muted font-mono">
      <span>{{ hexValue }}</span>
      <span class="text-body">{{ decValue }}</span>
    </div>
  </div>
</template>
