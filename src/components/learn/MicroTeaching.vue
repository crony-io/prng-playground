<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import CandyDistribution from '@/components/learn/CandyDistribution.vue';
import MultiplicationGrid from '@/components/learn/MultiplicationGrid.vue';
import BitTogglePanel from '@/components/learn/BitTogglePanel.vue';
import CountingVisual from '@/components/learn/CountingVisual.vue';

defineProps<{
  conceptKey: string;
  visualType:
    | 'multiplication-grid'
    | 'candy-distribution'
    | 'bit-toggle'
    | 'modulo-wheel'
    | 'counting'
    | 'xor-comparison'
    | 'shift-demo'
    | 'binary-tree';
  contentKey?: string;
  insightKey?: string;
}>();

const { t } = useI18n();
</script>

<template>
  <div class="flex flex-col gap-6 p-6 glass rounded-xl border-l-4 border-primary">
    <div class="flex items-center gap-3">
      <span class="text-2xl">💡</span>
      <h3 class="text-lg font-semibold text-primary m-0">
        {{ t('learn.microTeachingLabel') }}: {{ t(conceptKey) }}
      </h3>
    </div>

    <div v-if="contentKey" class="text-body">
      {{ t(contentKey) }}
    </div>

    <div class="flex justify-center">
      <template v-if="visualType === 'multiplication-grid'">
        <MultiplicationGrid :size="4" />
      </template>

      <template v-else-if="visualType === 'counting'">
        <CountingVisual />
      </template>

      <template v-else-if="visualType === 'candy-distribution'">
        <CandyDistribution />
      </template>

      <template v-else-if="visualType === 'bit-toggle' || visualType === 'binary-tree'">
        <BitTogglePanel :bit-count="4" :initial-value="5" />
      </template>

      <template v-else-if="visualType === 'modulo-wheel'">
        <div class="flex flex-col gap-4 items-center">
          <div class="text-4xl font-bold text-primary">mod 10</div>
          <p class="text-sm text-muted">{{ t('learn.microTeaching.remainder.insight') }}</p>
        </div>
      </template>

      <template v-else-if="visualType === 'xor-comparison'">
        <div class="flex flex-col gap-4 font-mono text-center">
          <div class="flex items-center gap-4">
            <span class="text-body">0101 (5)</span>
            <span class="text-primary font-bold">XOR</span>
            <span class="text-body">0011 (3)</span>
          </div>
          <div class="text-2xl font-bold text-accent">= 0110 (6)</div>
          <p class="text-sm text-muted">{{ t('learn.microTeaching.xor.insight') }}</p>
        </div>
      </template>

      <template v-else-if="visualType === 'shift-demo'">
        <div class="flex flex-col gap-4 font-mono text-center">
          <div class="text-body">00000101 (5)</div>
          <div class="text-primary">← shift left ←</div>
          <div class="text-accent text-xl font-bold">00001010 (10)</div>
          <p class="text-sm text-muted">{{ t('learn.microTeaching.shift.insight') }}</p>
        </div>
      </template>
    </div>

    <div v-if="insightKey" class="p-3 bg-accent/10 dark:bg-accent/20 rounded-lg text-center">
      <span class="text-sm font-semibold text-accent">💡 {{ t(insightKey) }}</span>
    </div>
  </div>
</template>
