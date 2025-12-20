<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  currentStep: number;
  totalSteps: number;
}>();

const progressPercent = computed(() => {
  if (props.totalSteps === 0) {
    return 0;
  }
  return ((props.currentStep + 1) / props.totalSteps) * 100;
});
</script>

<template>
  <div class="flex items-center gap-3">
    <div class="flex-1 h-2 bg-surface rounded overflow-hidden">
      <div
        class="h-full bg-accent rounded transition-all duration-300"
        :style="{ width: `${progressPercent}%` }"
      />
    </div>
    <span class="text-sm text-muted whitespace-nowrap"
      >{{ currentStep + 1 }} / {{ totalSteps }}</span
    >
  </div>
</template>
