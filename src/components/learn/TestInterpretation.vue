<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

interface Scenario {
  id: string;
  testResults: {
    mean: boolean;
    variance: boolean;
    chiSquare: boolean;
  };
  correctAnswer: string;
  options: string[];
}

const scenarios: Scenario[] = [
  {
    id: 'scenario1',
    testResults: { mean: true, variance: true, chiSquare: false },
    correctAnswer: 'clumpy',
    options: ['clumpy', 'biased', 'perfect'],
  },
  {
    id: 'scenario2',
    testResults: { mean: false, variance: true, chiSquare: true },
    correctAnswer: 'biased',
    options: ['clumpy', 'biased', 'tooNarrow'],
  },
  {
    id: 'scenario3',
    testResults: { mean: true, variance: false, chiSquare: true },
    correctAnswer: 'tooNarrow',
    options: ['clumpy', 'tooNarrow', 'perfect'],
  },
];

const currentScenarioIndex = ref(0);
const selectedAnswer = ref<string | null>(null);
const showFeedback = ref(false);
const completedScenarios = ref<Set<number>>(new Set());

const currentScenario = computed((): Scenario => {
  return scenarios[currentScenarioIndex.value] ?? scenarios[0]!;
});

const isCorrect = computed(() => {
  return selectedAnswer.value === currentScenario.value?.correctAnswer;
});

const allCompleted = computed(() => {
  return completedScenarios.value.size === scenarios.length;
});

function selectAnswer(answer: string) {
  if (showFeedback.value) {
    return;
  }
  selectedAnswer.value = answer;
}

function checkAnswer() {
  showFeedback.value = true;
  if (isCorrect.value) {
    completedScenarios.value.add(currentScenarioIndex.value);
  }
}

function nextScenario() {
  selectedAnswer.value = null;
  showFeedback.value = false;
  if (currentScenarioIndex.value < scenarios.length - 1) {
    currentScenarioIndex.value++;
  } else {
    currentScenarioIndex.value = 0;
  }
}

function reset() {
  currentScenarioIndex.value = 0;
  selectedAnswer.value = null;
  showFeedback.value = false;
  completedScenarios.value.clear();
}
</script>

