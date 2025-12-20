<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const count = ref(0);
const history = ref<number[]>([0]);

function increment() {
  count.value += 1;
  history.value.push(count.value);
  if (history.value.length > 10) {
    history.value.shift();
  }
}

function reset() {
  count.value = 0;
  history.value = [0];
}
</script>

<template>
  <div class="flex flex-col items-center gap-6 p-6 glass rounded-xl max-w-[400px]">
    <div class="text-lg font-semibold text-body">{{ t('learn.counting.title') }}</div>

    <!-- Visual counter display -->
    <div class="flex flex-col items-center gap-4">
      <!-- Number display -->
      <div class="flex items-center gap-4">
        <div
          class="w-20 h-20 flex items-center justify-center text-4xl font-bold text-primary bg-primary/10 dark:bg-primary/20 rounded-xl border-2 border-primary"
        >
          {{ count }}
        </div>
        <div class="text-3xl text-muted">→</div>
        <div
          class="w-20 h-20 flex items-center justify-center text-4xl font-bold text-accent bg-accent/10 dark:bg-accent/20 rounded-xl border-2 border-accent"
        >
          {{ count + 1 }}
        </div>
      </div>

      <!-- Formula -->
      <div class="text-lg font-mono text-body">
        {{ count }} + 1 = <span class="font-bold text-accent">{{ count + 1 }}</span>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex gap-3">
      <button class="btn-primary px-6" @click="increment">+1</button>
      <button class="btn-outline" @click="reset">{{ t('learn.activities.reset') }}</button>
    </div>

    <!-- History -->
    <div class="flex items-center gap-2 text-sm font-mono text-muted">
      <span v-for="(val, idx) in history" :key="idx">
        {{ val }}<span v-if="idx < history.length - 1" class="text-primary mx-1">→</span>
      </span>
    </div>

    <!-- Insight -->
    <div class="p-3 bg-accent/10 dark:bg-accent/20 rounded-lg text-center">
      <p class="text-sm text-body m-0">{{ t('learn.counting.insight') }}</p>
    </div>
  </div>
</template>
