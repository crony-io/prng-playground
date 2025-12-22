<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = withDefaults(
  defineProps<{
    bitCount?: 4 | 8;
    initialValue?: number;
    readonly?: boolean;
    showPreview32?: boolean;
  }>(),
  {
    bitCount: 8,
    initialValue: 0,
    readonly: false,
    showPreview32: false,
  },
);

const emit = defineEmits<{
  change: [value: number];
}>();

const { t } = useI18n();

const value = ref(props.initialValue);

const maxValue = computed(() => (1 << props.bitCount) - 1);

const bits = computed(() => {
  const result = [];
  for (let i = props.bitCount - 1; i >= 0; i--) {
    result.push({
      position: i,
      isSet: ((value.value >> i) & 1) === 1,
      weight: 1 << i,
    });
  }
  return result;
});

const binaryString = computed(() => {
  return value.value.toString(2).padStart(props.bitCount, '0');
});

const hexString = computed(() => {
  const hexDigits = props.bitCount === 8 ? 2 : 1;
  return '0x' + value.value.toString(16).toUpperCase().padStart(hexDigits, '0');
});

function toggleBit(position: number) {
  if (props.readonly) {
    return;
  }
  value.value ^= 1 << position;
  emit('change', value.value);
}

function reset() {
  value.value = 0;
  emit('change', 0);
}

function setMax() {
  value.value = maxValue.value;
  emit('change', maxValue.value);
}

function increment() {
  if (value.value < maxValue.value) {
    value.value += 1;
    emit('change', value.value);
  }
}

function decrement() {
  if (value.value > 0) {
    value.value -= 1;
    emit('change', value.value);
  }
}

watch(
  () => props.initialValue,
  (newVal) => {
    value.value = newVal;
  },
);
</script>

<template>
  <div class="flex flex-col items-center gap-5 p-6 glass rounded-xl">
    <div class="text-lg font-semibold text-body">
      {{ t('learn.bits.title', { count: props.bitCount }) }}
    </div>

    <div class="flex flex-col items-center gap-1">
      <!-- Bit weights -->
      <div class="flex gap-2">
        <span
          v-for="bit in bits"
          :key="`w-${bit.position}`"
          class="w-9 text-center text-xs font-medium text-muted"
        >
          {{ bit.weight }}
        </span>
      </div>

      <!-- Bit buttons -->
      <div class="flex gap-2">
        <button
          v-for="bit in bits"
          :key="bit.position"
          class="w-9 h-9 flex items-center justify-center text-base font-bold font-mono border-2 rounded-md transition-all duration-150"
          :class="
            bit.isSet
              ? 'bg-primary border-primary text-page'
              : 'bg-page dark:bg-page border-border text-body hover:border-primary'
          "
          :disabled="props.readonly"
          @click="toggleBit(bit.position)"
        >
          {{ bit.isSet ? '1' : '0' }}
        </button>
      </div>

      <!-- Bit positions -->
      <div class="flex gap-2">
        <span
          v-for="bit in bits"
          :key="`p-${bit.position}`"
          class="w-9 text-center text-[10px] text-muted"
        >
          {{ bit.position }}
        </span>
      </div>
    </div>

    <!-- Value display -->
    <div class="flex flex-col gap-2 p-4 bg-page dark:bg-page rounded-lg min-w-[200px]">
      <div class="flex justify-between items-baseline">
        <span class="text-sm text-muted">{{ t('learn.bits.decimal') }}:</span>
        <span class="text-2xl font-bold text-primary font-mono">{{ value }}</span>
      </div>
      <div class="flex justify-between items-baseline">
        <span class="text-sm text-muted">{{ t('learn.bits.binary') }}:</span>
        <span class="text-base font-semibold text-body font-mono">{{ binaryString }}</span>
      </div>
      <div class="flex justify-between items-baseline">
        <span class="text-sm text-muted">{{ t('learn.bits.hex') }}:</span>
        <span class="text-base font-semibold text-body font-mono">{{ hexString }}</span>
      </div>
    </div>

    <!-- Controls -->
    <div v-if="!props.readonly" class="flex gap-2">
      <button class="btn-outline text-sm" @click="decrement" :disabled="value === 0">−1</button>
      <button class="btn-outline text-sm" @click="increment" :disabled="value === maxValue">
        +1
      </button>
      <button class="btn-outline text-sm" @click="reset">{{ t('learn.bits.clear') }}</button>
      <button class="btn-outline text-sm" @click="setMax">{{ t('learn.bits.max') }}</button>
    </div>

    <div class="text-xs text-muted">
      {{ t('learn.bits.range', { min: 0, max: maxValue }) }}
    </div>

    <!-- 32-bit Preview -->
    <div
      v-if="props.showPreview32"
      class="mt-4 p-4 bg-accent/10 border border-accent/30 rounded-lg text-center"
    >
      <div class="text-sm font-semibold text-accent mb-2">
        {{ t('learn.bits.preview32Title') }}
      </div>
      <div class="text-lg font-bold text-primary font-mono">
        {{ t('learn.bits.preview32Possibilities', { count: '4,294,967,296' }) }}
      </div>
      <div class="text-xs text-muted mt-2">
        {{ t('learn.bits.preview32Explanation') }}
      </div>
    </div>
  </div>
</template>
