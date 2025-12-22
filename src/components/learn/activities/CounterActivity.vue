<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { PrngSample } from '@/composables/usePrngRunner';
import TimeSeriesChart from '@/components/TimeSeriesChart.vue';
import { LIMITS } from '@/constants/limits';

const { t } = useI18n();

const counterValue = ref(0);
const counterHistory = ref<number[]>([]);

const counterSamples = computed((): PrngSample[] => {
  return counterHistory.value.map((v, i) => ({
    index: i,
    value: (v % 100) / 100,
  }));
});

function handleCounterStep() {
  counterValue.value += 1;
  counterHistory.value.push(counterValue.value);
  if (counterHistory.value.length > LIMITS.MAX_COUNTER_HISTORY) {
    counterHistory.value.shift();
  }
}

function handleCounterReset() {
  counterValue.value = 0;
  counterHistory.value = [];
}
</script>

<template>
  <div class="flex flex-col items-center gap-6">
    <div class="flex items-baseline gap-3">
      <span class="text-base text-muted">{{ t('learn.activities.currentNumber') }}:</span>
      <span class="text-4xl font-bold text-primary">{{ counterValue }}</span>
    </div>
    <div class="flex gap-4">
      <button class="btn-primary" @click="handleCounterStep">
        {{ t('learn.activities.nextNumber') }}
      </button>
      <button class="btn-outline" @click="handleCounterReset">
        {{ t('learn.activities.reset') }}
      </button>
    </div>
    <div class="w-full h-[200px]">
      <TimeSeriesChart :samples="counterSamples" :max-points="LIMITS.MAX_COUNTER_HISTORY" />
    </div>
  </div>
</template>
