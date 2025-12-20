<script setup lang="ts">
import { computed } from 'vue';

import { runQualityTests, type QualityTestResults } from '@/utils/quality-tests';

const props = defineProps<{
  testSamples: readonly number[];
}>();

const qualityTestResults = computed<QualityTestResults | null>(() => {
  if (props.testSamples.length < 1000) {
    return null;
  }
  return runQualityTests(Array.from(props.testSamples));
});

const overallTestStatus = computed<'pass' | 'warn' | 'fail'>(() => {
  if (!qualityTestResults.value) {
    return 'pass';
  }
  const results = qualityTestResults.value;
  const statuses = [
    results.mean.status,
    results.variance.status,
    results.chiSquare.status,
    ...results.bitBias.map((b) => b.status),
  ];
  if (statuses.includes('fail')) {
    return 'fail';
  }
  if (statuses.includes('warn')) {
    return 'warn';
  }
  return 'pass';
});
</script>

<template>
  <section class="panel">
    <div class="flex items-center justify-between mb-4">
      <h3 class="panel-title mb-0">{{ $t('workshop.autoTests.title') }}</h3>
      <span
        v-if="qualityTestResults"
        class="w-2 h-2 inline-block rounded-full"
        :class="
          overallTestStatus === 'pass'
            ? 'bg-emerald-500'
            : overallTestStatus === 'warn'
              ? 'bg-amber-500'
              : 'bg-red-500'
        "
      />
    </div>

    <div v-if="props.testSamples.length < 1000" class="text-sm text-muted py-4 text-center">
      {{ $t('workshop.autoTests.needSamples') }}
    </div>

    <div v-else-if="qualityTestResults" class="space-y-2">
      <div
        v-for="test in [
          {
            key: 'mean',
            value: qualityTestResults.mean.value.toFixed(4),
            status: qualityTestResults.mean.status,
          },
          {
            key: 'variance',
            value: qualityTestResults.variance.value.toFixed(4),
            status: qualityTestResults.variance.status,
          },
          {
            key: 'chiSquare',
            value: qualityTestResults.chiSquare.value.toFixed(2),
            status: qualityTestResults.chiSquare.status,
          },
        ]"
        :key="test.key"
        class="flex items-center justify-between text-xs"
      >
        <span class="text-muted">{{ $t(`workshop.autoTests.${test.key}`) }}</span>
        <div class="flex items-center gap-2">
          <span class="font-mono">{{ test.value }}</span>
          <span
            class="text-xs px-1.5 py-0.5 rounded"
            :class="{
              'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300': test.status === 'pass',
              'bg-amber-500/20 text-amber-700 dark:text-amber-300': test.status === 'warn',
              'bg-red-500/20 text-red-700 dark:text-red-300': test.status === 'fail',
            }"
          >
            {{ $t(`workshop.autoTests.${test.status}`) }}
          </span>
        </div>
      </div>

      <div class="space-y-1 pt-1">
        <span class="text-xs text-muted">{{ $t('workshop.autoTests.bitBias') }}</span>
        <div class="flex flex-wrap gap-1">
          <span
            v-for="bit in qualityTestResults.bitBias"
            :key="bit.name"
            class="text-xs px-1.5 py-0.5 rounded font-mono"
            :class="{
              'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300': bit.status === 'pass',
              'bg-amber-500/20 text-amber-700 dark:text-amber-300': bit.status === 'warn',
              'bg-red-500/20 text-red-700 dark:text-red-300': bit.status === 'fail',
            }"
            :title="`${bit.name}: ${bit.value.toFixed(3)}`"
          >
            {{ bit.name }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
