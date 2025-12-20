<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = withDefaults(
  defineProps<{
    initialValue?: number;
    bitCount?: 8 | 16 | 32;
  }>(),
  {
    initialValue: 12,
    bitCount: 8,
  },
);

const { t } = useI18n();

const shiftValue = ref(props.initialValue);
const shiftAmount = ref(1);
const shiftHistory = ref<{ op: string; before: number; after: number }[]>([]);

const maxValue = (1 << props.bitCount) - 1;

function handleShiftLeft() {
  const before = shiftValue.value;
  shiftValue.value = (shiftValue.value << shiftAmount.value) & maxValue;
  shiftHistory.value.push({ op: `<< ${shiftAmount.value}`, before, after: shiftValue.value });
}

function handleShiftRight() {
  const before = shiftValue.value;
  shiftValue.value = shiftValue.value >>> shiftAmount.value;
  shiftHistory.value.push({ op: `>>> ${shiftAmount.value}`, before, after: shiftValue.value });
}

function reset() {
  shiftValue.value = props.initialValue;
  shiftHistory.value = [];
}
</script>

<template>
  <div class="flex flex-col items-center gap-6 w-full">
    <div class="text-center">
      <p class="text-base text-muted mb-2">{{ t('learn.activities.shiftDemo.current') }}</p>
      <div class="text-4xl font-bold text-primary font-mono">{{ shiftValue }}</div>
      <div class="text-lg text-muted font-mono mt-1">
        {{ shiftValue.toString(2).padStart(props.bitCount, '0') }}
      </div>
    </div>

    <div class="flex items-center gap-4">
      <span class="text-sm text-muted">{{ t('learn.activities.shiftDemo.shiftBy') }}</span>
      <select v-model.number="shiftAmount" class="form-control w-16 text-center">
        <option v-for="n in 4" :key="n" :value="n">{{ n }}</option>
      </select>
    </div>

    <div class="flex gap-4">
      <button class="btn-primary" @click="handleShiftLeft">
        {{ t('learn.activities.shiftDemo.shiftLeft') }} (&lt;&lt;)
      </button>
      <button class="btn-primary" @click="handleShiftRight">
        {{ t('learn.activities.shiftDemo.shiftRight') }} (&gt;&gt;&gt;)
      </button>
    </div>

    <button class="btn-outline" @click="reset">
      {{ t('learn.activities.reset') }}
    </button>

    <div v-if="shiftHistory.length > 0" class="p-4 glass rounded-xl w-full max-w-[400px]">
      <div class="text-sm font-semibold text-muted mb-2">
        {{ t('learn.activities.shiftDemo.history') }}
      </div>
      <div
        v-for="(step, idx) in shiftHistory"
        :key="idx"
        class="flex items-center gap-2 text-sm font-mono py-1"
      >
        <span class="text-body">{{ step.before.toString(2).padStart(props.bitCount, '0') }}</span>
        <span class="text-primary font-bold">{{ step.op }}</span>
        <span class="text-accent">{{ step.after.toString(2).padStart(props.bitCount, '0') }}</span>
      </div>
    </div>
  </div>
</template>
