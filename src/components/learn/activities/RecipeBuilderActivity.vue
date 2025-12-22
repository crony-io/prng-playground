<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { LIMITS } from '@/constants/limits';

const { t } = useI18n();

const recipeState = ref(1);
const recipeHistory = ref<{ op: string; result: number }[]>([{ op: 'start', result: 1 }]);

function handleRecipeOperation(op: 'mul2' | 'add3' | 'mul3' | 'add7') {
  let newValue = recipeState.value;
  let opLabel = '';

  switch (op) {
    case 'mul2':
      newValue = (recipeState.value * 2) % LIMITS.OVERFLOW_MAX_VALUE;
      opLabel = '×2';
      break;
    case 'add3':
      newValue = (recipeState.value + 3) % LIMITS.OVERFLOW_MAX_VALUE;
      opLabel = '+3';
      break;
    case 'mul3':
      newValue = (recipeState.value * 3) % LIMITS.OVERFLOW_MAX_VALUE;
      opLabel = '×3';
      break;
    case 'add7':
      newValue = (recipeState.value + 7) % LIMITS.OVERFLOW_MAX_VALUE;
      opLabel = '+7';
      break;
  }

  recipeState.value = newValue;
  recipeHistory.value.push({ op: opLabel, result: newValue });
  if (recipeHistory.value.length > LIMITS.MAX_RECIPE_HISTORY) {
    recipeHistory.value.shift();
  }
}

function handleRecipeReset() {
  recipeState.value = 1;
  recipeHistory.value = [{ op: 'start', result: 1 }];
}
</script>

<template>
  <div class="flex flex-col items-center gap-6">
    <div class="flex items-baseline gap-3">
      <span class="text-base text-muted">{{ t('learn.activities.currentNumber') }}:</span>
      <span class="text-4xl font-bold text-primary">{{ recipeState }}</span>
    </div>
    <div class="flex gap-3 flex-wrap justify-center">
      <button
        class="btn-primary text-xl px-5 py-3 hover:scale-105 transition-transform"
        @click="handleRecipeOperation('mul2')"
      >
        ×2
      </button>
      <button
        class="btn bg-accent text-page text-xl px-5 py-3 hover:scale-105 transition-transform"
        @click="handleRecipeOperation('add3')"
      >
        +3
      </button>
      <button
        class="btn-primary text-xl px-5 py-3 hover:scale-105 transition-transform"
        @click="handleRecipeOperation('mul3')"
      >
        ×3
      </button>
      <button
        class="btn bg-accent text-page text-xl px-5 py-3 hover:scale-105 transition-transform"
        @click="handleRecipeOperation('add7')"
      >
        +7
      </button>
    </div>
    <button class="btn-outline" @click="handleRecipeReset">
      {{ t('learn.activities.reset') }}
    </button>
    <div class="font-mono text-sm text-muted max-w-full overflow-x-auto">
      <div v-for="(step, idx) in recipeHistory" :key="idx" class="flex items-center gap-2 py-1">
        <span class="font-semibold text-primary">{{ step.op }}</span>
        <span class="text-muted">→</span>
        <span class="font-medium text-body">{{ step.result }}</span>
      </div>
    </div>
  </div>
</template>
