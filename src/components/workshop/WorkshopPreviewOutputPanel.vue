<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  testSamples: readonly number[];
  testStepCount: number;
}>();

const lastValue = computed(() => {
  const last = props.testSamples[props.testSamples.length - 1];
  return typeof last === 'number' ? last : null;
});

const recentSamples = computed(() => {
  const samples = props.testSamples;
  const start = Math.max(0, samples.length - 10);
  const items = samples.slice(start).map((value, index) => ({
    index: start + index + 1,
    value,
  }));
  return items.reverse();
});
</script>

<template>
  <section class="panel">
    <h3 class="panel-title">{{ $t('workshop.output.title') }}</h3>

    <div class="space-y-2">
      <div class="flex justify-between text-sm">
        <span class="text-muted">{{ $t('workshop.output.lastValue') }}</span>
        <span class="font-mono text-body">
          {{ lastValue !== null ? lastValue.toFixed(10) : '—' }}
        </span>
      </div>

      <div class="divider" />

      <div class="max-h-48 overflow-y-auto font-mono text-xs">
        <div
          v-for="sample in recentSamples"
          :key="sample.index"
          class="flex justify-between py-0.5 text-muted"
        >
          <span>#{{ sample.index }}</span>
          <span class="text-body">{{ sample.value.toFixed(8) }}</span>
        </div>

        <div v-if="props.testSamples.length === 0" class="text-muted text-sm">
          {{ $t('workshop.output.noSamples') }}
        </div>
      </div>
    </div>
  </section>
</template>
