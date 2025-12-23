<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const inputValue = ref(0);
const bitToFlip = ref(0);

const originalBinary = computed(() => {
  return (inputValue.value >>> 0).toString(2).padStart(8, '0');
});

const flippedInput = computed(() => {
  return inputValue.value ^ (1 << bitToFlip.value);
});

const flippedBinary = computed(() => {
  return (flippedInput.value >>> 0).toString(2).padStart(8, '0');
});

// Simple hash function to demonstrate avalanche
function simpleHash(n: number): number {
  let h = n;
  h ^= h >>> 4;
  h *= 0x5bd1e995;
  h ^= h >>> 15;
  return h & 0xff;
}

const originalOutput = computed(() => simpleHash(inputValue.value));
const flippedOutput = computed(() => simpleHash(flippedInput.value));

const outputOriginalBinary = computed(() => {
  return (originalOutput.value >>> 0).toString(2).padStart(8, '0');
});

const outputFlippedBinary = computed(() => {
  return (flippedOutput.value >>> 0).toString(2).padStart(8, '0');
});

const bitsChanged = computed(() => {
  let count = 0;
  for (let i = 0; i < 8; i++) {
    if (outputOriginalBinary.value[i] !== outputFlippedBinary.value[i]) {
      count++;
    }
  }
  return count;
});

function randomize() {
  inputValue.value = Math.floor(Math.random() * 256);
  bitToFlip.value = Math.floor(Math.random() * 8);
}
</script>

<template>
  <div class="flex flex-col gap-4 items-center w-full max-w-md">
    <!-- Controls -->
    <div class="flex gap-4 items-center flex-wrap justify-center">
      <label class="flex flex-col items-center gap-1">
        <span class="text-xs text-muted">{{ t('learn.microTeaching.avalanche.input') }}</span>
        <input
          v-model.number="inputValue"
          type="number"
          min="0"
          max="255"
          class="w-20 px-2 py-1 text-center font-mono bg-page border border-border rounded focus:border-primary focus:outline-none"
        />
      </label>
      <label class="flex flex-col items-center gap-1">
        <span class="text-xs text-muted">{{ t('learn.microTeaching.avalanche.flipBit') }}</span>
        <input
          v-model.number="bitToFlip"
          type="number"
          min="0"
          max="7"
          class="w-16 px-2 py-1 text-center font-mono bg-page border border-border rounded focus:border-primary focus:outline-none"
        />
      </label>
      <button class="btn-outline text-sm" @click="randomize">
        {{ t('learn.microTeaching.avalanche.random') }}
      </button>
    </div>

    <!-- Input comparison -->
    <div class="w-full p-3 bg-surface rounded-lg">
      <div class="text-xs text-muted mb-2 text-center">
        {{ t('learn.microTeaching.avalanche.inputChange') }}
      </div>
      <div class="flex flex-col gap-2 font-mono text-center">
        <!-- Original input -->
        <div class="flex items-center justify-center gap-2">
          <span class="text-muted text-sm w-12 text-right">{{ inputValue }}</span>
          <div class="flex gap-0.5">
            <span
              v-for="(bit, idx) in originalBinary"
              :key="'orig-' + idx"
              class="w-5 h-6 flex items-center justify-center rounded text-xs"
              :class="
                7 - idx === bitToFlip
                  ? 'bg-accent text-page font-bold'
                  : bit === '1'
                    ? 'bg-primary/50 text-page'
                    : 'bg-page text-muted'
              "
            >
              {{ bit }}
            </span>
          </div>
        </div>
        <!-- Flipped input -->
        <div class="flex items-center justify-center gap-2">
          <span class="text-accent text-sm w-12 text-right font-bold">{{ flippedInput }}</span>
          <div class="flex gap-0.5">
            <span
              v-for="(bit, idx) in flippedBinary"
              :key="'flip-' + idx"
              class="w-5 h-6 flex items-center justify-center rounded text-xs"
              :class="
                7 - idx === bitToFlip
                  ? 'bg-accent text-page font-bold'
                  : bit === '1'
                    ? 'bg-primary/50 text-page'
                    : 'bg-page text-muted'
              "
            >
              {{ bit }}
            </span>
          </div>
        </div>
      </div>
      <div class="text-xs text-center text-muted mt-2">
        1 {{ t('learn.microTeaching.avalanche.bitFlipped') }}
      </div>
    </div>

    <!-- Arrow -->
    <div class="text-2xl text-primary">↓ {{ t('learn.microTeaching.avalanche.hashFunction') }}</div>

    <!-- Output comparison -->
    <div class="w-full p-3 bg-surface rounded-lg">
      <div class="text-xs text-muted mb-2 text-center">
        {{ t('learn.microTeaching.avalanche.outputChange') }}
      </div>
      <div class="flex flex-col gap-2 font-mono text-center">
        <!-- Original output -->
        <div class="flex items-center justify-center gap-2">
          <span class="text-muted text-sm w-12 text-right">{{ originalOutput }}</span>
          <div class="flex gap-0.5">
            <span
              v-for="(bit, idx) in outputOriginalBinary"
              :key="'out-orig-' + idx"
              class="w-5 h-6 flex items-center justify-center rounded text-xs"
              :class="
                outputOriginalBinary[idx] !== outputFlippedBinary[idx]
                  ? 'bg-red-500/50 text-page'
                  : bit === '1'
                    ? 'bg-primary/50 text-page'
                    : 'bg-page text-muted'
              "
            >
              {{ bit }}
            </span>
          </div>
        </div>
        <!-- Flipped output -->
        <div class="flex items-center justify-center gap-2">
          <span class="text-accent text-sm w-12 text-right font-bold">{{ flippedOutput }}</span>
          <div class="flex gap-0.5">
            <span
              v-for="(bit, idx) in outputFlippedBinary"
              :key="'out-flip-' + idx"
              class="w-5 h-6 flex items-center justify-center rounded text-xs"
              :class="
                outputOriginalBinary[idx] !== outputFlippedBinary[idx]
                  ? 'bg-red-500 text-page font-bold'
                  : bit === '1'
                    ? 'bg-primary/50 text-page'
                    : 'bg-page text-muted'
              "
            >
              {{ bit }}
            </span>
          </div>
        </div>
      </div>
      <div
        class="text-xs text-center mt-2"
        :class="bitsChanged >= 3 ? 'text-green-500' : 'text-orange-500'"
      >
        {{ bitsChanged }} {{ t('learn.microTeaching.avalanche.bitsChanged') }}
      </div>
    </div>

    <!-- Insight -->
    <div class="text-sm text-center text-muted max-w-xs">
      {{ t('learn.microTeaching.avalanche.insight') }}
    </div>
  </div>
</template>
