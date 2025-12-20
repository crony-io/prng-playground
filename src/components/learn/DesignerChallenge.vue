<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { PrngSample } from '@/composables/usePrngRunner';
import TimeSeriesChart from '@/components/TimeSeriesChart.vue';
import CorrelationPlot from '@/components/CorrelationPlot.vue';

const { t } = useI18n();

const state = ref(1);
const samples = ref<PrngSample[]>([]);
const stepCount = ref(0);

// Designer operations
const multiplier = ref(1664525);
const addend = ref(1013904223);
const shiftLeft = ref(13);
const shiftRight = ref(17);
const useXorShift = ref(true);

function step() {
  let s = state.value;

  if (useXorShift.value) {
    s ^= s << shiftLeft.value;
    s ^= s >>> shiftRight.value;
    s ^= s << 5;
  } else {
    s = Math.imul(s, multiplier.value);
    s = (s + addend.value) | 0;
  }

  state.value = s;
  stepCount.value++;

  const normalized = (s >>> 0) / 0x100000000;
  samples.value.push({ index: stepCount.value, value: normalized });

  if (samples.value.length > 100) {
    samples.value.shift();
  }
}

function reset() {
  state.value = 1;
  samples.value = [];
  stepCount.value = 0;
}

function runMany(count: number) {
  for (let i = 0; i < count; i++) {
    step();
  }
}

// Calculate quality metrics
const qualityMetrics = computed(() => {
  if (samples.value.length < 20) {
    return { mean: null, variance: null, distribution: null };
  }

  const values = samples.value.map((s) => s.value);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;

  const bins = new Array(10).fill(0);
  for (const v of values) {
    bins[Math.min(9, Math.floor(v * 10))]++;
  }
  const expected = values.length / 10;
  const chiSquare = bins.reduce((a, b) => a + (b - expected) ** 2 / expected, 0);

  return {
    mean: Math.abs(mean - 0.5) < 0.1,
    variance: Math.abs(variance - 1 / 12) < 0.05,
    distribution: chiSquare < 25,
  };
});

const allPassed = computed(() => {
  const m = qualityMetrics.value;
  return m.mean && m.variance && m.distribution;
});
</script>

<template>
  <div class="flex flex-col items-center gap-6 w-full max-w-[700px]">
    <h3 class="text-lg font-semibold text-body">
      {{ t('learn.activities.designerChallenge.title') }}
    </h3>
    <p class="text-base text-muted text-center">
      {{ t('learn.activities.designerChallenge.intro') }}
    </p>

    <!-- Algorithm Type Toggle -->
    <div class="flex gap-4">
      <button
        class="px-4 py-2 rounded-lg transition-all"
        :class="useXorShift ? 'btn-primary' : 'btn-outline'"
        @click="
          useXorShift = true;
          reset();
        "
      >
        XOR-Shift
      </button>
      <button
        class="px-4 py-2 rounded-lg transition-all"
        :class="!useXorShift ? 'btn-primary' : 'btn-outline'"
        @click="
          useXorShift = false;
          reset();
        "
      >
        LCG
      </button>
    </div>

    <!-- Parameters -->
    <div class="grid grid-cols-2 gap-4 w-full p-4 glass rounded-xl">
      <template v-if="useXorShift">
        <div class="flex flex-col gap-1">
          <label class="text-sm text-muted">Shift Left</label>
          <input v-model.number="shiftLeft" type="number" class="form-control" min="1" max="31" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm text-muted">Shift Right</label>
          <input v-model.number="shiftRight" type="number" class="form-control" min="1" max="31" />
        </div>
      </template>
      <template v-else>
        <div class="flex flex-col gap-1">
          <label class="text-sm text-muted">Multiplier</label>
          <input v-model.number="multiplier" type="number" class="form-control" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm text-muted">Addend</label>
          <input v-model.number="addend" type="number" class="form-control" />
        </div>
      </template>
    </div>

    <!-- Current State -->
    <div class="text-center">
      <span class="text-sm text-muted">State: </span>
      <span class="text-xl font-bold text-primary font-mono">{{ state >>> 0 }}</span>
    </div>

    <!-- Controls -->
    <div class="flex gap-3">
      <button class="btn-primary" @click="step">Step</button>
      <button class="btn-outline" @click="runMany(10)">+10</button>
      <button class="btn-outline" @click="runMany(100)">+100</button>
      <button class="btn-outline" @click="reset">{{ t('learn.activities.reset') }}</button>
    </div>

    <!-- Visualizations -->
    <div class="grid grid-cols-2 gap-4 w-full">
      <div class="h-[150px]">
        <TimeSeriesChart :samples="samples" :max-points="100" />
      </div>
      <CorrelationPlot :samples="samples" :max-points="100" />
    </div>

    <!-- Quality Checklist -->
    <div class="flex flex-col gap-3 w-full p-4 glass rounded-xl">
      <div class="flex items-center gap-3">
        <span class="text-xl">{{
          qualityMetrics.mean === null ? '⬜' : qualityMetrics.mean ? '✅' : '❌'
        }}</span>
        <span class="text-body">{{ t('learn.activities.designerChallenge.challenge1') }}</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-xl">{{
          qualityMetrics.variance === null ? '⬜' : qualityMetrics.variance ? '✅' : '❌'
        }}</span>
        <span class="text-body">{{ t('learn.activities.designerChallenge.challenge2') }}</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-xl">{{
          qualityMetrics.distribution === null ? '⬜' : qualityMetrics.distribution ? '✅' : '❌'
        }}</span>
        <span class="text-body">{{ t('learn.activities.designerChallenge.challenge3') }}</span>
      </div>
    </div>

    <p v-if="allPassed" class="text-lg font-bold text-accent">
      🎉 {{ t('learn.activities.designerChallenge.completed') }}
    </p>
    <p v-else-if="samples.length >= 20" class="text-sm text-muted">
      {{ t('learn.activities.designerChallenge.tryAgain') }}
    </p>
  </div>
</template>
