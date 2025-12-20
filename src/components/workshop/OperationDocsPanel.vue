<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

import OperationDocCard from '@/components/workshop/OperationDocCard.vue';
import type { DslOperationType } from '@/types/dsl';
import {
  OPERATION_META,
  OPERATION_CATEGORIES,
  EDITOR_OPERATIONS,
  type OperationCategory,
} from '@/utils/operation-docs';

const { t } = useI18n();

const showBitsExplanation = ref(false);
const activeCategory = ref<OperationCategory | 'all'>('all');

const categoryOptions = computed(() => [
  { key: 'all' as const, label: t('operationDocs.title') },
  ...OPERATION_CATEGORIES.map((cat) => ({
    key: cat.key,
    label: t(cat.i18nKey),
  })),
]);

const filteredOperations = computed(() => {
  if (activeCategory.value === 'all') {
    return EDITOR_OPERATIONS;
  }
  return EDITOR_OPERATIONS.filter((op) => OPERATION_META[op].category === activeCategory.value);
});

function getOperationsByCategory(category: OperationCategory): DslOperationType[] {
  return EDITOR_OPERATIONS.filter((op) => OPERATION_META[op].category === category);
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="panel">
      <h3 class="panel-title flex items-center gap-2">📚 {{ t('operationDocs.title') }}</h3>
      <p class="text-sm text-muted mb-4">
        {{ t('operationDocs.introduction') }}
      </p>

      <button
        type="button"
        class="w-full glass-card p-3 text-left mb-4"
        @click="showBitsExplanation = !showBitsExplanation"
      >
        <div class="flex items-center gap-2">
          <span class="text-lg">🔢</span>
          <span class="font-medium text-body text-sm">{{
            t('operationDocs.whatAreBits.title')
          }}</span>
          <span
            class="ml-auto text-muted text-sm transition-transform"
            :class="{ 'rotate-180': showBitsExplanation }"
          >
            ▼
          </span>
        </div>
      </button>

      <div v-if="showBitsExplanation" class="glass-card p-4 mb-4 bg-accent/5 border-accent/20">
        <p class="text-sm text-body leading-relaxed">
          {{ t('operationDocs.whatAreBits.content') }}
        </p>
        <div class="mt-3 bg-surface rounded-lg p-3">
          <p class="text-xs font-mono text-muted mb-1">5 = 0101</p>
          <div class="flex gap-1 text-xs">
            <span class="w-8 text-center bg-accent/20 rounded px-1">8</span>
            <span class="w-8 text-center bg-accent/20 rounded px-1">4</span>
            <span class="w-8 text-center bg-accent/20 rounded px-1">2</span>
            <span class="w-8 text-center bg-accent/20 rounded px-1">1</span>
          </div>
          <div class="flex gap-1 text-xs mt-1">
            <span class="w-8 text-center font-mono">0</span>
            <span class="w-8 text-center font-mono text-accent">1</span>
            <span class="w-8 text-center font-mono">0</span>
            <span class="w-8 text-center font-mono text-accent">1</span>
          </div>
          <p class="text-xs text-muted mt-2">4 + 1 = 5 ✓</p>
        </div>
      </div>

      <div class="flex flex-wrap gap-1 mb-4">
        <button
          v-for="option in categoryOptions"
          :key="option.key"
          type="button"
          class="px-3 py-1 text-xs rounded-full transition-colors"
          :class="
            activeCategory === option.key
              ? 'bg-accent text-white'
              : 'bg-surface text-muted hover:text-body'
          "
          @click="activeCategory = option.key"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <template v-if="activeCategory === 'all'">
      <div v-for="category in OPERATION_CATEGORIES" :key="category.key" class="panel">
        <h4 class="text-sm font-medium text-body mb-1">
          {{ t(category.i18nKey) }}
        </h4>
        <p class="text-xs text-muted mb-3">
          {{ t(`${category.i18nKey}Desc`) }}
        </p>
        <div class="space-y-2">
          <OperationDocCard
            v-for="op in getOperationsByCategory(category.key)"
            :key="op"
            :op="op"
            :meta="OPERATION_META[op]"
          />
        </div>
      </div>
    </template>

    <template v-else>
      <div class="panel">
        <div class="space-y-2">
          <OperationDocCard
            v-for="op in filteredOperations"
            :key="op"
            :op="op"
            :meta="OPERATION_META[op]"
          />
        </div>
      </div>
    </template>

    <div class="panel bg-green-500/10 border-green-500/20">
      <h4 class="text-sm font-medium text-green-500 mb-2">
        💡 {{ t('operationDocs.tips.title') }}
      </h4>
      <ul class="space-y-2 text-xs text-body">
        <li class="flex gap-2">
          <span class="text-green-500">•</span>
          {{ t('operationDocs.tips.tip1') }}
        </li>
        <li class="flex gap-2">
          <span class="text-green-500">•</span>
          {{ t('operationDocs.tips.tip2') }}
        </li>
        <li class="flex gap-2">
          <span class="text-green-500">•</span>
          {{ t('operationDocs.tips.tip3') }}
        </li>
        <li class="flex gap-2">
          <span class="text-green-500">•</span>
          {{ t('operationDocs.tips.tip4') }}
        </li>
      </ul>
    </div>
  </div>
</template>
