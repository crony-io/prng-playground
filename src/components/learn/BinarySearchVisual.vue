<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const targetNumber = ref(11);
const min = ref(1);
const max = ref(16);
const guesses = ref<{ value: number; result: 'low' | 'high' | 'correct' }[]>([]);

const currentGuess = computed(() => {
  return Math.floor((min.value + max.value) / 2);
});

const rangeSize = computed(() => max.value - min.value + 1);

function makeGuess() {
  const guess = currentGuess.value;

  if (guess === targetNumber.value) {
    guesses.value.push({ value: guess, result: 'correct' });
  } else if (guess < targetNumber.value) {
    guesses.value.push({ value: guess, result: 'low' });
    min.value = guess + 1;
  } else {
    guesses.value.push({ value: guess, result: 'high' });
    max.value = guess - 1;
  }
}

function reset() {
  min.value = 1;
  max.value = 16;
  guesses.value = [];
  targetNumber.value = Math.floor(Math.random() * 16) + 1;
}

const isFound = computed(() => {
  const lastGuess = guesses.value[guesses.value.length - 1];
  return guesses.value.length > 0 && lastGuess?.result === 'correct';
});
</script>

<template>
  <div class="flex flex-col gap-4 items-center w-full max-w-md">
    <!-- Target info -->
    <div class="text-sm text-muted">
      {{ t('learn.microTeaching.binarySearch.findNumber') }}
      <span class="font-bold text-primary">{{ targetNumber }}</span>
    </div>

    <!-- Range visualization -->
    <div class="w-full p-3 bg-surface rounded-lg">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs text-muted"
          >{{ t('learn.microTeaching.binarySearch.range') }}: {{ min }} - {{ max }}</span
        >
        <span class="text-xs text-accent"
          >{{ rangeSize }} {{ t('learn.microTeaching.binarySearch.possibilities') }}</span
        >
      </div>

      <!-- Visual range bar -->
      <div class="relative h-8 bg-page rounded overflow-hidden">
        <div
          class="absolute h-full bg-primary/30 transition-all duration-300"
          :style="{
            left: ((min - 1) / 16) * 100 + '%',
            width: (rangeSize / 16) * 100 + '%',
          }"
        />
        <!-- Middle marker -->
        <div
          v-if="!isFound"
          class="absolute h-full w-1 bg-accent transition-all duration-300"
          :style="{ left: ((currentGuess - 0.5) / 16) * 100 + '%' }"
        />
      </div>

      <!-- Number line -->
      <div class="flex justify-between mt-1">
        <span class="text-xs text-muted">1</span>
        <span class="text-xs text-muted">8</span>
        <span class="text-xs text-muted">16</span>
      </div>
    </div>

    <!-- Current guess -->
    <div v-if="!isFound" class="text-center">
      <div class="text-sm text-muted mb-1">
        {{ t('learn.microTeaching.binarySearch.nextGuess') }}
      </div>
      <div class="text-3xl font-bold text-accent">{{ currentGuess }}</div>
      <div class="text-xs text-muted mt-1">({{ min }} + {{ max }}) ÷ 2</div>
    </div>

    <!-- Found message -->
    <div v-else class="text-center p-3 bg-green-500/10 rounded-lg">
      <div class="text-lg font-bold text-green-500">
        🎯 {{ t('learn.microTeaching.binarySearch.found') }}
      </div>
      <div class="text-sm text-muted">
        {{ guesses.length }} {{ t('learn.microTeaching.binarySearch.guesses') }}
      </div>
    </div>

    <!-- Controls -->
    <div class="flex gap-3">
      <button v-if="!isFound" class="btn-primary" @click="makeGuess">
        {{ t('learn.microTeaching.binarySearch.guess') }}
      </button>
      <button class="btn-outline" @click="reset">{{ t('learn.activities.reset') }}</button>
    </div>

    <!-- History -->
    <div v-if="guesses.length > 0" class="flex flex-wrap gap-2 justify-center">
      <span
        v-for="(g, idx) in guesses"
        :key="idx"
        class="px-2 py-1 rounded text-sm font-mono"
        :class="{
          'bg-red-500/20 text-red-500': g.result === 'high',
          'bg-blue-500/20 text-blue-500': g.result === 'low',
          'bg-green-500/20 text-green-500': g.result === 'correct',
        }"
      >
        {{ g.value }} {{ g.result === 'high' ? '↓' : g.result === 'low' ? '↑' : '✓' }}
      </span>
    </div>
  </div>
</template>
