<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { getAlgorithm } from '@/algorithms';

const props = withDefaults(
  defineProps<{
    algorithms?: string[];
  }>(),
  {
    algorithms: () => ['simple-counter', 'lcg', 'xorshift32', 'mulberry32'],
  },
);

const { t } = useI18n();

interface TestResult {
  mean: boolean | null;
  variance: boolean | null;
  chiSquare: boolean | null;
}

const results = ref<Record<string, TestResult>>({});
const isRunning = ref(false);
const hasRun = ref(false);

function runTest(algorithmId: string): TestResult {
  const alg = getAlgorithm(algorithmId);
  if (!alg) {
    return { mean: false, variance: false, chiSquare: false };
  }

  const samples: number[] = [];
  let state = alg.init(12345);

  for (let i = 0; i < 1000; i++) {
    const result = alg.next(state);
    samples.push(result.value);
    state = result.state;
  }

  // Mean test: should be close to 0.5
  const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
  const meanPass = Math.abs(mean - 0.5) < 0.05;

  // Variance test: should be close to 1/12 ≈ 0.0833
  const variance = samples.reduce((a, b) => a + (b - mean) ** 2, 0) / samples.length;
  const expectedVariance = 1 / 12;
  const variancePass = Math.abs(variance - expectedVariance) < 0.02;

  // Chi-square test (simplified): check distribution across 10 bins
  const bins = new Array(10).fill(0);
  for (const s of samples) {
    const bin = Math.min(9, Math.floor(s * 10));
    bins[bin]++;
  }
  const expected = samples.length / 10;
  const chiSquare = bins.reduce((a, b) => a + (b - expected) ** 2 / expected, 0);
  const chiSquarePass = chiSquare < 20; // Simplified threshold

  return { mean: meanPass, variance: variancePass, chiSquare: chiSquarePass };
}

async function runAllTests() {
  isRunning.value = true;
  results.value = {};

  for (const algoId of props.algorithms) {
    // Small delay to show progress
    await new Promise((resolve) => setTimeout(resolve, 100));
    results.value[algoId] = runTest(algoId);
  }

  isRunning.value = false;
  hasRun.value = true;
}

const algorithmNames = computed(() => {
  const names: Record<string, string> = {};
  for (const id of props.algorithms) {
    const alg = getAlgorithm(id);
    names[id] = alg?.meta?.nameKey ? t(alg.meta.nameKey) : id;
  }
  return names;
});
</script>

<template>
  <div class="flex flex-col items-center gap-6 w-full max-w-[600px]">
    <h3 class="text-lg font-semibold text-body">{{ t('learn.activities.qualityLab.title') }}</h3>
    <p class="text-base text-muted text-center">{{ t('learn.activities.qualityLab.intro') }}</p>

    <button class="btn-primary" :disabled="isRunning" @click="runAllTests">
      {{
        isRunning
          ? t('learn.activities.qualityLab.comparing')
          : t('learn.activities.qualityLab.runTests')
      }}
    </button>

    <div v-if="hasRun" class="grid grid-cols-2 gap-4 w-full">
      <div v-for="algo in algorithms" :key="algo" class="p-4 glass rounded-xl">
        <div class="text-base font-semibold text-primary mb-3 text-center">
          {{ algorithmNames[algo] }}
        </div>
        <div class="flex flex-col gap-2 text-sm">
          <div class="flex justify-between items-center">
            <span class="text-muted">{{ t('learn.activities.qualityLab.testMean') }}:</span>
            <span :class="results[algo]?.mean ? 'text-accent' : 'text-danger'">
              {{ results[algo]?.mean ? '✓' : '✗' }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-muted">{{ t('learn.activities.qualityLab.testVariance') }}:</span>
            <span :class="results[algo]?.variance ? 'text-accent' : 'text-danger'">
              {{ results[algo]?.variance ? '✓' : '✗' }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-muted">{{ t('learn.activities.qualityLab.testChiSquare') }}:</span>
            <span :class="results[algo]?.chiSquare ? 'text-accent' : 'text-danger'">
              {{ results[algo]?.chiSquare ? '✓' : '✗' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
