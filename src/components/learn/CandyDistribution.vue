<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = withDefaults(
  defineProps<{
    maxCandies?: number;
    maxFriends?: number;
  }>(),
  {
    maxCandies: 20,
    maxFriends: 6,
  },
);

const { t } = useI18n();

const candyCount = ref(7);
const friendCount = ref(3);

const distribution = computed(() => {
  if (friendCount.value <= 0) {
    return { perPerson: 0, remainder: candyCount.value };
  }
  const perPerson = Math.floor(candyCount.value / friendCount.value);
  const remainder = candyCount.value % friendCount.value;
  return { perPerson, remainder };
});

const friends = computed(() => {
  const result = [];
  for (let i = 0; i < friendCount.value; i++) {
    result.push({
      id: i,
      candies: distribution.value.perPerson,
    });
  }
  return result;
});

function incrementCandies() {
  if (candyCount.value < props.maxCandies) {
    candyCount.value += 1;
  }
}

function decrementCandies() {
  if (candyCount.value > 0) {
    candyCount.value -= 1;
  }
}

function incrementFriends() {
  if (friendCount.value < props.maxFriends) {
    friendCount.value += 1;
  }
}

function decrementFriends() {
  if (friendCount.value > 1) {
    friendCount.value -= 1;
  }
}
</script>

<template>
  <div class="flex flex-col items-center gap-6 p-6 glass rounded-xl max-w-[500px]">
    <div class="text-lg font-semibold text-body">{{ t('learn.candy.title') }}</div>

    <!-- Controls -->
    <div class="flex gap-8">
      <div class="flex flex-col items-center gap-2">
        <span class="text-sm text-muted">{{ t('learn.candy.candies') }}</span>
        <div class="flex items-center gap-2">
          <button
            class="w-8 h-8 flex items-center justify-center text-xl font-semibold text-body bg-page dark:bg-page border border-border rounded-md hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="candyCount === 0"
            @click="decrementCandies"
          >
            −
          </button>
          <span class="min-w-8 text-center text-2xl font-bold text-primary">{{ candyCount }}</span>
          <button
            class="w-8 h-8 flex items-center justify-center text-xl font-semibold text-body bg-page dark:bg-page border border-border rounded-md hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="candyCount >= props.maxCandies"
            @click="incrementCandies"
          >
            +
          </button>
        </div>
      </div>

      <div class="flex flex-col items-center gap-2">
        <span class="text-sm text-muted">{{ t('learn.candy.friends') }}</span>
        <div class="flex items-center gap-2">
          <button
            class="w-8 h-8 flex items-center justify-center text-xl font-semibold text-body bg-page dark:bg-page border border-border rounded-md hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="friendCount <= 1"
            @click="decrementFriends"
          >
            −
          </button>
          <span class="min-w-8 text-center text-2xl font-bold text-primary">{{ friendCount }}</span>
          <button
            class="w-8 h-8 flex items-center justify-center text-xl font-semibold text-body bg-page dark:bg-page border border-border rounded-md hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="friendCount >= props.maxFriends"
            @click="incrementFriends"
          >
            +
          </button>
        </div>
      </div>
    </div>

    <!-- Visual Section -->
    <div class="flex flex-col items-center gap-4 w-full">
      <div class="flex flex-wrap justify-center gap-1 min-h-8">
        <span v-for="i in candyCount" :key="i" class="text-2xl">🍬</span>
      </div>

      <div class="text-2xl text-muted">↓</div>

      <div class="flex flex-wrap justify-center gap-4">
        <div
          v-for="friend in friends"
          :key="friend.id"
          class="flex flex-col items-center gap-1 p-3 bg-page dark:bg-page rounded-lg min-w-[60px]"
        >
          <span class="text-2xl">👤</span>
          <div class="flex flex-wrap justify-center gap-0.5 min-h-5">
            <span v-for="c in friend.candies" :key="c" class="text-base">🍬</span>
          </div>
          <span class="text-sm font-semibold text-muted">{{ friend.candies }}</span>
        </div>
      </div>

      <div
        v-if="distribution.remainder > 0"
        class="flex flex-col items-center gap-2 p-3 bg-accent/20 dark:bg-accent/30 rounded-lg"
      >
        <div class="text-sm font-semibold text-accent">{{ t('learn.candy.leftover') }}</div>
        <div class="flex gap-1">
          <span v-for="i in distribution.remainder" :key="i" class="text-2xl">🍬</span>
        </div>
      </div>
    </div>

    <!-- Equation -->
    <div class="flex flex-col items-center gap-2 p-4 bg-page dark:bg-page rounded-lg">
      <div class="text-base text-body">
        {{ candyCount }} ÷ {{ friendCount }} = {{ distribution.perPerson }}
        <span v-if="distribution.remainder > 0">
          {{ t('learn.candy.remainder', { r: distribution.remainder }) }}
        </span>
      </div>
      <div class="text-lg text-muted font-mono">
        {{ candyCount }} mod {{ friendCount }} =
        <strong class="text-xl text-primary">{{ distribution.remainder }}</strong>
      </div>
    </div>

    <!-- Insight -->
    <div class="p-4 bg-primary/10 dark:bg-primary/20 rounded-lg text-center">
      <p class="text-sm text-body m-0">{{ t('learn.candy.insight') }}</p>
    </div>
  </div>
</template>
