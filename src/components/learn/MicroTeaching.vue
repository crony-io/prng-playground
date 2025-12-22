<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import CandyDistribution from '@/components/learn/CandyDistribution.vue';
import MultiplicationGrid from '@/components/learn/MultiplicationGrid.vue';
import BitTogglePanel from '@/components/learn/BitTogglePanel.vue';
import CountingVisual from '@/components/learn/CountingVisual.vue';
import ShiftMicroTeaching from '@/components/learn/ShiftMicroTeaching.vue';
import XorMicroTeaching from '@/components/learn/XorMicroTeaching.vue';
import ModuloWheel from '@/components/learn/ModuloWheel.vue';
import OverflowVisual from '@/components/learn/OverflowVisual.vue';
import MultiStateVisual from '@/components/learn/MultiStateVisual.vue';

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
    | 'binary-tree'
    | 'overflow'
    | 'multi-state';
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
        <ModuloWheel :mod-value="10" :initial-value="0" />
      </template>

      <template v-else-if="visualType === 'xor-comparison'">
        <XorMicroTeaching />
      </template>

      <template v-else-if="visualType === 'shift-demo'">
        <ShiftMicroTeaching />
      </template>

      <template v-else-if="visualType === 'overflow'">
        <OverflowVisual />
      </template>

      <template v-else-if="visualType === 'multi-state'">
        <MultiStateVisual />
      </template>
    </div>

    <div v-if="insightKey" class="p-3 bg-accent/10 dark:bg-accent/20 rounded-lg text-center">
      <span class="text-sm font-semibold text-accent">💡 {{ t(insightKey) }}</span>
    </div>
  </div>
</template>
