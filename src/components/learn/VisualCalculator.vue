<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { DslOperationType, DslAlgorithmDefinition, DslOperation } from '@/types/dsl';
import { generateOperationId } from '@/types/dsl';
import { executeStep, type DslExecutionState } from '@/utils/dsl-executor';

type OperationType = 'add' | 'sub' | 'mul' | 'mod' | 'xor' | 'shl' | 'shr' | 'ushr';

interface CalculationStep {
  id: number;
  operation: OperationType;
  operand: number;
  result: number;
}

const props = withDefaults(
  defineProps<{
    initialValue?: number;
    allowedOperations?: OperationType[];
  }>(),
  {
    initialValue: 1,
    allowedOperations: () => ['add', 'mul', 'mod'],
  },
);

const { t } = useI18n();

const currentValue = ref(props.initialValue);
const operand = ref(1);
const selectedOp = ref<OperationType>(props.allowedOperations[0] ?? 'add');
const steps = ref<CalculationStep[]>([]);
let stepIdCounter = 0;

const operationLabels: Record<OperationType, string> = {
  add: '+',
  sub: '−',
  mul: '×',
  mod: 'mod',
  xor: 'XOR',
  shl: '<<',
  shr: '>>',
  ushr: '>>>',
};

/**
 * Execute a single operation using the DSL executor.
 * Creates a minimal algorithm definition for one operation.
 */
function executeWithDsl(op: OperationType, currentVal: number, operandVal: number): number {
  const dslOp = op as DslOperationType;

  const operation: DslOperation = {
    id: generateOperationId(),
    op: dslOp,
    target: 's',
    left: { type: 'state', value: 's' },
    right: { type: 'const', value: operandVal },
  };

  // For shift operations, use amount instead of right operand
  if (op === 'shl' || op === 'shr' || op === 'ushr') {
    operation.amount = operandVal & 31;
    operation.right = undefined;
  }

  const algorithm: DslAlgorithmDefinition = {
    id: 'visual-calc-temp',
    name: 'Visual Calculator',
    description: 'Temporary algorithm for visual calculator',
    stateVariables: [{ name: 's', initialValue: 0 }],
    operations: [operation],
    outputVariable: 's',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  // Initialize state with current value (seed=0 so initialValue XOR 0 = initialValue)
  const state: DslExecutionState = { s: currentVal >>> 0 };

  const result = executeStep(algorithm, state);
  // Return raw integer value (not normalized 0-1)
  return result.state['s'] ?? 0;
}

function applyOperation() {
  const result = executeWithDsl(selectedOp.value, currentValue.value, operand.value);
  steps.value.push({
    id: stepIdCounter++,
    operation: selectedOp.value,
    operand: operand.value,
    result,
  });
  currentValue.value = result;
}

function reset() {
  currentValue.value = props.initialValue;
  steps.value = [];
}

function undo() {
  if (steps.value.length > 0) {
    steps.value.pop();
    if (steps.value.length === 0) {
      currentValue.value = props.initialValue;
    } else {
      const lastStep = steps.value[steps.value.length - 1];
      currentValue.value = lastStep?.result ?? props.initialValue;
    }
  }
}

const canUndo = computed(() => steps.value.length > 0);
</script>

<template>
  <div class="flex flex-col items-center gap-5 p-6 glass rounded-xl max-w-[400px]">
    <div class="text-lg font-semibold text-body">{{ t('learn.calculator.title') }}</div>

    <!-- Current Value -->
    <div class="flex flex-col items-center gap-1">
      <span class="text-sm text-muted">{{ t('learn.calculator.currentValue') }}</span>
      <span class="text-4xl font-bold text-primary font-mono">{{ currentValue }}</span>
    </div>

    <!-- Operation Builder -->
    <div class="flex flex-col items-center gap-3 w-full">
      <div class="flex gap-2 w-full">
        <select v-model="selectedOp" class="form-control flex-1 text-lg font-semibold text-center">
          <option v-for="op in props.allowedOperations" :key="op" :value="op">
            {{ operationLabels[op] }}
          </option>
        </select>
        <input
          v-model.number="operand"
          type="number"
          class="form-control flex-1 text-lg text-center"
          :placeholder="t('learn.calculator.operand')"
        />
      </div>

      <div class="text-base text-muted font-mono">
        {{ currentValue }} {{ operationLabels[selectedOp] }} {{ operand }} = ?
      </div>

      <button class="btn-primary px-8" @click="applyOperation">
        {{ t('learn.calculator.apply') }}
      </button>
    </div>

    <!-- History -->
    <div v-if="steps.length > 0" class="w-full p-4 bg-page dark:bg-page rounded-lg">
      <div class="text-sm font-semibold text-muted mb-3">{{ t('learn.calculator.history') }}</div>
      <div class="flex flex-col gap-2 max-h-[150px] overflow-y-auto scrollbar">
        <div
          v-for="(step, index) in [...steps].reverse()"
          :key="step.id"
          class="flex items-baseline gap-2 font-mono text-sm"
        >
          <span class="text-muted min-w-6">{{ steps.length - index }}.</span>
          <span class="text-body">
            {{
              steps.length - index === 1
                ? props.initialValue
                : (steps[steps.length - index - 2]?.result ?? props.initialValue)
            }}
            {{ operationLabels[step.operation] }}
            {{ step.operand }}
          </span>
          <span class="text-muted">=</span>
          <span class="font-semibold text-primary">{{ step.result }}</span>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex gap-2">
      <button class="btn-outline text-sm" :disabled="!canUndo" @click="undo">
        {{ t('learn.calculator.undo') }}
      </button>
      <button class="btn-outline text-sm" @click="reset">
        {{ t('learn.calculator.reset') }}
      </button>
    </div>
  </div>
</template>
