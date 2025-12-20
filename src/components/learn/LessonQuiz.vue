<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { QuizQuestion } from '@/types/lessons';

const props = defineProps<{
  questions: QuizQuestion[];
}>();

const emit = defineEmits<{
  complete: [];
}>();

const { t } = useI18n();

const currentQuestionIndex = ref(0);
const selectedOption = ref<string | null>(null);
const numericAnswer = ref<string>('');
const answered = ref(false);
const isCorrect = ref(false);

const currentQuestion = computed(() => props.questions[currentQuestionIndex.value]);

const isLastQuestion = computed(() => currentQuestionIndex.value >= props.questions.length - 1);

function checkAnswer() {
  if (!currentQuestion.value) {
    return;
  }

  answered.value = true;

  const question = currentQuestion.value;

  if (question.type === 'concept' || question.type === 'experiment') {
    const correctOption = question.options?.find((opt) => opt.correct);
    isCorrect.value = selectedOption.value === correctOption?.key;
  } else if (question.type === 'prediction') {
    const answer = parseFloat(numericAnswer.value);
    const expected = question.expectedValue as number;
    const tolerance = question.tolerancePercent ?? 0;

    if (tolerance > 0) {
      const range = expected * (tolerance / 100);
      isCorrect.value = Math.abs(answer - expected) <= range;
    } else {
      isCorrect.value = answer === expected;
    }
  }
}

function nextQuestion() {
  if (isLastQuestion.value) {
    emit('complete');
  } else {
    currentQuestionIndex.value += 1;
    selectedOption.value = null;
    numericAnswer.value = '';
    answered.value = false;
    isCorrect.value = false;
  }
}

function selectOption(optionKey: string) {
  if (!answered.value) {
    selectedOption.value = optionKey;
  }
}
</script>

<template>
  <div class="w-full max-w-[500px]">
    <div v-if="currentQuestion" class="glass rounded-xl p-6">
      <p class="text-lg font-medium text-body mb-6 text-center whitespace-pre-line">
        {{ t(currentQuestion.questionKey) }}
      </p>

      <!-- Multiple Choice Options -->
      <div
        v-if="
          currentQuestion.type === 'concept' ||
          currentQuestion.type === 'experiment' ||
          currentQuestion.type === 'debugging'
        "
        class="flex flex-col gap-3"
      >
        <button
          v-for="option in currentQuestion.options"
          :key="option.key"
          class="w-full p-4 text-base text-left text-body bg-page dark:bg-page border-2 rounded-lg transition-all duration-200"
          :class="{
            'border-primary bg-primary/10 dark:bg-primary/20':
              selectedOption === option.key && !answered,
            'border-accent bg-accent/10 dark:bg-accent/20': answered && option.correct,
            'border-error bg-error/10 dark:bg-error/20':
              answered && selectedOption === option.key && !option.correct,
            'border-border hover:border-primary': !answered && selectedOption !== option.key,
          }"
          :disabled="answered"
          @click="selectOption(option.key)"
        >
          {{ t(option.key) }}
        </button>
      </div>

      <!-- Numeric Input -->
      <div v-else-if="currentQuestion.type === 'prediction'" class="flex justify-center">
        <input
          v-model="numericAnswer"
          type="number"
          class="form-control w-[150px] text-xl text-center"
          :placeholder="t('learn.enterAnswer')"
          :disabled="answered"
          @keyup.enter="checkAnswer"
        />
      </div>

      <!-- Feedback -->
      <div
        v-if="answered"
        class="flex items-center gap-3 mt-6 p-4 rounded-lg"
        :class="
          isCorrect
            ? 'bg-accent/10 dark:bg-accent/20 text-accent'
            : 'bg-error/10 dark:bg-error/20 text-error'
        "
      >
        <span class="text-xl font-bold">{{ isCorrect ? '✓' : '✗' }}</span>
        <span class="text-sm">
          {{
            t(
              isCorrect
                ? currentQuestion.feedbackCorrectKey!
                : currentQuestion.feedbackIncorrectKey!,
            )
          }}
        </span>
      </div>

      <!-- Actions -->
      <div class="flex justify-center mt-6">
        <button
          v-if="!answered"
          class="btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!selectedOption && !numericAnswer"
          @click="checkAnswer"
        >
          {{ t('learn.checkAnswer') }}
        </button>

        <button v-else class="btn-primary px-8" @click="nextQuestion">
          {{ isLastQuestion ? t('learn.continue') : t('learn.nextQuestion') }}
        </button>
      </div>
    </div>
  </div>
</template>
