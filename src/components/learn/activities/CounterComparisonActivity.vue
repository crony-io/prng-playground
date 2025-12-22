<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import type { PrngSample } from '@/composables/usePrngRunner';
import CorrelationPlot from '@/components/CorrelationPlot.vue';
import { getAlgorithm } from '@/algorithms';
import { LIMITS } from '@/constants/limits';

const props = defineProps<{
  algorithms?: string[];
}>();

const { t } = useI18n();

const counterValue = ref(0);
const counterHistory = ref<number[]>([]);
const professionalSamples = ref<PrngSample[]>([]);
const algorithmState = ref<unknown>(null);
const comparisonAlgorithmId = ref('xorshift32');

const counterSamples = computed((): PrngSample[] => {
  return counterHistory.value.map((v, i) => ({
    index: i,
    value: (v % 100) / 100,
  }));
});

function generateProfessionalSamples() {
  const alg = getAlgorithm(comparisonAlgorithmId.value);
  if (!alg) {
    const samples: PrngSample[] = [];
    for (let i = 0; i < LIMITS.DEFAULT_SAMPLE_COUNT; i++) {
      samples.push({ index: i, value: Math.random() });
    }
    professionalSamples.value = samples;
    return;
  }

  if (!algorithmState.value) {
    algorithmState.value = alg.init(Date.now());
  }

  const samples: PrngSample[] = [];
  let state = algorithmState.value;
  for (let i = 0; i < LIMITS.DEFAULT_SAMPLE_COUNT; i++) {
    const result = alg.next(state);
    samples.push({ index: i, value: result.value });
    state = result.state;
  }
  algorithmState.value = state;
  professionalSamples.value = samples;
}

function initializeComparison() {
  if (props.algorithms?.[1]) {
    comparisonAlgorithmId.value = props.algorithms[1];
  }

  algorithmState.value = null;
  counterValue.value = 0;
  counterHistory.value = [];

  for (let i = 0; i < LIMITS.INITIAL_COUNTER_STEPS; i++) {
    counterValue.value += 1;
    counterHistory.value.push(counterValue.value);
  }
  generateProfessionalSamples();
}

function handleCounterStep() {
  counterValue.value += 1;
  counterHistory.value.push(counterValue.value);
  if (counterHistory.value.length > LIMITS.MAX_COUNTER_HISTORY) {
    counterHistory.value.shift();
  }
  generateProfessionalSamples();
}

onMounted(() => {
  initializeComparison();
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <p class="text-body text-center mb-2">{{ t('learn.activities.comparisonIntro') }}</p>
    <div class="grid grid-cols-2 gap-6">
      <div class="flex flex-col items-center gap-3">
        <h3 class="text-base font-semibold text-body m-0">
          {{ t('learn.activities.counter') }}
        </h3>
        <p class="text-xs text-muted m-0">{{ t('learn.activities.counterDesc') }}</p>
        <CorrelationPlot :samples="counterSamples" :max-points="LIMITS.MAX_COUNTER_HISTORY" />
      </div>
      <div class="flex flex-col items-center gap-3">
        <h3 class="text-base font-semibold text-primary m-0">{{ comparisonAlgorithmId }}</h3>
        <p class="text-xs text-muted m-0">{{ t('learn.activities.algorithmDesc') }}</p>
        <CorrelationPlot :samples="professionalSamples" :max-points="LIMITS.DEFAULT_SAMPLE_COUNT" />
      </div>
    </div>
    <div class="flex gap-3 justify-center">
      <button class="btn-primary" @click="handleCounterStep">
        {{ t('learn.activities.stepBoth') }}
      </button>
      <button class="btn-outline" @click="initializeComparison">
        {{ t('learn.activities.reset') }}
      </button>
    </div>
    <p class="text-sm text-muted text-center">{{ t('learn.activities.comparisonHint') }}</p>
  </div>
</template>
