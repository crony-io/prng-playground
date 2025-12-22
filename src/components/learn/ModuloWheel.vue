<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = withDefaults(
  defineProps<{
    modValue?: number;
    initialValue?: number;
    allowModSwitch?: boolean;
  }>(),
  {
    modValue: 10,
    initialValue: 0,
    allowModSwitch: true,
  },
);

const { t } = useI18n();

const currentValue = ref(props.initialValue);
const inputValue = ref('');
const activeModValue = ref(props.modValue);

const modOptions = [
  { value: 10, label: '10', isPrime: false },
  { value: 7, label: '7', isPrime: true },
  { value: 13, label: '13', isPrime: true },
];

const positions = computed(() => {
  const items = [];
  const radius = 80;
  const centerX = 100;
  const centerY = 100;

  for (let i = 0; i < activeModValue.value; i++) {
    const angle = (i / activeModValue.value) * 2 * Math.PI - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    items.push({
      value: i,
      x,
      y,
      isActive: i === currentValue.value % activeModValue.value,
    });
  }
  return items;
});

const remainder = computed(() => {
  return currentValue.value % activeModValue.value;
});

function setModValue(val: number) {
  activeModValue.value = val;
}

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
      {{ t('learn.modulo.title', { mod: activeModValue }) }}
    </div>

    <!-- Mod Value Switcher -->
    <div v-if="props.allowModSwitch" class="flex gap-2 items-center">
      <span class="text-xs text-muted">{{ t('learn.modulo.modBy') }}:</span>
      <button
        v-for="opt in modOptions"
        :key="opt.value"
        :class="[
          'px-3 py-1 text-sm rounded transition-colors',
          activeModValue === opt.value
            ? 'bg-primary text-page'
            : 'bg-surface border border-border text-body hover:border-primary',
        ]"
        @click="setModValue(opt.value)"
      >
        {{ opt.label }}
        <span v-if="opt.isPrime" class="text-xs opacity-70">({{ t('learn.modulo.prime') }})</span>
      </button>
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
        <span class="text-base text-muted">{{ currentValue }} mod {{ activeModValue }} =</span>
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
