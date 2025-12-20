<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = withDefaults(
  defineProps<{
    modValue?: number;
    initialValue?: number;
  }>(),
  {
    modValue: 10,
    initialValue: 0,
  },
);

const { t } = useI18n();

const currentValue = ref(props.initialValue);
const inputValue = ref('');

const positions = computed(() => {
  const items = [];
  const radius = 80;
  const centerX = 100;
  const centerY = 100;

  for (let i = 0; i < props.modValue; i++) {
    const angle = (i / props.modValue) * 2 * Math.PI - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    items.push({
      value: i,
      x,
      y,
      isActive: i === currentValue.value % props.modValue,
    });
  }
  return items;
});

const remainder = computed(() => {
  return currentValue.value % props.modValue;
});

function addValue(amount: number) {
  currentValue.value += amount;
}

function setFromInput() {
  const val = parseInt(inputValue.value, 10);
  if (!isNaN(val)) {
    currentValue.value = val;
  }
}

function reset() {
  currentValue.value = props.initialValue;
  inputValue.value = '';
}
</script>

<template>
  <div class="flex flex-col items-center gap-4 p-6 glass rounded-xl">
    <div class="text-lg font-semibold text-body">
      {{ t('learn.modulo.title', { mod: props.modValue }) }}
    </div>

    <svg class="w-[200px] h-[200px]" viewBox="0 0 200 200">
      <circle
        v-for="pos in positions"
        :key="pos.value"
        :cx="pos.x"
        :cy="pos.y"
        r="18"
        :class="
          pos.isActive ? 'fill-primary stroke-primary' : 'fill-page dark:fill-page stroke-border'
        "
        stroke-width="2"
        class="transition-all duration-300"
      />
      <text
        v-for="pos in positions"
        :key="`t-${pos.value}`"
        :x="pos.x"
        :y="pos.y"
        :class="pos.isActive ? 'fill-page' : 'fill-body'"
        class="text-sm font-semibold transition-all duration-300"
        text-anchor="middle"
        dominant-baseline="central"
      >
        {{ pos.value }}
      </text>
    </svg>

    <!-- Info -->
    <div class="flex flex-col items-center gap-2">
      <div class="flex items-baseline gap-2">
        <span class="text-base text-muted">{{ t('learn.modulo.value') }}:</span>
        <span class="text-2xl font-bold text-primary">{{ currentValue }}</span>
      </div>
      <div class="flex items-baseline gap-2">
        <span class="text-base text-muted">{{ currentValue }} mod {{ props.modValue }} =</span>
        <span class="text-2xl font-bold text-primary">{{ remainder }}</span>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex gap-2">
      <button class="btn-primary text-sm" @click="addValue(1)">+1</button>
      <button class="btn-primary text-sm" @click="addValue(5)">+5</button>
      <button class="btn-primary text-sm" @click="addValue(10)">+10</button>
      <button class="btn-outline text-sm" @click="reset">{{ t('learn.modulo.reset') }}</button>
    </div>

    <!-- Input -->
    <div class="flex gap-2">
      <input
        v-model="inputValue"
        type="number"
        class="form-control w-[100px] text-center"
        :placeholder="t('learn.modulo.enterValue')"
        @keyup.enter="setFromInput"
      />
      <button class="btn-outline text-sm" @click="setFromInput">{{ t('learn.modulo.set') }}</button>
    </div>
  </div>
</template>
