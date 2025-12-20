<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { LessonDefinition, LessonActivityType } from '@/types/lessons';
import type { PrngSample } from '@/composables/usePrngRunner';
import CorrelationPlot from '@/components/CorrelationPlot.vue';
import TimeSeriesChart from '@/components/TimeSeriesChart.vue';
import BitTogglePanel from '@/components/learn/BitTogglePanel.vue';
import ModuloWheel from '@/components/learn/ModuloWheel.vue';
import CandyDistribution from '@/components/learn/CandyDistribution.vue';
import VisualCalculator from '@/components/learn/VisualCalculator.vue';
import MultiplicationGrid from '@/components/learn/MultiplicationGrid.vue';
import LessonSandbox from '@/components/learn/LessonSandbox.vue';
import BinaryGuessingGame from '@/components/learn/BinaryGuessingGame.vue';
import BitShiftDemo from '@/components/learn/BitShiftDemo.vue';
import XorExperiment from '@/components/learn/XorExperiment.vue';
import ShiftXorCombine from '@/components/learn/ShiftXorCombine.vue';
import QualityLab from '@/components/learn/QualityLab.vue';
import DesignerChallenge from '@/components/learn/DesignerChallenge.vue';
import TestInterpretation from '@/components/learn/TestInterpretation.vue';
import FinalProject from '@/components/learn/FinalProject.vue';
import AlgorithmExplorer from '@/components/learn/AlgorithmExplorer.vue';
import { getAlgorithm } from '@/algorithms';

const props = defineProps<{
  activityType: LessonActivityType;
  activityConfig?: Record<string, unknown>;
  lesson: LessonDefinition;
}>();

const { t } = useI18n();

const revealedValue = ref<number | null>(null);
const inputValue = ref<string>('');

const counterValue = ref(0);
const counterHistory = ref<number[]>([]);

const professionalSamples = ref<PrngSample[]>([]);
const algorithmState = ref<unknown>(null);
const comparisonAlgorithmId = ref('xorshift32');

const overflowValue = ref(1);
const overflowHistory = ref<number[]>([1]);
const overflowMultiplier = ref(2);

const recipeState = ref(1);
const recipeHistory = ref<{ op: string; result: number }[]>([{ op: 'start', result: 1 }]);

function handleReveal() {
  const config = props.activityConfig as { revealValue?: number } | undefined;
  revealedValue.value = config?.revealValue ?? 42;
}

function handleCounterStep() {
  counterValue.value += 1;
  counterHistory.value.push(counterValue.value);
  if (counterHistory.value.length > 50) {
    counterHistory.value.shift();
  }
  // Also regenerate professional samples for comparison
  generateProfessionalSamples();
}

function handleCounterReset() {
  counterValue.value = 0;
  counterHistory.value = [];
  generateProfessionalSamples();
}

function initializeComparison() {
  // Get algorithm from config if specified
  const config = props.activityConfig as { algorithms?: string[] } | undefined;
  if (config?.algorithms?.[1]) {
    comparisonAlgorithmId.value = config.algorithms[1];
  }

  // Reset algorithm state
  algorithmState.value = null;

  // Pre-populate with some counter steps to show the pattern
  counterValue.value = 0;
  counterHistory.value = [];
  for (let i = 0; i < 20; i++) {
    counterValue.value += 1;
    counterHistory.value.push(counterValue.value);
  }
  generateProfessionalSamples();
}

function handleOverflowStep() {
  const maxValue = 256;
  overflowValue.value = (overflowValue.value * overflowMultiplier.value) % maxValue;
  overflowHistory.value.push(overflowValue.value);
  if (overflowHistory.value.length > 20) {
    overflowHistory.value.shift();
  }
}

function handleOverflowReset() {
  overflowValue.value = 1;
  overflowHistory.value = [1];
}

function handleRecipeOperation(op: 'mul2' | 'add3' | 'mul3' | 'add7') {
  let newValue = recipeState.value;
  let opLabel = '';

  switch (op) {
    case 'mul2':
      newValue = (recipeState.value * 2) % 256;
      opLabel = '×2';
      break;
    case 'add3':
      newValue = (recipeState.value + 3) % 256;
      opLabel = '+3';
      break;
    case 'mul3':
      newValue = (recipeState.value * 3) % 256;
      opLabel = '×3';
      break;
    case 'add7':
      newValue = (recipeState.value + 7) % 256;
      opLabel = '+7';
      break;
  }

  recipeState.value = newValue;
  recipeHistory.value.push({ op: opLabel, result: newValue });
  if (recipeHistory.value.length > 10) {
    recipeHistory.value.shift();
  }
}

function handleRecipeReset() {
  recipeState.value = 1;
  recipeHistory.value = [{ op: 'start', result: 1 }];
}

