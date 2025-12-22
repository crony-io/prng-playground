<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = withDefaults(
  defineProps<{
    presetSeeds?: number[];
  }>(),
  {
    presetSeeds: () => [5, 100, 999],
  },
);

const { t } = useI18n();

const customSeed = ref<number | null>(null);
const inputValue = ref('');

const activeSeed = ref(props.presetSeeds[0] ?? 1);

function simplePrng(seed: number): number[] {
  const results: number[] = [];
  let state = seed;
  for (let i = 0; i < 5; i++) {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    results.push(state % 100);
  }
  return results;
}

const sequence = computed(() => simplePrng(activeSeed.value));

function selectPreset(seed: number) {
  activeSeed.value = seed;
  customSeed.value = null;
}

function applyCustomSeed() {
  const val = parseInt(inputValue.value, 10);
  if (!isNaN(val) && val >= 0) {
    customSeed.value = val;
    activeSeed.value = val;
  }
}

watch(
  () => props.presetSeeds,
  (newSeeds) => {
    if (newSeeds.length > 0 && !customSeed.value) {
      activeSeed.value = newSeeds[0] ?? 1;
    }
  },
);
</script>

<template>
  <div class="flex flex-col items-center gap-6 w-full max-w-lg">
    <!-- Preset Seeds -->
    <div class="flex flex-col items-center gap-3">
      <span class="text-sm text-muted">{{ t('learn.activities.seedDemo.tryPresets') }}</span>
      <div class="flex gap-3 flex-wrap justify-center">
        <button
          v-for="seed in presetSeeds"
          :key="seed"
          class="px-4 py-2 rounded-lg font-mono text-sm transition-colors"
          :class="
            activeSeed === seed && !customSeed
              ? 'bg-primary text-page'
              : 'bg-surface hover:bg-primary/20 text-body'
          "
          @click="selectPreset(seed)"
        >
          {{ seed }}
        </button>
      </div>
    </div>

    <!-- Custom Seed Input -->
    <div class="flex flex-col items-center gap-2">
      <span class="text-sm text-muted">{{ t('learn.activities.seedDemo.orTryOwn') }}</span>
      <div class="flex gap-2">
        <input
          v-model="inputValue"
          type="number"
          min="0"
          class="w-28 px-3 py-2 text-center font-mono bg-page border border-border rounded-lg focus:border-primary focus:outline-none"
          :placeholder="t('learn.activities.seedDemo.enterSeed')"
          @keyup.enter="applyCustomSeed"
        />
        <button class="btn-primary text-sm" @click="applyCustomSeed">
          {{ t('learn.activities.seedDemo.try') }}
        </button>
      </div>
    </div>

    <!-- Result Display -->
    <div class="flex flex-col items-center gap-3 p-5 glass rounded-xl w-full">
      <div class="flex items-baseline gap-2">
        <span class="text-sm text-muted">{{ t('learn.activities.seedDemo.seedValue') }}:</span>
        <span class="text-2xl font-bold text-primary font-mono">{{ activeSeed }}</span>
      </div>

      <div class="text-sm text-muted">{{ t('learn.activities.seedDemo.produces') }}</div>

      <div class="flex gap-2 flex-wrap justify-center">
        <span
          v-for="(num, idx) in sequence"
          :key="idx"
          class="px-3 py-1 bg-surface rounded font-mono text-body"
        >
          {{ num }}
        </span>
      </div>

      <p class="text-xs text-muted text-center mt-2">
        {{ t('learn.activities.seedDemo.hint') }}
      </p>
    </div>
  </div>
</template>
