<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { getAlgorithm } from '@/algorithms';
import { useDslRunner } from '@/composables/useDslRunner';
import type { PrngSample } from '@/composables/usePrngRunner';
import type { DslAlgorithmDefinition, DslOperation } from '@/types/dsl';
import { generateOperationId } from '@/types/dsl';
import TimeSeriesChart from '@/components/TimeSeriesChart.vue';
import CorrelationPlot from '@/components/CorrelationPlot.vue';

const props = withDefaults(
  defineProps<{
    algorithmId: string;
    showTimeSeries?: boolean;
    showCorrelation?: boolean;
    showBitVisualization?: boolean;
    showHistogram?: boolean;
    showMultiState?: boolean;
  }>(),
  {
    showTimeSeries: true,
    showCorrelation: true,
    showBitVisualization: false,
    showHistogram: false,
    showMultiState: false,
  },
);

const { t } = useI18n();

const algorithm = computed(() => getAlgorithm(props.algorithmId));
const dslRunner = useDslRunner();

const isEditing = ref(false);
const editedConstants = ref<Map<string, number>>(new Map());
const seed = ref(Date.now());

interface EditableConstant {
  id: string;
  opIndex: number;
  position: 'left' | 'right' | 'amount';
  originalValue: number;
  label: string;
}

const editableConstants = computed((): EditableConstant[] => {
  const alg = algorithm.value;
  if (!alg?.dslTemplate) {
    return [];
  }

  const constants: EditableConstant[] = [];

  alg.dslTemplate.operations.forEach((op, idx) => {
    if (op.left?.type === 'const' && typeof op.left.value === 'number') {
      constants.push({
        id: `${idx}-left`,
        opIndex: idx,
        position: 'left',
        originalValue: op.left.value,
        label: `${op.op} left`,
      });
    }
    if (op.right?.type === 'const' && typeof op.right.value === 'number') {
      constants.push({
        id: `${idx}-right`,
        opIndex: idx,
        position: 'right',
        originalValue: op.right.value,
        label: `${op.op} const`,
      });
    }
    if (op.amount !== undefined) {
      constants.push({
        id: `${idx}-amount`,
        opIndex: idx,
        position: 'amount',
        originalValue: op.amount,
        label: `${op.op} amount`,
      });
    }
  });

  return constants;
});

function getConstantValue(c: EditableConstant): number {
  return editedConstants.value.get(c.id) ?? c.originalValue;
}

function setConstantValue(c: EditableConstant, value: number) {
  editedConstants.value.set(c.id, value);
  applyEdits();
}

