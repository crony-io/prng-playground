<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineProps<{
  revealValue?: number;
}>();

const { t } = useI18n();

const revealedValue = ref<number | null>(null);

function handleReveal() {
  revealedValue.value = 42;
}
</script>

<template>
  <div class="flex flex-col items-center gap-6">
    <div
      class="w-[200px] h-[150px] flex items-center justify-center glass rounded-2xl border-3 transition-all duration-300"
      :class="
        revealedValue !== null ? 'border-primary bg-primary/10 dark:bg-primary/20' : 'border-border'
      "
    >
      <span v-if="revealedValue === null" class="text-3xl text-muted">? ? ?</span>
      <span v-else class="text-5xl font-bold text-primary">{{ revealedValue }}</span>
    </div>
    <button v-if="revealedValue === null" class="btn-primary" @click="handleReveal">
      {{ t('learn.activities.wakeUp') }}
    </button>
  </div>
</template>
