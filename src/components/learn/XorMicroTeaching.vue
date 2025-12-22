<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const valueA = ref(5);
const valueB = ref(3);

const binaryA = computed(() => (valueA.value >>> 0).toString(2).padStart(8, '0'));
const binaryB = computed(() => (valueB.value >>> 0).toString(2).padStart(8, '0'));

const xorResult = computed(() => (valueA.value ^ valueB.value) >>> 0);
const binaryResult = computed(() => xorResult.value.toString(2).padStart(8, '0'));

function randomize() {
  valueA.value = Math.floor(Math.random() * 256);
  valueB.value = Math.floor(Math.random() * 256);
}
</script>

<template>
  <div class="flex flex-col gap-4 items-center w-full max-w-md">
    <!-- Input Controls -->
    <div class="flex gap-4 items-center flex-wrap justify-center">
      <label class="flex flex-col items-center gap-1">
        <span class="text-xs text-muted">{{ t('learn.microTeaching.xorDemo.valueA') }}</span>
        <input
          v-model.number="valueA"
          type="number"
          min="0"
          max="255"
          class="w-20 px-2 py-1 text-center font-mono bg-page border border-border rounded focus:border-primary focus:outline-none"
        />
      </label>
      <span class="text-xl font-bold text-primary">XOR</span>
      <label class="flex flex-col items-center gap-1">
        <span class="text-xs text-muted">{{ t('learn.microTeaching.xorDemo.valueB') }}</span>
        <input
          v-model.number="valueB"
          type="number"
          min="0"
          max="255"
          class="w-20 px-2 py-1 text-center font-mono bg-page border border-border rounded focus:border-primary focus:outline-none"
        />
      </label>
      <button
        class="px-3 py-1 text-sm rounded bg-surface text-muted hover:bg-primary/20"
        @click="randomize"
      >
        {{ t('learn.microTeaching.xorDemo.random') }}
      </button>
    </div>

    <!-- Binary Visualization -->
    <div class="flex flex-col gap-2 font-mono text-center w-full">
      <!-- Value A -->
      <div class="flex items-center justify-center gap-2">
        <span class="text-muted text-sm w-12 text-right">{{ valueA }}</span>
        <div class="flex gap-0.5">
          <span
            v-for="(bit, idx) in binaryA"
            :key="'a-' + idx"
            class="w-6 h-7 flex items-center justify-center rounded text-sm font-bold"
            :class="bit === '1' ? 'bg-primary text-page' : 'bg-surface text-muted'"
          >
            {{ bit }}
          </span>
        </div>
      </div>

      <!-- XOR symbol -->
      <div class="text-primary text-sm font-bold">XOR</div>

      <!-- Value B -->
      <div class="flex items-center justify-center gap-2">
        <span class="text-muted text-sm w-12 text-right">{{ valueB }}</span>
        <div class="flex gap-0.5">
          <span
            v-for="(bit, idx) in binaryB"
            :key="'b-' + idx"
            class="w-6 h-7 flex items-center justify-center rounded text-sm font-bold"
            :class="bit === '1' ? 'bg-primary text-page' : 'bg-surface text-muted'"
          >
            {{ bit }}
          </span>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t-2 border-primary/50 w-48 mx-auto my-1" />

      <!-- Result -->
      <div class="flex items-center justify-center gap-2">
        <span class="text-accent text-sm w-12 text-right font-bold">{{ xorResult }}</span>
        <div class="flex gap-0.5">
          <span
            v-for="(bit, idx) in binaryResult"
            :key="'r-' + idx"
            class="w-6 h-7 flex items-center justify-center rounded text-sm font-bold"
            :class="bit === '1' ? 'bg-accent text-page' : 'bg-surface text-muted'"
          >
            {{ bit }}
          </span>
        </div>
      </div>
    </div>

    <!-- Explanation -->
    <p class="text-xs text-muted text-center">
      {{ t('learn.microTeaching.xorDemo.explanation') }}
    </p>
  </div>
</template>