function buildDslAlgorithm(): DslAlgorithmDefinition | null {
  const alg = algorithm.value;
  if (!alg?.dslTemplate) {
    return null;
  }

  const operations: DslOperation[] = alg.dslTemplate.operations.map((op, idx) => {
    const newOp: DslOperation = {
      id: generateOperationId(),
      op: op.op,
      target: op.target,
    };

    if (op.left) {
      const leftKey = `${idx}-left`;
      if (op.left.type === 'const' && editedConstants.value.has(leftKey)) {
        newOp.left = { type: 'const', value: editedConstants.value.get(leftKey)! };
      } else {
        newOp.left = { ...op.left };
      }
    }

    if (op.right) {
      const rightKey = `${idx}-right`;
      if (op.right.type === 'const' && editedConstants.value.has(rightKey)) {
        newOp.right = { type: 'const', value: editedConstants.value.get(rightKey)! };
      } else {
        newOp.right = { ...op.right };
      }
    }

    if (op.amount !== undefined) {
      const amountKey = `${idx}-amount`;
      newOp.amount = editedConstants.value.has(amountKey)
        ? editedConstants.value.get(amountKey)!
        : op.amount;
    }

    return newOp;
  });

  return {
    id: `${alg.id}-edited`,
    name: t(alg.meta.nameKey) + ' (edited)',
    description: '',
    stateVariables: [...alg.dslTemplate.stateVariables],
    operations,
    outputVariable: alg.dslTemplate.outputVariable,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

function applyEdits() {
  const dslAlg = buildDslAlgorithm();
  if (dslAlg) {
    dslRunner.setAlgorithm(dslAlg, seed.value);
  }
}

function initState() {
  seed.value = Date.now();
  editedConstants.value.clear();
  applyEdits();
}

function step() {
  dslRunner.step(seed.value);
}

function reset() {
  editedConstants.value.clear();
  seed.value = Date.now();
  applyEdits();
}

function runMany(count: number) {
  dslRunner.runSteps(count, seed.value);
}

function toggleEdit() {
  isEditing.value = !isEditing.value;
}

function formatConstant(value: number): string {
  if (Math.abs(value) > 0xffff) {
    return '0x' + (value >>> 0).toString(16).toUpperCase();
  }
  return value.toString();
}

function parseConstant(input: string): number {
  const trimmed = input.trim();
  if (trimmed.startsWith('0x') || trimmed.startsWith('0X')) {
    return parseInt(trimmed, 16) >>> 0;
  }
  return parseInt(trimmed, 10) >>> 0;
}

onMounted(() => {
  initState();
});

watch(
  () => props.algorithmId,
  () => {
    initState();
  },
);

const stateEntries = computed(() => {
  const s = dslRunner.state.value;
  if (!s) {
    return [];
  }
  return Object.entries(s);
});

const currentValue = computed(() => {
  const s = dslRunner.state.value;
  if (!s) {
    return 0;
  }
  const alg = algorithm.value;
  if (!alg?.dslTemplate) {
    return 0;
  }
  const outputVar = alg.dslTemplate.outputVariable;
  const outputValue = s[outputVar];
  return (typeof outputValue === 'number' ? outputValue : 0) / 0xffffffff;
});

const samples = computed((): PrngSample[] => {
  return dslRunner.samples.value.map((v, i) => ({
    index: i,
    value: v,
  }));
});

const algorithmName = computed(() => {
  if (!algorithm.value?.meta?.nameKey) {
    return props.algorithmId;
  }
  return t(algorithm.value.meta.nameKey);
});

const hasDslTemplate = computed(() => !!algorithm.value?.dslTemplate);
const hasEdits = computed(() => editedConstants.value.size > 0);

const histogramBins = computed(() => {
  const bins = new Array(10).fill(0);
  const sampleValues = dslRunner.samples.value;
  for (const v of sampleValues) {
    const binIndex = Math.min(9, Math.floor(v * 10));
    bins[binIndex]++;
  }
  const max = Math.max(...bins, 1);
  return bins.map((count, i) => ({
    range: `${(i * 0.1).toFixed(1)}-${((i + 1) * 0.1).toFixed(1)}`,
    count,
    height: (count / max) * 100,
  }));
});

const binaryStateEntries = computed(() => {
  const s = dslRunner.state.value;
  if (!s) {
    return [];
  }
  return Object.entries(s).map(([key, value]) => {
    const numValue = typeof value === 'number' ? value >>> 0 : 0;
    const binary = numValue.toString(2).padStart(32, '0');
    const groups = binary.match(/.{1,8}/g) || [];
    return {
      key,
      value: numValue,
      groups,
    };
  });
});
</script>

<template>
  <div class="flex flex-col gap-6 w-full max-w-[700px]">
    <div class="text-center">
      <h3 class="text-xl font-bold text-primary m-0 mb-2">
        {{ algorithmName }}
        <span v-if="hasEdits" class="text-sm text-accent"
          >({{ t('learn.activities.algorithmExplorer.modified') }})</span
        >
      </h3>
      <p v-if="algorithm?.meta?.descriptionKey" class="text-sm text-muted m-0">
        {{ t(algorithm.meta.descriptionKey) }}
      </p>
    </div>

    <!-- Editable Constants Panel -->
    <div v-if="hasDslTemplate" class="p-4 glass rounded-xl">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm text-muted">{{
          t('learn.activities.algorithmExplorer.constants')
        }}</span>
        <button
          class="text-xs px-2 py-1 rounded transition-colors"
          :class="isEditing ? 'bg-primary text-page' : 'bg-surface text-muted hover:bg-primary/20'"
          @click="toggleEdit"
        >
          {{
            isEditing
              ? t('learn.activities.algorithmExplorer.doneEditing')
              : t('learn.activities.algorithmExplorer.editConstants')
          }}
        </button>
      </div>

      <div class="flex flex-wrap gap-3 justify-center">
        <div
          v-for="c in editableConstants"
          :key="c.id"
          class="flex flex-col items-center gap-1 px-3 py-2 bg-surface rounded-lg"
          :class="{ 'ring-2 ring-accent': editedConstants.has(c.id) }"
        >
          <span class="text-xs text-muted font-mono">{{ c.label }}</span>
          <input
            v-if="isEditing"
            type="text"
            class="w-24 px-2 py-1 text-sm font-mono text-center bg-page border border-border rounded focus:border-primary focus:outline-none"
            :value="formatConstant(getConstantValue(c))"
            @change="
              (e) => setConstantValue(c, parseConstant((e.target as HTMLInputElement).value))
            "
          />
          <span v-else class="text-sm font-bold text-primary font-mono">
            {{ formatConstant(getConstantValue(c)) }}
          </span>
        </div>
      </div>

      <p v-if="isEditing" class="text-xs text-muted text-center mt-3">
        {{ t('learn.activities.algorithmExplorer.editHint') }}
      </p>
    </div>

    <!-- State Display -->
    <div class="p-4 glass rounded-xl">
      <div class="text-sm text-muted mb-3">{{ t('learn.activities.algorithmExplorer.state') }}</div>
      <div class="flex flex-wrap gap-4 justify-center">
        <div
          v-for="[key, value] in stateEntries"
          :key="key"
          class="flex flex-col items-center gap-1 px-4 py-2 bg-surface rounded-lg"
        >
          <span class="text-xs text-muted font-mono">{{ key }}</span>
          <span class="text-lg font-bold text-primary font-mono">{{ value }}</span>
        </div>
      </div>

      <!-- Multi-State Interaction Diagram -->
      <div
        v-if="showMultiState && stateEntries.length > 1"
        class="mt-4 pt-4 border-t border-border"
      >
        <div class="text-xs text-muted text-center mb-2">
          {{ t('learn.activities.algorithmExplorer.multiStateInfo') }}
        </div>
        <div class="flex items-center justify-center gap-2 flex-wrap">
          <template v-for="([key], idx) in stateEntries" :key="`arrow-${key}`">
            <span class="px-2 py-1 bg-primary/20 text-primary text-xs font-mono rounded">{{
              key
            }}</span>
            <span v-if="idx < stateEntries.length - 1" class="text-muted text-lg">↔</span>
          </template>
        </div>
        <div class="text-xs text-accent text-center mt-2">
          {{
            t('learn.activities.algorithmExplorer.totalStateBits', {
              bits: stateEntries.length * 32,
            })
          }}
        </div>
      </div>
    </div>

    <!-- Current Output -->
    <div class="text-center">
      <span class="text-sm text-muted">{{ t('learn.activities.algorithmExplorer.output') }}: </span>
      <span class="text-2xl font-bold text-accent font-mono">{{ currentValue.toFixed(6) }}</span>
    </div>

    <!-- Controls -->
    <div class="flex gap-3 justify-center flex-wrap">
      <button class="btn-primary" @click="step">
        {{ t('learn.activities.algorithmExplorer.step') }}
      </button>
      <button class="btn-outline" @click="runMany(10)">+10</button>
      <button class="btn-outline" @click="runMany(100)">+100</button>
      <button class="btn-outline" @click="reset">
        {{ t('learn.activities.reset') }}
      </button>
    </div>

    <!-- Error Display -->
    <div
      v-if="dslRunner.error.value"
      class="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center"
    >
      <span class="text-sm text-red-500">{{ dslRunner.error.value }}</span>
    </div>

    <!-- Visualizations -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-if="showTimeSeries" class="flex flex-col gap-2">
        <span class="text-sm text-muted text-center">
          {{ t('learn.activities.algorithmExplorer.timeSeries') }}
        </span>
        <div class="h-[150px]">
          <TimeSeriesChart :samples="samples" :max-points="100" />
        </div>
      </div>
      <div v-if="showCorrelation" class="flex flex-col gap-2">
        <span class="text-sm text-muted text-center">
          {{ t('learn.activities.algorithmExplorer.correlation') }}
        </span>
        <CorrelationPlot :samples="samples" :max-points="100" />
      </div>
      <div v-if="showHistogram" class="flex flex-col gap-2">
        <span class="text-sm text-muted text-center">
          {{ t('learn.activities.algorithmExplorer.histogram') }}
        </span>
        <div class="h-[150px] flex items-end justify-between gap-1 px-2">
          <div
            v-for="bin in histogramBins"
            :key="bin.range"
            class="flex-1 bg-primary/70 rounded-t transition-all duration-300"
            :style="{ height: bin.height + '%' }"
            :title="`${bin.range}: ${bin.count}`"
          />
        </div>
        <div class="flex justify-between text-xs text-muted px-2">
          <span>0</span>
          <span>1</span>
        </div>
      </div>
    </div>

    <!-- Binary Visualization -->
    <div v-if="showBitVisualization" class="p-4 glass rounded-xl">
      <div class="text-sm text-muted mb-3 text-center">
        {{ t('learn.activities.algorithmExplorer.binaryView') }}
      </div>
      <div class="flex flex-col gap-3">
        <div
          v-for="entry in binaryStateEntries"
          :key="entry.key"
          class="flex flex-col items-center gap-1"
        >
          <span class="text-xs text-muted font-mono">{{ entry.key }}</span>
          <div class="flex gap-1">
            <span
              v-for="(group, gIdx) in entry.groups"
              :key="gIdx"
              class="font-mono text-xs px-1 py-0.5 rounded"
              :class="gIdx % 2 === 0 ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'"
            >
              {{ group }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Step Counter -->
    <div class="text-center text-sm text-muted">
      {{ t('learn.activities.algorithmExplorer.steps', { count: dslRunner.stepCount.value }) }}
    </div>
  </div>
</template>
