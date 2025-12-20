<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { getAlgorithm } from '@/algorithms';
import type { PrngSample } from '@/composables/usePrngRunner';
import TimeSeriesChart from '@/components/TimeSeriesChart.vue';
import CorrelationPlot from '@/components/CorrelationPlot.vue';

const props = withDefaults(
  defineProps<{
    algorithmId: string;
    showTimeSeries?: boolean;
    showCorrelation?: boolean;
    showBitVisualization?: boolean;
  }>(),
  {
    showTimeSeries: true,
    showCorrelation: true,
    showBitVisualization: false,
  },
);

const { t } = useI18n();

const algorithm = computed(() => getAlgorithm(props.algorithmId));
const state = ref<Record<string, number>>({});
const samples = ref<PrngSample[]>([]);
const stepCount = ref(0);
const currentValue = ref(0);

const internalState = ref<unknown>(null);

function initState() {
  const alg = algorithm.value;
  if (!alg) {
    return;
  }

  internalState.value = alg.init(Date.now());
  state.value = (alg.peekState?.(internalState.value) ?? {}) as Record<string, number>;
  samples.value = [];
  stepCount.value = 0;
  currentValue.value = 0;
}

function step() {
  const alg = algorithm.value;
  if (!alg || !internalState.value) {
    return;
  }

  const result = alg.next(internalState.value);
  internalState.value = result.state;
  state.value = (alg.peekState?.(result.state) ?? {}) as Record<string, number>;
  currentValue.value = result.value;
  stepCount.value += 1;

  samples.value.push({
    index: stepCount.value,
    value: result.value,
  });

  if (samples.value.length > 100) {
    samples.value.shift();
  }
}

function reset() {
  initState();
}

function runMany(count: number) {
  for (let i = 0; i < count; i++) {
    step();
  }
}

onMounted(() => {
  initState();
});

watch(
  () => props.algorithmId,
  () => {
    initState();
  },
);

const stateEntries = computed(() => Object.entries(state.value));
const algorithmName = computed(() => {
  if (!algorithm.value?.meta?.nameKey) {
    return props.algorithmId;
  }
  return t(algorithm.value.meta.nameKey);
});
</script>

<template>
  <div class="flex flex-col gap-6 w-full max-w-[700px]">
    <div class="text-center">
      <h3 class="text-xl font-bold text-primary m-0 mb-2">{{ algorithmName }}</h3>
      <p v-if="algorithm?.meta?.descriptionKey" class="text-sm text-muted m-0">
        {{ t(algorithm.meta.descriptionKey) }}
      </p>
    </div>

    <!-- State Display -->
    <div class="p-4 glass rounded-xl">
      <div class="text-sm text-muted mb-3">{{ t('learn.activities.algorithmExplorer.state') }}</div>
      <div class="flex flex-wrap gap-4 justify-center">
        <div
          v-for="[key, value] in stateEntries"
          :key="key"
          class="flex flex-col items-center gap-1 px-4 py-2 bg-surface rounded-lg"
        >
          <span class="text-xs text-muted font-mono">{{ key }}</span>
          <span class="text-lg font-bold text-primary font-mono">{{ value }}</span>
        </div>
      </div>
    </div>

    <!-- Current Output -->
    <div class="text-center">
      <span class="text-sm text-muted">{{ t('learn.activities.algorithmExplorer.output') }}: </span>
      <span class="text-2xl font-bold text-accent font-mono">{{ currentValue.toFixed(6) }}</span>
    </div>

    <!-- Controls -->
    <div class="flex gap-3 justify-center flex-wrap">
      <button class="btn-primary" @click="step">
        {{ t('learn.activities.algorithmExplorer.step') }}
      </button>
      <button class="btn-outline" @click="runMany(10)">+10</button>
      <button class="btn-outline" @click="runMany(100)">+100</button>
      <button class="btn-outline" @click="reset">
        {{ t('learn.activities.reset') }}
      </button>
    </div>

    <!-- Visualizations -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-if="showTimeSeries" class="flex flex-col gap-2">
        <span class="text-sm text-muted text-center">
          {{ t('learn.activities.algorithmExplorer.timeSeries') }}
        </span>
        <div class="h-[150px]">
          <TimeSeriesChart :samples="samples" :max-points="100" />
        </div>
      </div>
      <div v-if="showCorrelation" class="flex flex-col gap-2">
        <span class="text-sm text-muted text-center">
          {{ t('learn.activities.algorithmExplorer.correlation') }}
        </span>
        <CorrelationPlot :samples="samples" :max-points="100" />
      </div>
    </div>

    <!-- Step Counter -->
    <div class="text-center text-sm text-muted">
      {{ t('learn.activities.algorithmExplorer.steps', { count: stepCount }) }}
    </div>
  </div>
</template>
