<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const value = ref(0b10110001);
const amount = ref(3);

const binaryOriginal = computed(() => {
  return (value.value >>> 0).toString(2).padStart(8, '0');
});

const shiftedValue = computed(() => {
  return (value.value << amount.value) & 0xff;
});

const rotatedValue = computed(() => {
  const v = value.value & 0xff;
  const amt = amount.value % 8;
  return ((v << amt) | (v >>> (8 - amt))) & 0xff;
});

const binaryShifted = computed(() => {
  return (shiftedValue.value >>> 0).toString(2).padStart(8, '0');
});

const binaryRotated = computed(() => {
  return (rotatedValue.value >>> 0).toString(2).padStart(8, '0');
});

const lostBits = computed(() => {
  const v = value.value & 0xff;
  const amt = amount.value % 8;
  return (v >>> (8 - amt)).toString(2).padStart(amt, '0');
});

function randomize() {
  value.value = Math.floor(Math.random() * 256);
}
</script>

<template>
  <div
    class="flex flex-col gap-5 items-center w-full max-w-lg p-3 sm:p-4 glass rounded-xl overflow-x-auto"
  >
    <h3 class="text-lg font-semibold text-primary m-0">
      {{ t('learn.activities.rotationVsShift.title') }}
    </h3>

    <!-- Controls -->
    <div class="flex gap-4 items-center flex-wrap justify-center">
      <label class="flex flex-col items-center gap-1">
        <span class="text-xs text-muted">{{ t('learn.activities.rotationVsShift.value') }}</span>
        <input
          v-model.number="value"
          type="number"
          min="0"
          max="255"
          class="w-20 px-2 py-1 text-center font-mono bg-page border border-border rounded focus:border-primary focus:outline-none"
        />
      </label>
      <label class="flex flex-col items-center gap-1">
        <span class="text-xs text-muted">{{ t('learn.activities.rotationVsShift.amount') }}</span>
        <input
          v-model.number="amount"
          type="number"
          min="1"
          max="7"
          class="w-16 px-2 py-1 text-center font-mono bg-page border border-border rounded focus:border-primary focus:outline-none"
        />
      </label>
      <button class="btn-outline text-sm" @click="randomize">
        {{ t('learn.activities.rotationVsShift.random') }}
      </button>
    </div>

    <!-- Original Value -->
    <div class="flex flex-col items-center gap-1">
      <span class="text-xs text-muted">{{ t('learn.activities.rotationVsShift.original') }}</span>
      <div class="flex items-center gap-2">
        <span class="text-sm text-muted font-mono w-8 text-right">{{ value & 0xff }}</span>
        <div class="flex gap-0.5">
          <span
            v-for="(bit, idx) in binaryOriginal"
            :key="'orig-' + idx"
            class="w-5 sm:w-7 h-6 sm:h-8 flex items-center justify-center rounded text-xs sm:text-sm font-bold font-mono"
            :class="bit === '1' ? 'bg-primary text-page' : 'bg-surface text-muted'"
          >
            {{ bit }}
          </span>
        </div>
      </div>
    </div>

    <!-- Comparison Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
      <!-- Shift Left -->
      <div
        class="flex flex-col items-center gap-2 p-3 bg-surface/50 rounded-lg border border-red-500/30"
      >
        <span class="text-sm font-semibold text-red-400">
          {{ t('learn.activities.rotationVsShift.shiftLeft') }}
        </span>
        <div class="text-xs text-muted text-center">
          {{ t('learn.activities.rotationVsShift.bitsLost') }}
        </div>

        <div class="flex items-center gap-2">
          <span class="text-sm text-red-400 font-mono w-8 text-right font-bold">{{
            shiftedValue
          }}</span>
          <div class="flex gap-0.5">
            <span
              v-for="(bit, idx) in binaryShifted"
              :key="'shift-' + idx"
              class="w-5 sm:w-7 h-6 sm:h-8 flex items-center justify-center rounded text-xs sm:text-sm font-bold font-mono"
              :class="bit === '1' ? 'bg-red-500 text-page' : 'bg-surface text-muted'"
            >
              {{ bit }}
            </span>
          </div>
        </div>

        <div class="text-xs text-red-400/70 font-mono">
          {{ t('learn.activities.rotationVsShift.lost') }}:
          <span class="text-red-400 font-bold">{{ lostBits }}</span>
        </div>
      </div>

      <!-- Rotate Left -->
      <div
        class="flex flex-col items-center gap-2 p-3 bg-surface/50 rounded-lg border border-green-500/30"
      >
        <span class="text-sm font-semibold text-green-400">
          {{ t('learn.activities.rotationVsShift.rotateLeft') }}
        </span>
        <div class="text-xs text-muted text-center">
          {{ t('learn.activities.rotationVsShift.bitsPreserved') }}
        </div>

        <div class="flex items-center gap-2">
          <span class="text-sm text-green-400 font-mono w-8 text-right font-bold">{{
            rotatedValue
          }}</span>
          <div class="flex gap-0.5">
            <span
              v-for="(bit, idx) in binaryRotated"
              :key="'rot-' + idx"
              class="w-5 sm:w-7 h-6 sm:h-8 flex items-center justify-center rounded text-xs sm:text-sm font-bold font-mono"
              :class="bit === '1' ? 'bg-green-500 text-page' : 'bg-surface text-muted'"
            >
              {{ bit }}
            </span>
          </div>
        </div>

        <div class="text-xs text-green-400/70 font-mono">
          {{ t('learn.activities.rotationVsShift.wrapped') }}:
          <span class="text-green-400 font-bold">{{ lostBits }}</span>
        </div>
      </div>
    </div>

    <!-- Explanation -->
    <p class="text-sm text-muted text-center max-w-md">
      {{ t('learn.activities.rotationVsShift.explanation') }}
    </p>
  </div>
</template>