function generateProfessionalSamples() {
  const alg = getAlgorithm(comparisonAlgorithmId.value);
  if (!alg) {
    // Fallback to Math.random if algorithm not found
    const samples: PrngSample[] = [];
    for (let i = 0; i < 100; i++) {
      samples.push({ index: i, value: Math.random() });
    }
    professionalSamples.value = samples;
    return;
  }

  // Initialize or continue with algorithm
  if (!algorithmState.value) {
    algorithmState.value = alg.init(Date.now());
  }

  const samples: PrngSample[] = [];
  let state = algorithmState.value;
  for (let i = 0; i < 100; i++) {
    const result = alg.next(state);
    samples.push({ index: i, value: result.value });
    state = result.state;
  }
  algorithmState.value = state;
  professionalSamples.value = samples;
}

if (props.activityType === 'comparison') {
  initializeComparison();
}

const sandboxVisualization = computed((): 'time-series' | 'bit' | 'none' => {
  if (props.activityConfig?.showTimeSeries) {
    return 'time-series';
  }
  if (props.activityConfig?.showBitVisualization) {
    return 'bit';
  }
  return 'none';
});

const forkExploreHintKey = computed((): string => {
  const algorithmId = (props.activityConfig as { algorithmId?: string })?.algorithmId;
  switch (algorithmId) {
    case 'lcg':
      return 'learn.activities.forkExploreHintLcg';
    case 'xorshift32':
      return 'learn.activities.forkExploreHintXorshift';
    case 'mulberry32':
      return 'learn.activities.forkExploreHintMulberry';
    case 'sfc32':
    case 'xoshiro128ss':
      return 'learn.activities.forkExploreHintMultiState';
    default:
      return 'learn.activities.forkExploreHint';
  }
});

const counterSamples = computed((): PrngSample[] => {
  return counterHistory.value.map((v, i) => ({
    index: i,
    value: (v % 100) / 100,
  }));
});
</script>

