<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import type { LessonDefinition } from '@/types/lessons';
import type { DslOperationType } from '@/types/dsl';
import type { PrngSample } from '@/composables/usePrngRunner';
import BitVisualization from '@/components/BitVisualization.vue';
import TimeSeriesChart from '@/components/TimeSeriesChart.vue';

const props = defineProps<{
  lesson: LessonDefinition;
  showVisualization?: 'time-series' | 'bit' | 'none';
}>();

const { t } = useI18n();

const currentValue = ref(0);
const previousValue = ref(0);
const samples = ref<PrngSample[]>([]);
const stepCount = ref(0);

const allowedOperations = computed((): DslOperationType[] => {
  return props.lesson.allowedOperations ?? ['add', 'mul', 'mod', 'xor', 'shl', 'shr'];
});

function resetState() {
  const ops = allowedOperations.value;
  // Start at 0 for simple counters, 1 for generators that need non-zero seed
  const initialValue = ops.length === 1 && ops[0] === 'add' ? 0 : 1;
  currentValue.value = initialValue;
  previousValue.value = initialValue;
  samples.value = [];
  stepCount.value = 0;
}

function step() {
  previousValue.value = currentValue.value;
  stepCount.value += 1;

  let newValue = currentValue.value;
  const ops = allowedOperations.value;

  // Simple counter: only addition
  if (ops.length === 1 && ops[0] === 'add') {
    newValue = (newValue + 1) | 0;
  }
  // Simple multiplication only
  else if (ops.length === 1 && ops[0] === 'mul') {
    newValue = Math.imul(newValue || 1, 2);
  }
  // LCG style: mul + add
  else if (ops.includes('mul') && ops.includes('add') && !ops.includes('xor')) {
    newValue = Math.imul(newValue || 1, 3);
    newValue = (newValue + 1) | 0;
  }
  // XOR-shift style
  else if (ops.includes('xor') && (ops.includes('shl') || ops.includes('shr'))) {
    newValue = newValue || 1;
    newValue ^= newValue << 13;
    newValue ^= newValue >>> 17;
    newValue ^= newValue << 5;
    newValue = newValue >>> 0;
  }
  // Default: simple counter
  else {
    newValue = (newValue + 1) | 0;
  }

  currentValue.value = newValue;

  // Normalize value for chart (0-1 range)
  let normalizedValue: number;
  if (ops.length === 1 && ops[0] === 'add') {
    // For simple counter, use modulo to wrap for visualization
    normalizedValue = (newValue % 100) / 100;
  } else {
    normalizedValue = (newValue >>> 0) / 0x100000000;
  }

  samples.value.push({
    index: stepCount.value,
    value: normalizedValue,
  });

  if (samples.value.length > 100) {
    samples.value.shift();
  }
}

onMounted(() => {
  resetState();
});

watch(
  () => props.lesson.id,
  () => {
    resetState();
  },
);
</script>

<template>
  <div class="w-full max-w-[600px] glass rounded-xl p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-lg font-semibold text-body m-0">{{ t('learn.sandbox.title') }}</h3>
      <span class="text-sm text-muted">{{ t('learn.sandbox.step', { count: stepCount }) }}</span>
    </div>

    <!-- State -->
    <div class="flex flex-col items-center gap-4 mb-6">
      <div class="flex items-baseline gap-3">
        <span class="text-base text-muted">{{ t('learn.sandbox.state') }}:</span>
        <span class="text-3xl font-bold text-primary font-mono">{{ currentValue }}</span>
      </div>

      <BitVisualization
        v-if="showVisualization === 'bit'"
        :value="currentValue"
        :previous-value="previousValue"
      />
    </div>

    <!-- Controls -->
    <div class="flex justify-center gap-4 mb-6">
      <button class="btn-primary" @click="step">
        {{ t('learn.sandbox.nextStep') }}
      </button>
      <button class="btn-outline" @click="resetState">
        {{ t('learn.sandbox.reset') }}
      </button>
    </div>

    <!-- Chart -->
    <div v-if="showVisualization === 'time-series' && samples.length > 0" class="h-[150px] mb-4">
      <TimeSeriesChart :samples="samples" :max-points="100" />
    </div>

    <!-- Info -->
    <div class="pt-4 border-t border-border">
      <p class="text-sm text-muted m-0">
        {{ t('learn.sandbox.allowedOperations') }}:
        <span
          v-for="op in allowedOperations"
          :key="op"
          class="inline-block px-2 py-0.5 ml-1 text-xs font-mono text-primary bg-primary/10 dark:bg-primary/20 rounded"
        >
          {{ op }}
        </span>
      </p>
    </div>
  </div>
</template>
