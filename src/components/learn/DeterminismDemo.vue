<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const seed = ref(42);
const stepsA = ref<number[]>([]);
const stepsB = ref<number[]>([]);

function simpleGenerator(state: number): number {
  return ((state * 1103515245 + 12345) >>> 0) % 256;
}

function stepBoth() {
  const currentA = stepsA.value.length > 0 ? stepsA.value[stepsA.value.length - 1]! : seed.value;
  const currentB = stepsB.value.length > 0 ? stepsB.value[stepsB.value.length - 1]! : seed.value;

  stepsA.value.push(simpleGenerator(currentA));
  stepsB.value.push(simpleGenerator(currentB));

  if (stepsA.value.length > 8) {
    stepsA.value.shift();
    stepsB.value.shift();
  }
}

function reset() {
  stepsA.value = [];
  stepsB.value = [];
}

function changeSeed(newSeed: number) {
  seed.value = newSeed;
  reset();
}

const areIdentical = computed(() => {
  if (stepsA.value.length === 0) {
    return false;
  }
  return stepsA.value.every((v, i) => v === stepsB.value[i]);
});
</script>

<template>
  <div class="flex flex-col items-center gap-6 p-6 glass rounded-xl w-full max-w-[500px]">
    <div class="text-lg font-semibold text-body text-center">
      {{ t('learn.activities.determinismDemo.title') }}
    </div>

    <p class="text-sm text-muted text-center">
      {{ t('learn.activities.determinismDemo.intro') }}
    </p>

    <!-- Seed selector -->
    <div class="flex items-center gap-3">
      <span class="text-sm text-muted">{{ t('learn.activities.seed') }}:</span>
      <div class="flex gap-2">
        <button
          v-for="s in [42, 100, 7]"
          :key="s"
          class="px-3 py-1 text-sm rounded transition-colors"
          :class="seed === s ? 'bg-primary text-page' : 'bg-surface text-body hover:bg-primary/20'"
          @click="changeSeed(s)"
        >
          {{ s }}
        </button>
      </div>
    </div>

    <!-- Two boxes side by side -->
    <div class="grid grid-cols-2 gap-6 w-full">
      <!-- Box A -->
      <div class="flex flex-col items-center gap-2 p-4 bg-surface rounded-lg">
        <div class="text-sm font-semibold text-primary">
          {{ t('learn.activities.determinismDemo.boxA') }}
        </div>
        <div class="text-xs text-muted">{{ t('learn.activities.seed') }}: {{ seed }}</div>
        <div class="flex flex-wrap gap-1 justify-center min-h-[60px]">
          <span
            v-for="(num, idx) in stepsA"
            :key="idx"
            class="px-2 py-1 bg-primary/20 text-primary text-sm font-mono rounded"
          >
            {{ num }}
          </span>
          <span v-if="stepsA.length === 0" class="text-muted text-sm">...</span>
        </div>
      </div>

      <!-- Box B -->
      <div class="flex flex-col items-center gap-2 p-4 bg-surface rounded-lg">
        <div class="text-sm font-semibold text-accent">
          {{ t('learn.activities.determinismDemo.boxB') }}
        </div>
        <div class="text-xs text-muted">{{ t('learn.activities.seed') }}: {{ seed }}</div>
        <div class="flex flex-wrap gap-1 justify-center min-h-[60px]">
          <span
            v-for="(num, idx) in stepsB"
            :key="idx"
            class="px-2 py-1 bg-accent/20 text-accent text-sm font-mono rounded"
          >
            {{ num }}
          </span>
          <span v-if="stepsB.length === 0" class="text-muted text-sm">...</span>
        </div>
      </div>
    </div>

    <!-- Result indicator -->
    <div
      v-if="stepsA.length > 0"
      class="p-3 rounded-lg text-center"
      :class="areIdentical ? 'bg-accent/10 text-accent' : 'bg-error/10 text-error'"
    >
      <span class="text-sm font-semibold">
        {{
          areIdentical
            ? t('learn.activities.determinismDemo.identical')
            : t('learn.activities.determinismDemo.different')
        }}
      </span>
    </div>

    <!-- Controls -->
    <div class="flex gap-3">
      <button class="btn-primary" @click="stepBoth">
        {{ t('learn.activities.determinismDemo.stepBoth') }}
      </button>
      <button class="btn-outline" @click="reset">
        {{ t('learn.activities.reset') }}
      </button>
    </div>

    <p class="text-xs text-muted text-center">
      {{ t('learn.activities.determinismDemo.hint') }}
    </p>
  </div>
</template>