<template>
  <div class="w-full max-w-[700px]">
    <!-- Interactive Activities -->
    <div v-if="activityType === 'interactive'" class="flex flex-col items-center gap-6">
      <!-- Reveal Number -->
      <template v-if="activityConfig?.type === 'reveal-number'">
        <div
          class="w-[200px] h-[150px] flex items-center justify-center glass rounded-2xl border-3 transition-all duration-300"
          :class="
            revealedValue !== null
              ? 'border-primary bg-primary/10 dark:bg-primary/20'
              : 'border-border'
          "
        >
          <span v-if="revealedValue === null" class="text-3xl text-muted">? ? ?</span>
          <span v-else class="text-5xl font-bold text-primary">{{ revealedValue }}</span>
        </div>
        <button v-if="revealedValue === null" class="btn-primary" @click="handleReveal">
          {{ t('learn.activities.wakeUp') }}
        </button>
      </template>

      <!-- Engagement -->
      <template v-else-if="activityConfig?.type === 'engagement'">
        <p class="text-xl text-body text-center">{{ t(String(activityConfig.promptKey)) }}</p>
        <input
          v-model="inputValue"
          type="number"
          class="form-control w-[150px] text-xl text-center"
          :placeholder="t('learn.activities.enterNumber')"
        />
        <p v-if="inputValue" class="text-base text-accent">
          {{ t('learn.activities.yourNumber', { number: inputValue }) }}
        </p>
      </template>

      <!-- Seed Demo -->
      <template v-else-if="activityConfig?.type === 'seed-demo'">
        <div class="flex gap-4 flex-wrap justify-center">
          <div
            v-for="seed in activityConfig.seeds as number[]"
            :key="seed"
            class="flex flex-col items-center gap-2 px-6 py-4 glass rounded-xl"
          >
            <span class="text-sm text-muted">{{ t('learn.activities.seed') }}: {{ seed }}</span>
            <div class="text-2xl font-bold text-body">{{ seed }}</div>
          </div>
        </div>
      </template>

      <!-- Overflow Demo -->
      <template v-else-if="activityConfig?.type === 'overflow-demo'">
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
          {{ t('learn.activities.overflowExplanation', { max: 256 }) }}
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
      </template>

      <!-- Binary Guessing Game -->
      <template v-else-if="activityConfig?.type === 'binary-guessing-game'">
        <BinaryGuessingGame :max-number="(activityConfig?.maxNumber as number) ?? 16" />
      </template>

      <!-- Bit Toggle -->
      <template v-else-if="activityConfig?.type === 'bit-toggle'">
        <BitTogglePanel :bit-count="(activityConfig?.bitCount as 4 | 8) ?? 8" :initial-value="0" />
      </template>

      <!-- Bit Shift Demo -->
      <template v-else-if="activityConfig?.type === 'bit-shift-demo'">
        <BitShiftDemo :initial-value="12" :bit-count="8" />
      </template>

      <!-- XOR Experiment -->
      <template v-else-if="activityConfig?.type === 'xor-experiment'">
        <XorExperiment />
      </template>

      <!-- Quality Lab -->
      <template v-else-if="activityConfig?.type === 'quality-lab'">
        <QualityLab
          :algorithms="
            (activityConfig?.algorithms as string[]) ?? ['lcg', 'xorshift32', 'mulberry32', 'sfc32']
          "
        />
      </template>

      <!-- Designer Challenge -->
      <template v-else-if="activityConfig?.type === 'designer-challenge'">
        <DesignerChallenge />
      </template>

      <!-- Test Interpretation -->
      <template v-else-if="activityConfig?.type === 'test-interpretation'">
        <TestInterpretation />
      </template>

      <!-- Final Project -->
      <template v-else-if="activityConfig?.type === 'final-project'">
        <FinalProject />
      </template>

      <!-- Modulo Wheel -->
      <template v-else-if="activityConfig?.type === 'modulo-wheel'">
        <ModuloWheel :mod-value="(activityConfig?.modValue as number) ?? 10" />
      </template>

      <!-- Candy Distribution (for remainder/modulo lessons) -->
      <template v-else-if="activityConfig?.type === 'candy-distribution'">
        <CandyDistribution />
      </template>

      <!-- Visual Calculator -->
      <template v-else-if="activityConfig?.type === 'visual-calculator'">
        <VisualCalculator
          :initial-value="(activityConfig?.initialValue as number) ?? 1"
          :allowed-operations="
            (activityConfig?.allowedOperations as (
              | 'add'
              | 'sub'
              | 'mul'
              | 'mod'
              | 'xor'
              | 'shl'
              | 'shr'
            )[]) ?? ['add', 'mul', 'mod']
          "
        />
      </template>

      <!-- Multiplication Grid -->
      <template v-else-if="activityConfig?.type === 'multiplication-grid'">
        <MultiplicationGrid :size="(activityConfig?.size as number) ?? 5" />
      </template>
    </div>

    <!-- Sandbox Activities -->
    <div v-else-if="activityType === 'sandbox'" class="flex flex-col items-center gap-6">
      <!-- Use LessonSandbox component for general sandbox -->
      <template v-if="activityConfig?.type === 'sandbox' || !activityConfig?.type">
        <LessonSandbox :lesson="lesson" :show-visualization="sandboxVisualization" />
      </template>

      <!-- Shift-XOR Combine -->
      <template v-else-if="activityConfig?.type === 'shift-xor-combine'">
        <ShiftXorCombine :initial-value="42" />
      </template>

      <!-- Recipe Builder -->
      <template v-else-if="activityConfig?.type === 'recipe-builder'">
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
      </template>

      <!-- Default Counter -->
      <template v-else>
        <div class="flex items-baseline gap-3">
          <span class="text-base text-muted">{{ t('learn.activities.currentNumber') }}:</span>
          <span class="text-4xl font-bold text-primary">{{ counterValue }}</span>
        </div>
        <div class="flex gap-4">
          <button class="btn-primary" @click="handleCounterStep">
            {{ t('learn.activities.nextNumber') }}
          </button>
          <button class="btn-outline" @click="handleCounterReset">
            {{ t('learn.activities.reset') }}
          </button>
        </div>
        <div class="w-full h-[200px]">
          <TimeSeriesChart :samples="counterSamples" :max-points="50" />
        </div>
      </template>
    </div>

    <!-- Fork Explore -->
    <div
      v-else-if="activityType === 'fork-explore'"
      class="flex flex-col items-center gap-6 w-full"
    >
      <p class="text-body text-center max-w-[500px] mb-2">
        {{ t('learn.activities.forkExplore') }}
      </p>
      <AlgorithmExplorer
        :algorithm-id="(activityConfig as { algorithmId?: string })?.algorithmId ?? 'lcg'"
        :show-time-series="true"
        :show-correlation="true"
      />
      <p class="text-sm text-muted text-center mt-2">{{ t(forkExploreHintKey) }}</p>
    </div>

    <!-- Comparison -->
    <div v-else-if="activityType === 'comparison'" class="flex flex-col gap-6">
      <p class="text-body text-center mb-2">{{ t('learn.activities.comparisonIntro') }}</p>
      <div class="grid grid-cols-2 gap-6">
        <div class="flex flex-col items-center gap-3">
          <h3 class="text-base font-semibold text-body m-0">{{ t('learn.activities.counter') }}</h3>
          <p class="text-xs text-muted m-0">{{ t('learn.activities.counterDesc') }}</p>
          <CorrelationPlot :samples="counterSamples" :max-points="50" />
        </div>
        <div class="flex flex-col items-center gap-3">
          <h3 class="text-base font-semibold text-primary m-0">{{ comparisonAlgorithmId }}</h3>
          <p class="text-xs text-muted m-0">{{ t('learn.activities.algorithmDesc') }}</p>
          <CorrelationPlot :samples="professionalSamples" :max-points="100" />
        </div>
      </div>
      <div class="flex gap-3 justify-center">
        <button class="btn-primary" @click="handleCounterStep">
          {{ t('learn.activities.stepBoth') }}
        </button>
        <button class="btn-outline" @click="initializeComparison">
          {{ t('learn.activities.reset') }}
        </button>
      </div>
      <p class="text-sm text-muted text-center">{{ t('learn.activities.comparisonHint') }}</p>
    </div>
  </div>
</template>