<template>
  <div class="flex flex-col items-center gap-6 w-full max-w-[600px]">
    <h3 class="text-lg font-semibold text-body">
      {{ t('learn.activities.testInterpretation.title') }}
    </h3>
    <p class="text-base text-muted text-center">
      {{ t('learn.activities.testInterpretation.intro') }}
    </p>

    <!-- Test Explanations (collapsible reference) -->
    <details class="w-full glass rounded-xl">
      <summary class="p-3 cursor-pointer text-sm text-muted hover:text-body">
        {{ t('learn.activities.testInterpretation.reference') }}
      </summary>
      <div class="flex flex-col gap-3 p-4 pt-0">
        <div class="p-3 bg-surface rounded-lg">
          <span class="font-semibold text-primary">{{
            t('learn.activities.qualityLab.testMean')
          }}</span>
          <span class="text-sm text-body">
            — {{ t('learn.activities.testInterpretation.meanExplain') }}</span
          >
        </div>
        <div class="p-3 bg-surface rounded-lg">
          <span class="font-semibold text-primary">{{
            t('learn.activities.qualityLab.testVariance')
          }}</span>
          <span class="text-sm text-body">
            — {{ t('learn.activities.testInterpretation.varianceExplain') }}</span
          >
        </div>
        <div class="p-3 bg-surface rounded-lg">
          <span class="font-semibold text-primary">{{
            t('learn.activities.qualityLab.testChiSquare')
          }}</span>
          <span class="text-sm text-body">
            — {{ t('learn.activities.testInterpretation.chiSquareExplain') }}</span
          >
        </div>
      </div>
    </details>

    <!-- Progress -->
    <div class="flex items-center gap-2">
      <span
        v-for="(_, idx) in scenarios"
        :key="idx"
        class="w-3 h-3 rounded-full transition-colors"
        :class="
          completedScenarios.has(idx)
            ? 'bg-green-500'
            : idx === currentScenarioIndex
              ? 'bg-primary'
              : 'bg-surface'
        "
      />
    </div>

    <!-- Scenario Card -->
    <div v-if="!allCompleted" class="w-full p-5 glass rounded-xl">
      <div class="text-sm text-muted mb-3">
        {{ t('learn.activities.testInterpretation.scenario', { n: currentScenarioIndex + 1 }) }}
      </div>

      <!-- Test Results Display -->
      <div class="flex flex-wrap gap-3 justify-center mb-5">
        <div
          class="px-4 py-2 rounded-lg text-sm font-semibold"
          :class="
            currentScenario.testResults.mean
              ? 'bg-green-500/20 text-green-600 dark:text-green-400'
              : 'bg-red-500/20 text-red-600 dark:text-red-400'
          "
        >
          {{ t('learn.activities.qualityLab.testMean') }}:
          {{
            currentScenario.testResults.mean
              ? t('learn.activities.qualityLab.passed')
              : t('learn.activities.qualityLab.failed')
          }}
        </div>
        <div
          class="px-4 py-2 rounded-lg text-sm font-semibold"
          :class="
            currentScenario.testResults.variance
              ? 'bg-green-500/20 text-green-600 dark:text-green-400'
              : 'bg-red-500/20 text-red-600 dark:text-red-400'
          "
        >
          {{ t('learn.activities.qualityLab.testVariance') }}:
          {{
            currentScenario.testResults.variance
              ? t('learn.activities.qualityLab.passed')
              : t('learn.activities.qualityLab.failed')
          }}
        </div>
        <div
          class="px-4 py-2 rounded-lg text-sm font-semibold"
          :class="
            currentScenario.testResults.chiSquare
              ? 'bg-green-500/20 text-green-600 dark:text-green-400'
              : 'bg-red-500/20 text-red-600 dark:text-red-400'
          "
        >
          {{ t('learn.activities.qualityLab.testChiSquare') }}:
          {{
            currentScenario.testResults.chiSquare
              ? t('learn.activities.qualityLab.passed')
              : t('learn.activities.qualityLab.failed')
          }}
        </div>
      </div>

      <!-- Question -->
      <p class="text-body text-center mb-4">
        {{ t('learn.activities.testInterpretation.question') }}
      </p>

      <!-- Options -->
      <div class="flex flex-col gap-2">
        <button
          v-for="option in currentScenario.options"
          :key="option"
          class="p-3 rounded-lg text-left text-sm transition-colors"
          :class="[
            selectedAnswer === option
              ? showFeedback
                ? option === currentScenario.correctAnswer
                  ? 'bg-green-500/20 border-2 border-green-500'
                  : 'bg-red-500/20 border-2 border-red-500'
                : 'bg-primary/20 border-2 border-primary'
              : 'bg-surface hover:bg-primary/10',
            showFeedback && option === currentScenario.correctAnswer && selectedAnswer !== option
              ? 'ring-2 ring-green-500'
              : '',
          ]"
          :disabled="showFeedback"
          @click="selectAnswer(option)"
        >
          {{ t('learn.activities.testInterpretation.options.' + option) }}
        </button>
      </div>

      <!-- Feedback -->
      <div
        v-if="showFeedback"
        class="mt-4 p-3 rounded-lg"
        :class="isCorrect ? 'bg-green-500/10' : 'bg-amber-500/10'"
      >
        <p
          class="text-sm"
          :class="
            isCorrect ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'
          "
        >
          {{
            isCorrect
              ? t('learn.activities.testInterpretation.correct')
              : t('learn.activities.testInterpretation.incorrect')
          }}
        </p>
        <p class="text-sm text-muted mt-1">
          {{
            t('learn.activities.testInterpretation.explanations.' + currentScenario.correctAnswer)
          }}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 justify-center mt-4">
        <button
          v-if="!showFeedback"
          class="btn-primary"
          :disabled="!selectedAnswer"
          @click="checkAnswer"
        >
          {{ t('learn.checkAnswer') }}
        </button>
        <button v-else class="btn-primary" @click="nextScenario">
          {{ t('learn.activities.testInterpretation.nextScenario') }}
        </button>
      </div>
    </div>

    <!-- Completion -->
    <div v-else class="w-full p-6 glass rounded-xl text-center">
      <div class="text-4xl mb-3">🎉</div>
      <p class="text-lg font-semibold text-primary mb-2">
        {{ t('learn.activities.testInterpretation.allComplete') }}
      </p>
      <p class="text-sm text-muted mb-4">
        {{ t('learn.activities.testInterpretation.summary') }}
      </p>
      <button class="btn-outline" @click="reset">
        {{ t('learn.activities.testInterpretation.tryAgain') }}
      </button>
    </div>
  </div>
</template>
