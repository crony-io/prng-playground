<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { getAlgorithm } from '@/algorithms';

const props = defineProps<{
  algorithms: string[];
}>();

const { t } = useI18n();

interface AlgorithmStats {
  id: string;
  name: string;
  meanPass: boolean;
  variancePass: boolean;
  chiSquarePass: boolean;
  speed: 'fast' | 'medium' | 'slow';
  quality: 'excellent' | 'good' | 'poor';
}

const stats = ref<AlgorithmStats[]>([]);

function runTests(algorithmId: string): AlgorithmStats {
  const alg = getAlgorithm(algorithmId);
  const name = alg?.meta?.nameKey ? t(alg.meta.nameKey) : algorithmId;

  const samples: number[] = [];
  let state: unknown = alg?.init(12345);

  for (let i = 0; i < 1000; i++) {
    if (alg) {
      const result = alg.next(state);
      samples.push(result.value);
      state = result.state;
    } else {
      samples.push(Math.random());
    }
  }

  const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
  const variance = samples.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / samples.length;

  const bins = new Array(10).fill(0);
  for (const v of samples) {
    const binIdx = Math.min(9, Math.floor(v * 10));
    bins[binIdx]++;
  }
  const expected = samples.length / 10;
  const chiSquare = bins.reduce((sum, count) => sum + Math.pow(count - expected, 2) / expected, 0);

  const meanPass = Math.abs(mean - 0.5) < 0.05;
  const variancePass = variance > 0.07 && variance < 0.1;
  const chiSquarePass = chiSquare < 16.92;

  const passCount = [meanPass, variancePass, chiSquarePass].filter(Boolean).length;

  let quality: 'excellent' | 'good' | 'poor' = 'poor';
  if (passCount === 3) {
    quality = 'excellent';
  } else if (passCount >= 2) {
    quality = 'good';
  }

  let speed: 'fast' | 'medium' | 'slow' = 'fast';
  if (algorithmId === 'simple-counter') {
    speed = 'fast';
  } else if (algorithmId === 'lcg') {
    speed = 'medium';
  }

  return {
    id: algorithmId,
    name,
    meanPass,
    variancePass,
    chiSquarePass,
    speed,
    quality,
  };
}

onMounted(() => {
  stats.value = props.algorithms.map(runTests);
});

const qualityColors = {
  excellent: 'text-green-500',
  good: 'text-yellow-500',
  poor: 'text-red-500',
};

const qualityIcons = {
  excellent: '★★★',
  good: '★★☆',
  poor: '★☆☆',
};
</script>

<template>
  <div class="w-full overflow-x-auto">
    <h4 class="text-base font-semibold text-body text-center mb-3">
      {{ t('learn.activities.comparativeTable.title') }}
    </h4>
    <table class="w-full text-sm border-collapse">
      <thead>
        <tr class="border-b border-border">
          <th class="text-left p-2 text-muted font-medium">
            {{ t('learn.activities.comparativeTable.algorithm') }}
          </th>
          <th class="text-center p-2 text-muted font-medium">
            {{ t('learn.activities.comparativeTable.mean') }}
          </th>
          <th class="text-center p-2 text-muted font-medium">
            {{ t('learn.activities.comparativeTable.variance') }}
          </th>
          <th class="text-center p-2 text-muted font-medium">
            {{ t('learn.activities.comparativeTable.chiSquare') }}
          </th>
          <th class="text-center p-2 text-muted font-medium">
            {{ t('learn.activities.comparativeTable.quality') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="alg in stats"
          :key="alg.id"
          class="border-b border-border/50 hover:bg-surface/50"
        >
          <td class="p-2 font-medium text-body">{{ alg.name }}</td>
          <td class="text-center p-2">
            <span :class="alg.meanPass ? 'text-green-500' : 'text-red-500'">
              {{ alg.meanPass ? '✓' : '✗' }}
            </span>
          </td>
          <td class="text-center p-2">
            <span :class="alg.variancePass ? 'text-green-500' : 'text-red-500'">
              {{ alg.variancePass ? '✓' : '✗' }}
            </span>
          </td>
          <td class="text-center p-2">
            <span :class="alg.chiSquarePass ? 'text-green-500' : 'text-red-500'">
              {{ alg.chiSquarePass ? '✓' : '✗' }}
            </span>
          </td>
          <td class="text-center p-2">
            <span :class="qualityColors[alg.quality]" class="font-mono">
              {{ qualityIcons[alg.quality] }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <p class="text-xs text-muted text-center mt-2">
      {{ t('learn.activities.comparativeTable.legend') }}
    </p>
  </div>
</template>
