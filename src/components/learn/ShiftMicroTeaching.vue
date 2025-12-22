<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const value = ref(5);
const shiftAmount = ref(1);
const direction = ref<'left' | 'right'>('left');

const binaryValue = computed(() => {
  return (value.value >>> 0).toString(2).padStart(8, '0');
});

const shiftedValue = computed(() => {
  if (direction.value === 'left') {
    return (value.value << shiftAmount.value) & 0xff;
  } else {
    return value.value >>> shiftAmount.value;
  }
});

const binaryShifted = computed(() => {
  return (shiftedValue.value >>> 0).toString(2).padStart(8, '0');
});

const mathEquivalent = computed(() => {
  if (direction.value === 'left') {
    return `${value.value} × ${Math.pow(2, shiftAmount.value)} = ${shiftedValue.value}`;
  } else {
    return `${value.value} ÷ ${Math.pow(2, shiftAmount.value)} = ${shiftedValue.value}`;
  }
});

function toggleDirection() {
  direction.value = direction.value === 'left' ? 'right' : 'left';
}
</script>

<template>
  <div class="flex flex-col gap-4 items-center w-full max-w-md">
    <!-- Input Controls -->
    <div class="flex gap-4 items-center flex-wrap justify-center">
      <label class="flex flex-col items-center gap-1">
        <span class="text-xs text-muted">{{ t('learn.microTeaching.shiftDemo.value') }}</span>
        <input
          v-model.number="value"
          type="number"
          min="0"
          max="255"
          class="w-20 px-2 py-1 text-center font-mono bg-page border border-border rounded focus:border-primary focus:outline-none"
        />
      </label>
      <label class="flex flex-col items-center gap-1">
        <span class="text-xs text-muted">{{ t('learn.microTeaching.shiftDemo.amount') }}</span>
        <input
          v-model.number="shiftAmount"
          type="number"
          min="1"
          max="7"
          class="w-16 px-2 py-1 text-center font-mono bg-page border border-border rounded focus:border-primary focus:outline-none"
        />
      </label>
      <button
        class="px-3 py-1 text-sm rounded transition-colors"
        :class="
          direction === 'left'
            ? 'bg-primary text-page'
            : 'bg-surface text-muted hover:bg-primary/20'
        "
        @click="toggleDirection"
      >
        {{
          direction === 'left'
            ? t('learn.microTeaching.shiftDemo.left')
            : t('learn.microTeaching.shiftDemo.right')
        }}
      </button>
    </div>

    <!-- Binary Visualization -->
    <div class="flex flex-col gap-3 font-mono text-center w-full">
      <!-- Original value -->
      <div class="flex items-center justify-center gap-2">
        <span class="text-muted text-sm w-16 text-right">{{ value }}</span>
        <div class="flex gap-0.5">
          <span
            v-for="(bit, idx) in binaryValue"
            :key="'orig-' + idx"
            class="w-6 h-8 flex items-center justify-center rounded text-sm font-bold"
            :class="bit === '1' ? 'bg-primary text-page' : 'bg-surface text-muted'"
          >
            {{ bit }}
          </span>
        </div>
      </div>

      <!-- Arrow showing direction -->
      <div class="text-primary text-lg">
        {{ direction === 'left' ? '↓ shift left ' + shiftAmount : '↓ shift right ' + shiftAmount }}
      </div>

      <!-- Shifted value -->
      <div class="flex items-center justify-center gap-2">
        <span class="text-accent text-sm w-16 text-right font-bold">{{ shiftedValue }}</span>
        <div class="flex gap-0.5">
          <span
            v-for="(bit, idx) in binaryShifted"
            :key="'shift-' + idx"
            class="w-6 h-8 flex items-center justify-center rounded text-sm font-bold"
            :class="bit === '1' ? 'bg-accent text-page' : 'bg-surface text-muted'"
          >
            {{ bit }}
          </span>
        </div>
      </div>
    </div>

    <!-- Math equivalent -->
    <div class="text-sm text-muted">
      {{ mathEquivalent }}
    </div>
  </div>
</template>
