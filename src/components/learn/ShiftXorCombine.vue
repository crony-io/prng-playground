<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { PrngSample } from '@/composables/usePrngRunner';
import TimeSeriesChart from '@/components/TimeSeriesChart.vue';

const props = withDefaults(
  defineProps<{
    initialValue?: number;
  }>(),
  {
    initialValue: 42,
  },
);

const { t } = useI18n();

// Never start at 0 - XOR with 0 produces 0 forever
const safeInitialValue = props.initialValue === 0 ? 1 : props.initialValue;
const state = ref(safeInitialValue);
const history = ref<number[]>([safeInitialValue]);

function step() {
  let s = state.value;
  s ^= s << 7;
  s ^= s >>> 5;
  s = s & 0xff;
  state.value = s;
  history.value.push(s);
  if (history.value.length > 20) {
    history.value.shift();
  }
}

function reset() {
  state.value = safeInitialValue;
  history.value = [safeInitialValue];
}

const samples = computed((): PrngSample[] => {
  return history.value.map((v, i) => ({
    index: i,
    value: v / 255,
  }));
});
</script>

<template>
  <div class="flex flex-col items-center gap-6 w-full">
    <div class="text-center">
      <p class="text-base text-muted mb-2">{{ t('learn.activities.shiftXor.current') }}</p>
      <div class="text-4xl font-bold text-primary font-mono">{{ state }}</div>
      <div class="text-lg text-muted font-mono">{{ state.toString(2).padStart(8, '0') }}</div>
    </div>

    <p class="text-sm text-muted text-center max-w-[400px]">
      {{ t('learn.activities.shiftXor.formula') }}
    </p>

    <div class="flex gap-4">
      <button class="btn-primary" @click="step">
        {{ t('learn.activities.shiftXor.step') }}
      </button>
      <button class="btn-outline" @click="reset">
        {{ t('learn.activities.reset') }}
      </button>
    </div>

    <div class="w-full h-[150px]">
      <TimeSeriesChart :samples="samples" :max-points="20" />
    </div>

    <div class="font-mono text-sm text-muted">
      {{ history.join(' → ') }}
    </div>
  </div>
</template>
