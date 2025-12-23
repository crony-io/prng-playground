<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const value = ref(0b11000101);
const rotateAmount = ref(2);

const binaryValue = computed(() => {
  return (value.value >>> 0).toString(2).padStart(8, '0');
});

// Shift left (bits fall off)
const shiftedLeft = computed(() => {
  return (value.value << rotateAmount.value) & 0xff;
});

const binaryShiftedLeft = computed(() => {
  return (shiftedLeft.value >>> 0).toString(2).padStart(8, '0');
});

// Rotate left (bits wrap around)
const rotatedLeft = computed(() => {
  const v = value.value & 0xff;
  const r = rotateAmount.value % 8;
  return ((v << r) | (v >>> (8 - r))) & 0xff;
});

const binaryRotatedLeft = computed(() => {
  return (rotatedLeft.value >>> 0).toString(2).padStart(8, '0');
});

// Highlight which bits "fell off" and "wrapped"
const lostBits = computed(() => {
  const r = rotateAmount.value % 8;
  return binaryValue.value.slice(0, r);
});

function randomize() {
  value.value = Math.floor(Math.random() * 256);
  rotateAmount.value = Math.floor(Math.random() * 7) + 1;
}
</script>

<template>
  <div class="flex flex-col gap-4 items-center w-full max-w-lg">
    <!-- Controls -->
    <div class="flex gap-4 items-center flex-wrap justify-center">
      <label class="flex flex-col items-center gap-1">
        <span class="text-xs text-muted">{{ t('learn.microTeaching.rotation.value') }}</span>
        <input
          v-model.number="value"
          type="number"
          min="0"
          max="255"
          class="w-20 px-2 py-1 text-center font-mono bg-page border border-border rounded focus:border-primary focus:outline-none"
        />
      </label>
      <label class="flex flex-col items-center gap-1">
        <span class="text-xs text-muted">{{ t('learn.microTeaching.rotation.amount') }}</span>
        <input
          v-model.number="rotateAmount"
          type="number"
          min="1"
          max="7"
          class="w-16 px-2 py-1 text-center font-mono bg-page border border-border rounded focus:border-primary focus:outline-none"
        />
      </label>
      <button class="btn-outline text-sm" @click="randomize">
        {{ t('learn.microTeaching.rotation.random') }}
      </button>
    </div>

    <!-- Comparison: Shift vs Rotate -->
    <div class="grid grid-cols-2 gap-4 w-full">
      <!-- Shift column -->
      <div class="p-3 bg-surface rounded-lg">
        <div class="text-xs text-muted text-center mb-2 font-semibold">
          {{ t('learn.microTeaching.rotation.shift') }} ({{
            t('learn.microTeaching.rotation.losesBits')
          }})
        </div>

        <!-- Original -->
        <div class="flex justify-center gap-0.5 mb-1">
          <span
            v-for="(bit, idx) in binaryValue"
            :key="'shift-orig-' + idx"
            class="w-5 h-6 flex items-center justify-center rounded text-xs font-mono"
            :class="
              idx < rotateAmount
                ? 'bg-red-500/50 text-red-200'
                : bit === '1'
                  ? 'bg-primary/50 text-page'
                  : 'bg-page text-muted'
            "
          >
            {{ bit }}
          </span>
        </div>

        <div class="text-center text-primary text-sm my-1">↓ &lt;&lt; {{ rotateAmount }}</div>

        <!-- Result -->
        <div class="flex justify-center gap-0.5">
          <span
            v-for="(bit, idx) in binaryShiftedLeft"
            :key="'shift-res-' + idx"
            class="w-5 h-6 flex items-center justify-center rounded text-xs font-mono"
            :class="bit === '1' ? 'bg-primary text-page' : 'bg-page text-muted'"
          >
            {{ bit }}
          </span>
        </div>

        <div class="text-xs text-center text-red-400 mt-2">
          {{ t('learn.microTeaching.rotation.lost') }}:
          <span class="font-mono">{{ lostBits }}</span>
        </div>
      </div>

      <!-- Rotate column -->
      <div class="p-3 bg-surface rounded-lg border-2 border-accent/50">
        <div class="text-xs text-accent text-center mb-2 font-semibold">
          {{ t('learn.microTeaching.rotation.rotate') }} ({{
            t('learn.microTeaching.rotation.keepsBits')
          }})
        </div>

        <!-- Original -->
        <div class="flex justify-center gap-0.5 mb-1">
          <span
            v-for="(bit, idx) in binaryValue"
            :key="'rot-orig-' + idx"
            class="w-5 h-6 flex items-center justify-center rounded text-xs font-mono"
            :class="
              idx < rotateAmount
                ? 'bg-accent/50 text-accent'
                : bit === '1'
                  ? 'bg-primary/50 text-page'
                  : 'bg-page text-muted'
            "
          >
            {{ bit }}
          </span>
        </div>

        <div class="text-center text-accent text-sm my-1">↓ ⟳ {{ rotateAmount }}</div>

        <!-- Result -->
        <div class="flex justify-center gap-0.5">
          <span
            v-for="(bit, idx) in binaryRotatedLeft"
            :key="'rot-res-' + idx"
            class="w-5 h-6 flex items-center justify-center rounded text-xs font-mono"
            :class="
              idx >= 8 - rotateAmount
                ? 'bg-accent text-page font-bold'
                : bit === '1'
                  ? 'bg-primary text-page'
                  : 'bg-page text-muted'
            "
          >
            {{ bit }}
          </span>
        </div>

        <div class="text-xs text-center text-green-400 mt-2">
          {{ t('learn.microTeaching.rotation.wrapped') }}:
          <span class="font-mono">{{ lostBits }}</span>
        </div>
      </div>
    </div>

    <!-- Values comparison -->
    <div class="flex gap-6 text-sm">
      <span class="text-muted">
        {{ t('learn.microTeaching.rotation.shift') }}:
        <span class="font-mono font-bold text-primary">{{ shiftedLeft }}</span>
      </span>
      <span class="text-muted">
        {{ t('learn.microTeaching.rotation.rotate') }}:
        <span class="font-mono font-bold text-accent">{{ rotatedLeft }}</span>
      </span>
    </div>
  </div>
</template>
