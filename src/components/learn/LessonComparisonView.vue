<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import type { PrngSample } from '@/composables/usePrngRunner';
import CorrelationPlot from '@/components/CorrelationPlot.vue';
import TimeSeriesChart from '@/components/TimeSeriesChart.vue';
import DistributionHistogram from '@/components/DistributionHistogram.vue';

const props = withDefaults(
  defineProps<{
    algorithms: string[];
    showCorrelation?: boolean;
    showTimeSeries?: boolean;
    showHistogram?: boolean;
    showQualityTests?: boolean;
    sampleCount?: number;
  }>(),
  {
    showCorrelation: true,
    showTimeSeries: false,
    showHistogram: true,
    showQualityTests: false,
    sampleCount: 100,
  },
);

const { t } = useI18n();

const algorithmSamples = ref<Record<string, PrngSample[]>>({});

function generateSamples(algorithmId: string): PrngSample[] {
  const samples: PrngSample[] = [];
  let state = 12345;

  for (let i = 0; i < props.sampleCount; i++) {
    let value: number;

    switch (algorithmId) {
      case 'simple-counter':
        state = (state + 1) % 256;
        value = state / 256;
        break;
      case 'lcg':
        state = (state * 48271) % 2147483647;
        value = state / 2147483647;
        break;
      case 'xorshift32':
        state ^= state << 13;
        state ^= state >>> 17;
        state ^= state << 5;
        state = state >>> 0;
        value = state / 4294967296;
        break;
      case 'mulberry32':
        state = (state + 0x6d2b79f5) >>> 0;
        let z = state;
        z = Math.imul(z ^ (z >>> 15), z | 1);
        z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
        value = ((z ^ (z >>> 14)) >>> 0) / 4294967296;
        break;
      default:
        value = Math.random();
    }

    samples.push({ index: i, value });
  }

  return samples;
}

onMounted(() => {
  props.algorithms.forEach((algo) => {
    algorithmSamples.value[algo] = generateSamples(algo);
  });
});

const algorithmNames = computed(() => ({
  'simple-counter': t('algorithms.simpleCounter.name'),
  lcg: t('algorithms.lcg.name'),
  xorshift32: t('algorithms.xorshift32.name'),
  mulberry32: t('algorithms.mulberry32.name'),
  sfc32: t('algorithms.sfc32.name'),
}));

function calculateQualityScore(samples: PrngSample[]): {
  mean: boolean;
  variance: boolean;
  overall: number;
} {
  if (!samples || samples.length === 0) {
    return { mean: false, variance: false, overall: 0 };
  }

  const values = samples.map((s) => s.value);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;

  const meanPass = Math.abs(mean - 0.5) < 0.1;
  const variancePass = variance > 0.05 && variance < 0.15;

  return {
    mean: meanPass,
    variance: variancePass,
    overall: (meanPass ? 50 : 0) + (variancePass ? 50 : 0),
  };
}

const qualityScores = computed(() => {
  const scores: Record<string, { mean: boolean; variance: boolean; overall: number }> = {};
  for (const algo of props.algorithms) {
    scores[algo] = calculateQualityScore(algorithmSamples.value[algo] ?? []);
  }
  return scores;
});
</script>

<template>
  <div class="flex flex-col gap-6 w-full">
    <h3 class="text-lg font-semibold text-body text-center">
      {{ t('learn.comparison.title') }}
    </h3>

    <div
      class="grid gap-6"
      :class="algorithms.length <= 2 ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-3'"
    >
      <div v-for="algo in algorithms" :key="algo" class="flex flex-col gap-4 p-4 glass rounded-xl">
        <h4 class="text-base font-semibold text-primary text-center m-0">
          {{ algorithmNames[algo as keyof typeof algorithmNames] ?? algo }}
        </h4>

        <div v-if="showCorrelation && algorithmSamples[algo]" class="h-[150px]">
          <CorrelationPlot :samples="algorithmSamples[algo]" :max-points="100" />
        </div>

        <div v-if="showTimeSeries && algorithmSamples[algo]" class="h-[100px]">
          <TimeSeriesChart :samples="algorithmSamples[algo]" :max-points="50" />
        </div>

        <div v-if="showHistogram && algorithmSamples[algo]" class="h-[100px]">
          <DistributionHistogram :samples="algorithmSamples[algo]" />
        </div>

        <div v-if="showQualityTests && qualityScores[algo]" class="flex flex-col gap-2 mt-2">
          <div class="flex items-center justify-between text-xs">
            <span class="text-muted">{{ t('learn.comparison.meanTest') }}</span>
            <span :class="qualityScores[algo].mean ? 'text-accent' : 'text-error'">
              {{ qualityScores[algo].mean ? '✓' : '✗' }}
            </span>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span class="text-muted">{{ t('learn.comparison.varianceTest') }}</span>
            <span :class="qualityScores[algo].variance ? 'text-accent' : 'text-error'">
              {{ qualityScores[algo].variance ? '✓' : '✗' }}
            </span>
          </div>
          <div class="flex items-center justify-between text-sm font-semibold">
            <span class="text-muted">{{ t('learn.comparison.score') }}</span>
            <span :class="qualityScores[algo].overall >= 50 ? 'text-accent' : 'text-error'">
              {{ qualityScores[algo].overall }}%
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
