<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import TimeSeriesChart from '@/components/TimeSeriesChart.vue';
import type { PrngSample } from '@/composables/usePrngRunner';

const props = withDefaults(
  defineProps<{
    allowCustomMultiplier?: boolean;
  }>(),
  {
    allowCustomMultiplier: true,
  },
);

const { t } = useI18n();

const MOD_VALUE = 256;
const ADD_CONSTANT = 7;
const mulConstant = ref(3);

const addState = ref(1);
const mulState = ref(1);
const addHistory = ref<number[]>([1]);
const mulHistory = ref<number[]>([1]);
const stepCount = ref(0);

function step() {
  addState.value = (addState.value + ADD_CONSTANT) % MOD_VALUE;
  mulState.value = (mulState.value * mulConstant.value) % MOD_VALUE;

  addHistory.value.push(addState.value);
  mulHistory.value.push(mulState.value);

  if (addHistory.value.length > 50) {
    addHistory.value.shift();
    mulHistory.value.shift();
  }

  stepCount.value++;
}

function reset() {
  addState.value = 1;
  mulState.value = 1;
  addHistory.value = [1];
  mulHistory.value = [1];
  stepCount.value = 0;
}

function runMany() {
  for (let i = 0; i < 20; i++) {
    step();
  }
}

const addSamples = computed((): PrngSample[] => {
  return addHistory.value.map((v, i) => ({
    index: i,
    value: v / MOD_VALUE,
  }));
});

const mulSamples = computed((): PrngSample[] => {
  return mulHistory.value.map((v, i) => ({
    index: i,
    value: v / MOD_VALUE,
  }));
});
</script>

<template>
  <div class="flex flex-col gap-6 w-full">
    <p class="text-body text-center">{{ t('learn.activities.addVsMultiply.intro') }}</p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Addition Generator -->
      <div class="flex flex-col items-center gap-3 p-4 glass rounded-xl">
        <h3 class="text-base font-semibold text-muted m-0">
          {{ t('learn.activities.addVsMultiply.addTitle') }}
        </h3>
        <p class="text-xs text-muted m-0 text-center">
          {{ t('learn.activities.addVsMultiply.addFormula', { n: ADD_CONSTANT }) }}
        </p>
        <div class="text-3xl font-bold text-body">{{ addState }}</div>
        <div class="w-full h-[150px]">
          <TimeSeriesChart :samples="addSamples" :max-points="50" />
        </div>
      </div>

      <!-- Multiplication Generator -->
      <div class="flex flex-col items-center gap-3 p-4 glass rounded-xl border-2 border-primary">
        <h3 class="text-base font-semibold text-primary m-0">
          {{ t('learn.activities.addVsMultiply.mulTitle') }}
        </h3>
        <p class="text-xs text-muted m-0 text-center">
          {{ t('learn.activities.addVsMultiply.mulFormula', { n: mulConstant }) }}
        </p>
        <div v-if="props.allowCustomMultiplier" class="flex items-center gap-2">
          <label class="text-xs text-muted"
            >{{ t('learn.activities.addVsMultiply.multiplier') }}:</label
          >
          <input
            v-model.number="mulConstant"
            type="number"
            min="0"
            max="10"
            class="w-16 px-2 py-1 text-sm rounded border border-border bg-surface text-body"
            @change="reset"
          />
        </div>
        <div class="text-3xl font-bold text-primary">{{ mulState }}</div>
        <div class="w-full h-[150px]">
          <TimeSeriesChart :samples="mulSamples" :max-points="50" />
        </div>
      </div>
    </div>

    <div class="flex gap-3 justify-center flex-wrap">
      <button class="btn-primary" @click="step">
        {{ t('learn.activities.addVsMultiply.step') }}
      </button>
      <button class="btn-outline" @click="runMany">
        {{ t('learn.activities.addVsMultiply.runMany') }}
      </button>
      <button class="btn-outline" @click="reset">
        {{ t('learn.activities.reset') }}
      </button>
    </div>

    <p class="text-sm text-muted text-center">
      {{ t('learn.activities.addVsMultiply.hint') }}
    </p>
  </div>
</template>
