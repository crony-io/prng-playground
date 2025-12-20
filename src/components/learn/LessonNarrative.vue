<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  contentKey: string;
  insightKey?: string;
  isMicroTeaching?: boolean;
}>();

const { t } = useI18n();
</script>

<template>
  <div class="max-w-[600px] text-center" :class="isMicroTeaching ? 'glass rounded-xl p-6' : ''">
    <div
      v-if="isMicroTeaching"
      class="inline-block px-3 py-1 text-xs font-semibold text-primary bg-primary/10 dark:bg-primary/20 rounded-full mb-4"
    >
      💡 {{ t('learn.microTeachingLabel') }}
    </div>

    <p class="text-xl leading-relaxed text-body m-0">
      {{ t(props.contentKey) }}
    </p>

    <div
      v-if="props.insightKey"
      class="flex items-center justify-center gap-2 mt-6 p-4 bg-accent/10 dark:bg-accent/20 rounded-lg"
    >
      <span class="text-xl">✨</span>
      <span class="text-base font-medium text-accent">{{ t(props.insightKey) }}</span>
    </div>
  </div>
</template>
