<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = withDefaults(
  defineProps<{
    maxNumber?: number;
  }>(),
  {
    maxNumber: 16,
  },
);

const { t } = useI18n();

const guessingGuesses = ref<{ question: string; answer: boolean }[]>([]);
const guessingLow = ref(1);
const guessingHigh = ref(props.maxNumber);
const guessingComplete = ref(false);

function handleGuessingQuestion(isYes: boolean) {
  const mid = Math.floor((guessingLow.value + guessingHigh.value) / 2);
  const question = `Is it > ${mid}?`;
  guessingGuesses.value.push({ question, answer: isYes });

  if (isYes) {
    guessingLow.value = mid + 1;
  } else {
    guessingHigh.value = mid;
  }

  if (guessingLow.value === guessingHigh.value) {
    guessingComplete.value = true;
  }
}

function resetGame() {
  guessingGuesses.value = [];
  guessingLow.value = 1;
  guessingHigh.value = props.maxNumber;
  guessingComplete.value = false;
}
</script>

<template>
  <div class="flex flex-col items-center gap-4 w-full">
    <div class="text-center mb-4">
      <p class="text-lg text-body mb-2">{{ t('learn.activities.binaryGame.thinkOfNumber') }}</p>
      <p class="text-sm text-muted">
        {{ t('learn.activities.binaryGame.range', { min: 1, max: props.maxNumber }) }}
      </p>
    </div>

    <div v-if="!guessingComplete" class="flex flex-col items-center gap-4">
      <div class="text-xl font-semibold text-primary">
        {{
          t('learn.activities.binaryGame.question', {
            mid: Math.floor((guessingLow + guessingHigh) / 2),
          })
        }}
      </div>
      <div class="flex gap-4">
        <button class="btn-primary px-8" @click="handleGuessingQuestion(true)">
          {{ t('learn.activities.binaryGame.yes') }}
        </button>
        <button class="btn-outline px-8" @click="handleGuessingQuestion(false)">
          {{ t('learn.activities.binaryGame.no') }}
        </button>
      </div>
    </div>

    <div v-else class="flex flex-col items-center gap-4">
      <div class="text-2xl font-bold text-accent">
        {{ t('learn.activities.binaryGame.found', { number: guessingLow }) }}
      </div>
      <p class="text-sm text-muted">
        {{ t('learn.activities.binaryGame.guessCount', { count: guessingGuesses.length }) }}
      </p>
      <button class="btn-primary" @click="resetGame">
        {{ t('learn.activities.binaryGame.playAgain') }}
      </button>
    </div>

    <div v-if="guessingGuesses.length > 0" class="mt-4 p-4 glass rounded-xl w-full max-w-[300px]">
      <div class="text-sm font-semibold text-muted mb-2">
        {{ t('learn.activities.binaryGame.history') }}
      </div>
      <div
        v-for="(guess, idx) in guessingGuesses"
        :key="idx"
        class="flex justify-between text-sm py-1"
      >
        <span class="text-body">{{ guess.question }}</span>
        <span :class="guess.answer ? 'text-accent' : 'text-muted'">{{
          guess.answer ? 'Yes' : 'No'
        }}</span>
      </div>
    </div>
  </div>
</template>
