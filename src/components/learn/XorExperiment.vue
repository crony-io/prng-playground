<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = withDefaults(
  defineProps<{
    initialA?: number;
    initialB?: number;
  }>(),
  {
    initialA: 5,
    initialB: 3,
  },
);

const { t } = useI18n();

const xorValueA = ref(props.initialA);
const xorValueB = ref(props.initialB);
const xorResult = computed(() => xorValueA.value ^ xorValueB.value);
</script>

<template>
  <div class="flex flex-col items-center gap-6 w-full">
    <p class="text-base text-body text-center">{{ t('learn.activities.xorExperiment.intro') }}</p>

    <div class="grid grid-cols-3 gap-4 items-center">
      <div class="flex flex-col items-center gap-2">
        <span class="text-sm text-muted">A</span>
        <input
          v-model.number="xorValueA"
          type="number"
          min="0"
          max="255"
          class="form-control w-20 text-center text-xl"
        />
        <span class="text-sm font-mono text-muted">{{
          xorValueA.toString(2).padStart(8, '0')
        }}</span>
      </div>

      <div class="text-2xl font-bold text-primary">XOR</div>

      <div class="flex flex-col items-center gap-2">
        <span class="text-sm text-muted">B</span>
        <input
          v-model.number="xorValueB"
          type="number"
          min="0"
          max="255"
          class="form-control w-20 text-center text-xl"
        />
        <span class="text-sm font-mono text-muted">{{
          xorValueB.toString(2).padStart(8, '0')
        }}</span>
      </div>
    </div>

    <div class="p-4 glass rounded-xl text-center">
      <span class="text-sm text-muted">{{ t('learn.activities.xorExperiment.result') }}</span>
      <div class="text-3xl font-bold text-accent mt-2">{{ xorResult }}</div>
      <div class="text-lg font-mono text-muted">{{ xorResult.toString(2).padStart(8, '0') }}</div>
    </div>

    <p class="text-sm text-muted text-center">{{ t('learn.activities.xorExperiment.hint') }}</p>
  </div>
</template>
