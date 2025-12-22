<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const MAX_VALUE = 255;
const value = ref(250);
const isAnimating = ref(false);
const hasOverflowed = ref(false);

const displayDigits = computed(() => {
  return value.value.toString().padStart(3, '0').split('');
});

function increment() {
  if (isAnimating.value) {
    return;
  }

  const newValue = value.value + 1;
  if (newValue > MAX_VALUE) {
    hasOverflowed.value = true;
    value.value = 0;
  } else {
    value.value = newValue;
  }
}

function add10() {
  if (isAnimating.value) {
    return;
  }

  const newValue = value.value + 10;
  if (newValue > MAX_VALUE) {
    hasOverflowed.value = true;
    value.value = newValue % (MAX_VALUE + 1);
  } else {
    value.value = newValue;
  }
}

function reset() {
  value.value = 250;
  hasOverflowed.value = false;
}

function setNearMax() {
  value.value = 253;
  hasOverflowed.value = false;
}
</script>

<template>
  <div class="flex flex-col items-center gap-6 p-6 glass rounded-xl max-w-[450px]">
    <div class="text-lg font-semibold text-body">{{ t('learn.overflow.title') }}</div>

    <!-- Odometer display -->
    <div class="flex flex-col items-center gap-4">
      <!-- 8-bit indicator -->
      <div class="text-sm text-muted font-mono">
        {{ t('learn.overflow.bitLimit', { bits: 8, max: MAX_VALUE }) }}
      </div>

      <!-- Digital odometer style display -->
      <div class="flex items-center gap-1">
        <div
          v-for="(digit, idx) in displayDigits"
          :key="idx"
          class="w-14 h-20 flex items-center justify-center text-4xl font-mono font-bold rounded-lg border-2 transition-all duration-200"
          :class="[
            hasOverflowed
              ? 'bg-accent/20 border-accent text-accent animate-pulse'
              : 'bg-primary/10 border-primary/50 text-primary',
          ]"
        >
          {{ digit }}
        </div>
      </div>

      <!-- Overflow indicator -->
      <div
        v-if="hasOverflowed"
        class="flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-lg animate-bounce"
      >
        <span class="text-2xl">🔄</span>
        <span class="text-accent font-semibold">{{ t('learn.overflow.wrapped') }}</span>
      </div>

      <!-- Progress to overflow -->
      <div class="w-full">
        <div class="flex justify-between text-xs text-muted mb-1">
          <span>0</span>
          <span>{{ MAX_VALUE }}</span>
        </div>
        <div class="h-3 bg-surface rounded-full overflow-hidden">
          <div
            class="h-full transition-all duration-200 rounded-full"
            :class="value > 240 ? 'bg-accent' : 'bg-primary'"
            :style="{ width: `${(value / MAX_VALUE) * 100}%` }"
          />
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex flex-wrap gap-3 justify-center">
      <button class="btn-primary px-4" @click="increment">+1</button>
      <button class="btn-primary px-4" @click="add10">+10</button>
      <button class="btn-outline px-4" @click="setNearMax">
        {{ t('learn.overflow.nearMax') }}
      </button>
      <button class="btn-outline px-4" @click="reset">{{ t('learn.activities.reset') }}</button>
    </div>

    <!-- Explanation -->
    <div class="text-center text-sm text-muted">
      <p v-if="!hasOverflowed && value < 250">
        {{ t('learn.overflow.tryAdding') }}
      </p>
      <p v-else-if="!hasOverflowed && value >= 250">
        {{ t('learn.overflow.almostThere', { remaining: MAX_VALUE - value + 1 }) }}
      </p>
      <p v-else>
        {{ t('learn.overflow.explanation') }}
      </p>
    </div>
  </div>
</template>
