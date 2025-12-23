<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

interface TestResult {
  name: string;
  score: number;
  threshold: number;
}

const testResults = ref<TestResult[]>([
  { name: 'learn.microTeaching.testResults.uniformity', score: 0.92, threshold: 0.85 },
  { name: 'learn.microTeaching.testResults.correlation', score: 0.88, threshold: 0.8 },
  { name: 'learn.microTeaching.testResults.periodLength', score: 0.45, threshold: 0.7 },
  { name: 'learn.microTeaching.testResults.bitBalance', score: 0.95, threshold: 0.9 },
]);

function randomizeScores() {
  testResults.value = testResults.value.map((test) => ({
    ...test,
    score: Math.round((Math.random() * 0.5 + 0.4) * 100) / 100,
  }));
}

const passCount = computed(() => {
  return testResults.value.filter((t) => t.score >= t.threshold).length;
});

const overallStatus = computed(() => {
  const ratio = passCount.value / testResults.value.length;
  if (ratio >= 0.75) {
    return 'good';
  }
  if (ratio >= 0.5) {
    return 'warning';
  }
  return 'poor';
});
</script>

<template>
  <div class="flex flex-col gap-4 items-center w-full max-w-md">
    <!-- Overall status -->
    <div
      class="w-full p-3 rounded-lg text-center"
      :class="{
        'bg-green-500/10 border border-green-500/30': overallStatus === 'good',
        'bg-yellow-500/10 border border-yellow-500/30': overallStatus === 'warning',
        'bg-red-500/10 border border-red-500/30': overallStatus === 'poor',
      }"
    >
      <div
        class="text-lg font-bold"
        :class="{
          'text-green-500': overallStatus === 'good',
          'text-yellow-500': overallStatus === 'warning',
          'text-red-500': overallStatus === 'poor',
        }"
      >
        {{ passCount }}/{{ testResults.length }}
        {{ t('learn.microTeaching.testResults.testsPassed') }}
      </div>
      <div class="text-xs text-muted mt-1">
        {{ t('learn.microTeaching.testResults.overallQuality') }}:
        <span
          :class="{
            'text-green-500': overallStatus === 'good',
            'text-yellow-500': overallStatus === 'warning',
            'text-red-500': overallStatus === 'poor',
          }"
        >
          {{ t(`learn.microTeaching.testResults.${overallStatus}`) }}
        </span>
      </div>
    </div>

    <!-- Test results list -->
    <div class="w-full space-y-3">
      <div v-for="test in testResults" :key="test.name" class="p-3 bg-surface rounded-lg">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-body">{{ t(test.name) }}</span>
          <span
            class="text-sm font-mono font-bold"
            :class="test.score >= test.threshold ? 'text-green-500' : 'text-red-500'"
          >
            {{ test.score >= test.threshold ? '✓' : '✗' }}
          </span>
        </div>

        <!-- Progress bar -->
        <div class="relative h-4 bg-page rounded-full overflow-hidden">
          <!-- Threshold marker -->
          <div
            class="absolute h-full w-0.5 bg-yellow-500 z-10"
            :style="{ left: test.threshold * 100 + '%' }"
          />
          <!-- Score bar -->
          <div
            class="absolute h-full rounded-full transition-all duration-300"
            :class="test.score >= test.threshold ? 'bg-green-500' : 'bg-red-500'"
            :style="{ width: test.score * 100 + '%' }"
          />
        </div>

        <div class="flex justify-between mt-1 text-xs text-muted">
          <span
            >{{ t('learn.microTeaching.testResults.score') }}:
            {{ (test.score * 100).toFixed(0) }}%</span
          >
          <span
            >{{ t('learn.microTeaching.testResults.threshold') }}:
            {{ (test.threshold * 100).toFixed(0) }}%</span
          >
        </div>
      </div>
    </div>

    <!-- Controls -->
    <button class="btn-outline text-sm" @click="randomizeScores">
      {{ t('learn.microTeaching.testResults.simulateNewAlgorithm') }}
    </button>

    <!-- Insight -->
    <div class="text-xs text-center text-muted max-w-xs">
      {{ t('learn.microTeaching.testResults.insight') }}
    </div>
  </div>
</template>
