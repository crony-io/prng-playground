<script setup lang="ts">
import { computed, toRef } from 'vue';
import type { PrngSample } from '@/composables/usePrngRunner';

const props = defineProps<{
  samples: readonly PrngSample[];
  maxPoints?: number;
}>();

const maxPointsProp = toRef(() => props.maxPoints);
const MAX_POINTS = computed(() => maxPointsProp.value ?? 2000);
const PLOT_LEFT = 40;
const PLOT_TOP = 10;
const PLOT_SIZE = 150;

const points = computed(() => {
  if (props.samples.length < 2) {
    return [];
  }

  const samples = props.samples;
  const step = Math.max(1, Math.floor((samples.length - 1) / MAX_POINTS.value));
  const result: { x: number; y: number }[] = [];

  for (let i = 0; i < samples.length - 1; i += step) {
    const curr = samples[i];
    const next = samples[i + 1];
    if (curr && next) {
      result.push({
        x: PLOT_LEFT + curr.value * PLOT_SIZE,
        y: PLOT_TOP + PLOT_SIZE - next.value * PLOT_SIZE,
      });
    }
  }

  return result;
});
</script>
<template>
  <div class="relative h-48">
    <svg class="w-full h-full" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid meet">
      <!-- Plot area background -->
      <rect
        :x="PLOT_LEFT"
        :y="PLOT_TOP"
        :width="PLOT_SIZE"
        :height="PLOT_SIZE"
        class="fill-surface stroke-border"
        stroke-width="1"
      />
      <!-- Points -->
      <g>
        <circle
          v-for="(point, i) in points"
          :key="i"
          :cx="point.x"
          :cy="point.y"
          r="1.5"
          class="fill-accent/60"
        />
      </g>
      <!-- X-axis labels -->
      <text x="40" y="175" class="fill-muted text-[10px]">0</text>
      <text x="115" y="175" class="fill-muted text-[10px]" text-anchor="middle">
        {{ $t('workshop.correlation.xAxisLabel') }}
      </text>
      <text x="190" y="175" class="fill-muted text-[10px]" text-anchor="end">1</text>
      <!-- Y-axis labels -->
      <text x="35" y="160" class="fill-muted text-[10px]" text-anchor="end">0</text>
      <text x="35" y="90" class="fill-muted text-[10px]" text-anchor="end">
        {{ $t('workshop.correlation.yAxisLabel') }}
      </text>
      <text x="35" y="18" class="fill-muted text-[10px]" text-anchor="end">1</text>
      <!-- Empty state -->
      <text
        v-if="samples.length < 2"
        x="115"
        y="90"
        text-anchor="middle"
        class="fill-muted text-sm"
      >
        {{ $t('workshop.correlation.empty') }}
      </text>
    </svg>
  </div>
</template>
