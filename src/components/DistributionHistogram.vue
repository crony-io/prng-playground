<script setup lang="ts">
import { computed, toRef } from 'vue';
import type { PrngSample } from '@/composables/usePrngRunner';

const props = defineProps<{
  samples: readonly PrngSample[];
  bins?: number;
}>();

const binsProp = toRef(() => props.bins);
const BIN_COUNT = computed(() => binsProp.value ?? 20);
const CHART_LEFT = 40;
const CHART_WIDTH = 350;
const CHART_TOP = 10;
const CHART_HEIGHT = 150;

const bars = computed(() => {
  if (props.samples.length === 0) {
    return [];
  }

  const binCounts = new Array(BIN_COUNT.value).fill(0) as number[];

  for (const sample of props.samples) {
    const binIndex = Math.min(Math.floor(sample.value * BIN_COUNT.value), BIN_COUNT.value - 1);
    const current = binCounts[binIndex] ?? 0;
    binCounts[binIndex] = current + 1;
  }

  const maxCount = Math.max(...binCounts, 1);
  const barWidth = CHART_WIDTH / BIN_COUNT.value - 1;

  return binCounts.map((count: number, i: number) => {
    const height = (count / maxCount) * CHART_HEIGHT;
    return {
      x: CHART_LEFT + i * (CHART_WIDTH / BIN_COUNT.value) + 0.5,
      y: CHART_TOP + CHART_HEIGHT - height,
      width: barWidth,
      height,
    };
  });
});
</script>
<template>
  <div class="relative h-48">
    <svg class="w-full h-full" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid meet">
      <!-- Bars -->
      <g>
        <rect
          v-for="(bar, i) in bars"
          :key="i"
          :x="bar.x"
          :y="bar.y"
          :width="bar.width"
          :height="bar.height"
          class="fill-accent/70 transition-all duration-150"
        />
      </g>
      <!-- X-axis -->
      <line x1="40" y1="160" x2="390" y2="160" class="stroke-border" stroke-width="1" />
      <!-- Y-axis -->
      <line x1="40" y1="10" x2="40" y2="160" class="stroke-border" stroke-width="1" />
      <!-- X-axis labels -->
      <text x="40" y="175" class="fill-muted text-[10px]">0</text>
      <text x="210" y="175" class="fill-muted text-[10px]" text-anchor="middle">0.5</text>
      <text x="385" y="175" class="fill-muted text-[10px]" text-anchor="end">1</text>
      <!-- Y-axis label -->
      <text x="12" y="85" class="fill-muted text-[10px]" transform="rotate(-90, 12, 85)">
        {{ $t('workshop.histogram.yAxisLabel') }}
      </text>
      <!-- Empty state -->
      <text
        v-if="samples.length === 0"
        x="215"
        y="90"
        text-anchor="middle"
        class="fill-muted text-sm"
      >
        {{ $t('workshop.histogram.empty') }}
      </text>
    </svg>
  </div>
</template>
