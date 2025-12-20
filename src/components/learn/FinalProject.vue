<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { PrngSample } from '@/composables/usePrngRunner';
import TimeSeriesChart from '@/components/TimeSeriesChart.vue';
import CorrelationPlot from '@/components/CorrelationPlot.vue';

const { t } = useI18n();

const state = ref(1);
const samples = ref<PrngSample[]>([]);
const stepCount = ref(0);

// Customizable algorithm parameters
const op1Type = ref<'xor-shl' | 'xor-shr' | 'mul' | 'add'>('xor-shl');
const op1Value = ref(13);
const op2Type = ref<'xor-shr' | 'xor-shl' | 'mul' | 'add'>('xor-shr');
const op2Value = ref(17);
const op3Type = ref<'xor-shl' | 'xor-shr' | 'mul' | 'add'>('xor-shl');
const op3Value = ref(5);

function applyOp(s: number, opType: string, value: number): number {
  switch (opType) {
    case 'xor-shl':
      return s ^ (s << value);
    case 'xor-shr':
      return s ^ (s >>> value);
    case 'mul':
      return Math.imul(s, value);
    case 'add':
      return (s + value) | 0;
    default:
      return s;
  }
}

function step() {
  let s = state.value || 1;
  s = applyOp(s, op1Type.value, op1Value.value);
  s = applyOp(s, op2Type.value, op2Value.value);
  s = applyOp(s, op3Type.value, op3Value.value);

  state.value = s;
  stepCount.value++;

  const normalized = (s >>> 0) / 0x100000000;
  samples.value.push({ index: stepCount.value, value: normalized });

  if (samples.value.length > 100) {
    samples.value.shift();
  }
}

function reset() {
  state.value = 1;
  samples.value = [];
  stepCount.value = 0;
}

function runMany(count: number) {
  for (let i = 0; i < count; i++) {
    step();
  }
}

const qualityScore = computed(() => {
  if (samples.value.length < 50) {
    return null;
  }

  const values = samples.value.map((s) => s.value);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;

  const bins = new Array(10).fill(0);
  for (const v of values) {
    bins[Math.min(9, Math.floor(v * 10))]++;
  }
  const expected = values.length / 10;
  const chiSquare = bins.reduce((a, b) => a + (b - expected) ** 2 / expected, 0);

  let score = 0;
  if (Math.abs(mean - 0.5) < 0.1) {
    score += 33;
  }
  if (Math.abs(variance - 1 / 12) < 0.05) {
    score += 33;
  }
  if (chiSquare < 25) {
    score += 34;
  }

  return score;
});

const opTypes = [
  { value: 'xor-shl', label: 'XOR << (shift left)' },
  { value: 'xor-shr', label: 'XOR >>> (shift right)' },
  { value: 'mul', label: 'Multiply' },
  { value: 'add', label: 'Add' },
];
</script>

<template>
  <div class="flex flex-col items-center gap-6 w-full max-w-[700px]">
    <h3 class="text-lg font-semibold text-body">{{ t('learn.activities.finalProject.title') }}</h3>
    <p class="text-base text-muted text-center">{{ t('learn.activities.finalProject.intro') }}</p>

    <!-- Operation Builder -->
    <div class="w-full p-4 glass rounded-xl">
      <div class="text-sm text-muted mb-4 text-center">
        {{ t('learn.activities.finalProject.buildAlgorithm') }}
      </div>
      <div class="flex flex-col gap-4">
        <div class="flex gap-3 items-center">
          <span class="text-sm font-mono w-16">Op 1:</span>
          <select v-model="op1Type" class="form-control flex-1">
            <option v-for="op in opTypes" :key="op.value" :value="op.value">{{ op.label }}</option>
          </select>
          <input
            v-model.number="op1Value"
            type="number"
            class="form-control w-20"
            min="1"
            max="31"
          />
        </div>
        <div class="flex gap-3 items-center">
          <span class="text-sm font-mono w-16">Op 2:</span>
          <select v-model="op2Type" class="form-control flex-1">
            <option v-for="op in opTypes" :key="op.value" :value="op.value">{{ op.label }}</option>
          </select>
          <input
            v-model.number="op2Value"
            type="number"
            class="form-control w-20"
            min="1"
            max="31"
          />
        </div>
        <div class="flex gap-3 items-center">
          <span class="text-sm font-mono w-16">Op 3:</span>
          <select v-model="op3Type" class="form-control flex-1">
            <option v-for="op in opTypes" :key="op.value" :value="op.value">{{ op.label }}</option>
          </select>
          <input
            v-model.number="op3Value"
            type="number"
            class="form-control w-20"
            min="1"
            max="31"
          />
        </div>
      </div>
    </div>

    <!-- Current State -->
    <div class="text-center">
      <span class="text-sm text-muted">State: </span>
      <span class="text-xl font-bold text-primary font-mono">{{ state >>> 0 }}</span>
    </div>

    <!-- Controls -->
    <div class="flex gap-3 flex-wrap justify-center">
      <button class="btn-primary" @click="step">Step</button>
      <button class="btn-outline" @click="runMany(10)">+10</button>
      <button class="btn-outline" @click="runMany(50)">+50</button>
      <button class="btn-outline" @click="reset">{{ t('learn.activities.reset') }}</button>
    </div>

    <!-- Visualizations -->
    <div class="grid grid-cols-2 gap-4 w-full">
      <div class="h-[150px]">
        <TimeSeriesChart :samples="samples" :max-points="100" />
      </div>
      <CorrelationPlot :samples="samples" :max-points="100" />
    </div>

    <!-- Quality Score -->
    <div v-if="qualityScore !== null" class="p-4 glass rounded-xl text-center w-full">
      <div class="text-sm text-muted mb-2">
        {{ t('learn.activities.finalProject.qualityScore') }}
      </div>
      <div
        class="text-4xl font-bold"
        :class="
          qualityScore === 100 ? 'text-accent' : qualityScore >= 66 ? 'text-primary' : 'text-danger'
        "
      >
        {{ qualityScore }}%
      </div>
      <div v-if="qualityScore === 100" class="text-xl mt-2">🏆</div>
    </div>

    <div class="text-sm text-muted text-center">
      {{ t('learn.activities.finalProject.steps', { count: stepCount }) }}
    </div>
  </div>
</template>
