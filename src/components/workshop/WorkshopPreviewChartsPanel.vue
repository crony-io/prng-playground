<script setup lang="ts">
import { computed } from 'vue';

import CorrelationPlot from '@/components/CorrelationPlot.vue';
import DistributionHistogram from '@/components/DistributionHistogram.vue';
import TimeSeriesChart from '@/components/TimeSeriesChart.vue';
import type { PrngSample } from '@/composables/usePrngRunner';

const props = defineProps<{
  testSamples: readonly number[];
}>();

const testSamplesForViz = computed<PrngSample[]>(() =>
  props.testSamples.map((value, index) => ({ index: index + 1, value })),
);
</script>

<template>
  <section class="panel">
    <h3 class="panel-title">{{ $t('workshop.histogram.title') }}</h3>
    <DistributionHistogram :samples="testSamplesForViz" />
  </section>

  <section class="panel">
    <h3 class="panel-title">{{ $t('workshop.correlation.title') }}</h3>
    <CorrelationPlot :samples="testSamplesForViz" />
  </section>

  <section class="panel">
    <h3 class="panel-title">{{ $t('workshop.timeSeries.title') }}</h3>
    <TimeSeriesChart :samples="testSamplesForViz" />
  </section>
</template>
