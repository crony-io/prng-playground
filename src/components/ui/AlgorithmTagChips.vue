<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import type { PrngAlgorithmTag } from '@/types/prng';

defineProps<{
  tags: readonly PrngAlgorithmTag[];
  size?: 'sm' | 'xs';
}>();

const { t } = useI18n();

const tagClasses: Record<PrngAlgorithmTag, string> = {
  fast: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
  modern: 'bg-sky-500/20 text-sky-700 dark:text-sky-300',
  educational: 'bg-amber-500/20 text-amber-700 dark:text-amber-300',
  legacy: 'bg-stone-500/20 text-stone-700 dark:text-stone-300',
};

const tagLabelKeys: Record<PrngAlgorithmTag, string> = {
  fast: 'algorithms.tags.fast',
  modern: 'algorithms.tags.modern',
  educational: 'algorithms.tags.educational',
  legacy: 'algorithms.tags.legacy',
};
</script>

<template>
  <div class="flex flex-wrap gap-1">
    <span
      v-for="tag in tags"
      :key="tag"
      class="inline-flex items-center rounded-full"
      :class="[
        tagClasses[tag],
        size === 'xs' ? 'px-1 py-0.5 text-[9px]' : 'px-1.5 py-0.5 text-[10px]',
      ]"
    >
      {{ t(tagLabelKeys[tag]) }}
    </span>
  </div>
</template>
