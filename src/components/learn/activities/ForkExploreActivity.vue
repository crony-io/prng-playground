<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AlgorithmExplorer from '@/components/learn/AlgorithmExplorer.vue';
import RotationVsShiftDemo from '@/components/learn/RotationVsShiftDemo.vue';

const props = defineProps<{
  algorithmId?: string;
  showTimeSeries?: boolean;
  showCorrelationPlot?: boolean;
  showHistogram?: boolean;
  showMultiState?: boolean;
  showBitVisualization?: boolean;
  showRotations?: boolean;
}>();

const { t } = useI18n();

const forkExploreHintKey = computed((): string => {
  switch (props.algorithmId) {
    case 'lcg':
      return 'learn.activities.forkExploreHintLcg';
    case 'xorshift32':
      return 'learn.activities.forkExploreHintXorshift';
    case 'mulberry32':
      return 'learn.activities.forkExploreHintMulberry';
    case 'sfc32':
    case 'xoshiro128ss':
      return 'learn.activities.forkExploreHintMultiState';
    default:
      return 'learn.activities.forkExploreHint';
  }
});
</script>

<template>
  <div class="flex flex-col items-center gap-6 w-full">
    <p class="text-body text-center max-w-[500px] mb-2">
      {{ t('learn.activities.forkExplore') }}
    </p>
    <AlgorithmExplorer
      :algorithm-id="algorithmId ?? 'lcg'"
      :show-time-series="showTimeSeries ?? true"
      :show-correlation="showCorrelationPlot ?? true"
      :show-histogram="showHistogram ?? false"
      :show-multi-state="showMultiState ?? false"
      :show-bit-visualization="showBitVisualization ?? false"
    />
    <!-- Prominent Hint Callout -->
    <div class="w-full max-w-[600px] p-4 mt-2 bg-accent/10 border border-accent/30 rounded-xl">
      <div class="flex items-start gap-3">
        <span class="text-2xl">💡</span>
        <div class="flex-1">
          <p class="text-sm font-medium text-accent mb-1">{{ t('learn.activities.tryThis') }}</p>
          <p class="text-sm text-body">{{ t(forkExploreHintKey) }}</p>
        </div>
      </div>
    </div>

    <!-- Rotation vs Shift Demo for algorithms that use rotation -->
    <RotationVsShiftDemo v-if="showRotations" />
  </div>
</template>
