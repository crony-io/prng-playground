<script setup lang="ts">
import { computed, toRef } from 'vue';
import type { PrngSample } from '@/composables/usePrngRunner';

const props = defineProps<{
  samples: readonly PrngSample[];
  maxPoints?: number;
}>();

const maxPointsProp = toRef(() => props.maxPoints);
const MAX_POINTS = computed(() => maxPointsProp.value ?? 500);
const CHART_LEFT = 40;
const CHART_TOP = 10;
const CHART_WIDTH = 350;
const CHART_HEIGHT = 150;

const points = computed(() => {
  if (props.samples.length === 0) {
    return [];
  }

  const samples = props.samples;
  const len = samples.length;
  const step = Math.max(1, Math.floor(len / MAX_POINTS.value));
  const result: { x: number; y: number }[] = [];

  for (let i = 0; i < len; i += step) {
    const sample = samples[i];
    if (sample) {
      const xRatio = len > 1 ? i / (len - 1) : 0.5;
      result.push({
        x: CHART_LEFT + xRatio * CHART_WIDTH,
        y: CHART_TOP + CHART_HEIGHT - sample.value * CHART_HEIGHT,
      });
    }
  }

  return result;
});

const pathD = computed(() => {
  if (points.value.length === 0) {
    return '';
  }
  const pts = points.value;
  let d = `M ${pts[0]!.x} ${pts[0]!.y}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i]!.x} ${pts[i]!.y}`;
  }
  return d;
});

const sampleRange = computed(() => {
  if (props.samples.length === 0) {
    return { first: 0, last: 0 };
  }
  return {
    first: props.samples[0]?.index ?? 0,
    last: props.samples[props.samples.length - 1]?.index ?? 0,
  };
});
</script>

<template>
  <div class="relative h-48">
    <svg class="w-full h-full" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid meet">
      <!-- Plot area background -->
      <rect
        :x="CHART_LEFT"
        :y="CHART_TOP"
        :width="CHART_WIDTH"
        :height="CHART_HEIGHT"
        class="fill-surface stroke-border"
        stroke-width="1"
      />
      <!-- Grid lines -->
      <line
        :x1="CHART_LEFT"
        :y1="CHART_TOP + CHART_HEIGHT / 2"
        :x2="CHART_LEFT + CHART_WIDTH"
        :y2="CHART_TOP + CHART_HEIGHT / 2"
        class="stroke-border/50"
        stroke-width="1"
        stroke-dasharray="4 4"
      />
      <!-- Line path -->
      <path
        v-if="pathD"
        :d="pathD"
        fill="none"
        class="stroke-accent"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <!-- X-axis labels -->
      <text :x="CHART_LEFT" y="175" class="fill-muted text-[10px]">
        {{ sampleRange.first }}
      </text>
      <text
        :x="CHART_LEFT + CHART_WIDTH / 2"
        y="175"
        class="fill-muted text-[10px]"
        text-anchor="middle"
      >
        {{ $t('workshop.timeSeries.xAxisLabel') }}
      </text>
      <text :x="CHART_LEFT + CHART_WIDTH" y="175" class="fill-muted text-[10px]" text-anchor="end">
        {{ sampleRange.last }}
      </text>
      <!-- Y-axis labels -->
      <text :x="CHART_LEFT - 5" y="163" class="fill-muted text-[10px]" text-anchor="end">0</text>
      <text
        :x="CHART_LEFT - 5"
        :y="CHART_TOP + CHART_HEIGHT / 2 + 3"
        class="fill-muted text-[10px]"
        text-anchor="end"
      >
        0.5
      </text>
      <text :x="CHART_LEFT - 5" y="18" class="fill-muted text-[10px]" text-anchor="end">1</text>
      <!-- Empty state -->
      <text
        v-if="samples.length === 0"
        :x="CHART_LEFT + CHART_WIDTH / 2"
        :y="CHART_TOP + CHART_HEIGHT / 2"
        text-anchor="middle"
        class="fill-muted text-sm"
      >
        {{ $t('workshop.timeSeries.empty') }}
      </text>
    </svg>
  </div>
</template>
