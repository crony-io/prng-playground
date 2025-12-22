<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { LIMITS } from '@/constants/limits';

const { t } = useI18n();

const overflowValue = ref(1);
const overflowHistory = ref<number[]>([1]);
const overflowMultiplier = ref(2);

function handleOverflowStep() {
  overflowValue.value =
    (overflowValue.value * overflowMultiplier.value) % LIMITS.OVERFLOW_MAX_VALUE;
  overflowHistory.value.push(overflowValue.value);
  if (overflowHistory.value.length > LIMITS.OVERFLOW_HISTORY_SIZE) {
    overflowHistory.value.shift();
  }
}

function handleOverflowReset() {
  overflowValue.value = 1;
  overflowHistory.value = [1];
}
</script>

<template>
  <div class="flex flex-col items-center gap-6">
    <div class="flex items-baseline gap-3">
      <span class="text-base text-muted">{{ t('learn.activities.currentNumber') }}:</span>
      <span
        class="text-4xl font-bold text-primary transition-colors duration-300"
        :class="{
          'text-accent animate-pulse':
            overflowValue < (overflowHistory[overflowHistory.length - 2] ?? 0),
        }"
        >{{ overflowValue }}</span
      >
    </div>
    <p class="text-sm text-muted text-center">
      {{ t('learn.activities.overflowExplanation', { max: LIMITS.OVERFLOW_MAX_VALUE }) }}
    </p>
    <div class="flex gap-3 flex-wrap justify-center">
      <button class="btn-primary" @click="handleOverflowStep">
        {{ t('learn.activities.multiply', { n: overflowMultiplier }) }}
      </button>
      <button class="btn-outline" @click="handleOverflowReset">
        {{ t('learn.activities.reset') }}
      </button>
    </div>
    <div class="font-mono text-sm text-muted max-w-full overflow-x-auto">
      <span v-for="(val, idx) in overflowHistory" :key="idx" class="whitespace-nowrap">
        {{ val }}<span v-if="idx < overflowHistory.length - 1"> → </span>
      </span>
    </div>
  </div>
</template>
