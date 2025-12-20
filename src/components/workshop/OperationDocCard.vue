<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { DslOperationType } from '@/types/dsl';
import type { OperationMeta } from '@/utils/operation-docs';

interface Props {
  op: DslOperationType;
  meta: OperationMeta;
}

defineProps<Props>();

const { t, te } = useI18n();

const expanded = ref(false);
</script>

<template>
  <div class="glass-card overflow-hidden">
    <button
      type="button"
      class="w-full p-3 text-left hover:bg-surface/50 transition-colors"
      @click="expanded = !expanded"
    >
      <div class="flex items-center gap-3">
        <span
          class="w-10 h-10 flex items-center justify-center rounded-lg bg-accent/20 text-accent font-mono text-lg shrink-0"
        >
          {{ meta.symbol }}
        </span>
        <div class="min-w-0 flex-1">
          <h4 class="font-medium text-body text-sm">
            {{ t(`${meta.i18nKey}.name`) }}
          </h4>
          <p class="text-xs text-muted truncate">
            {{ t(`${meta.i18nKey}.brief`) }}
          </p>
        </div>
        <span
          class="text-muted text-sm shrink-0 transition-transform"
          :class="{ 'rotate-180': expanded }"
        >
          ▼
        </span>
      </div>
    </button>

    <div v-if="expanded" class="px-3 pb-3 space-y-3 border-t border-border/50 pt-3">
      <div>
        <h5 class="text-xs font-medium text-accent mb-1">
          {{ t('operationDocs.learnMore') }}
        </h5>
        <p class="text-sm text-body leading-relaxed">
          {{ t(`${meta.i18nKey}.detailed`) }}
        </p>
      </div>

      <div class="bg-surface/50 rounded-lg p-3">
        <h5 class="text-xs font-medium text-muted mb-2">
          {{ t('operationDocs.tryIt') }}
        </h5>
        <code class="text-sm font-mono text-accent block">
          {{ t(`${meta.i18nKey}.example`) }}
        </code>
      </div>

      <div v-if="te(`${meta.i18nKey}.whyUseful`)">
        <h5 class="text-xs font-medium text-green-500 mb-1">💡</h5>
        <p class="text-xs text-muted leading-relaxed">
          {{ t(`${meta.i18nKey}.whyUseful`) }}
        </p>
      </div>

      <div v-if="te(`${meta.i18nKey}.visualization`)" class="bg-surface rounded-lg p-2">
        <p class="text-xs font-mono text-muted">
          {{ t(`${meta.i18nKey}.visualization`) }}
        </p>
      </div>
    </div>
  </div>
</template>
