<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { DslAlgorithmDefinition } from '@/types/dsl';

const { t } = useI18n();

const props = defineProps<{
  activeAlgorithm: DslAlgorithmDefinition | null;
  canExecute: boolean;
  testSeed: number;
  testRunSize: number;
  autoDurationSeconds: number;
  testStepCount: number;
  isRunning: boolean;
}>();

const emit = defineEmits<{
  (e: 'create-new'): void;
  (e: 'open-fork-modal'): void;
  (e: 'update:testSeed', value: number): void;
  (e: 'update:testRunSize', value: number): void;
  (e: 'update:autoDurationSeconds', value: number): void;
  (e: 'test-step'): void;
  (e: 'test-run'): void;
  (e: 'test-auto'): void;
  (e: 'test-stop'): void;
  (e: 'test-reset'): void;
}>();

const seedModel = computed({
  get: () => props.testSeed,
  set: (value: number) => emit('update:testSeed', value),
});

const runSizeModel = computed({
  get: () => props.testRunSize,
  set: (value: number) => emit('update:testRunSize', value),
});

const autoDurationModel = computed({
  get: () => props.autoDurationSeconds,
  set: (value: number) => emit('update:autoDurationSeconds', value),
});

const isExecutionDisabled = computed(() => {
  return !props.activeAlgorithm || !props.canExecute;
});

const isStepRunDisabled = computed(() => {
  return isExecutionDisabled.value || props.isRunning;
});

const stepCountTitle = computed(() => {
  return `${t('workshop.state.stepCount')}: ${props.testStepCount}`;
});
</script>

<template>
  <section class="panel mb-4 sticky top-0 z-10 bg-surface/95 backdrop-blur-sm">
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <div class="flex items-center gap-4">
        <div>
          <h2 class="panel-title mb-0 text-lg">{{ $t('workshop.title') }}</h2>
        </div>
        <div class="flex gap-2">
          <button type="button" class="btn-primary text-sm px-3 py-1" @click="emit('create-new')">
            {{ $t('workshop.createNew') }}
          </button>
          <button
            type="button"
            class="btn-outline text-sm px-3 py-1"
            @click="emit('open-fork-modal')"
          >
            {{ $t('workshop.forkBuiltin') }}
          </button>
        </div>
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <div class="flex items-center gap-1">
          <span class="text-xs text-muted">{{ $t('workshop.testSeed') }}:</span>
          <input
            v-model.number="seedModel"
            type="number"
            class="w-20 rounded border border-border bg-surface px-2 py-1 text-xs font-mono"
          />
        </div>

        <div class="flex items-center gap-1">
          <span class="text-xs text-muted">{{ $t('workshop.runSize') }}:</span>
          <input
            v-model.number="runSizeModel"
            type="number"
            min="10"
            max="10000"
            class="w-16 rounded border border-border bg-surface px-2 py-1 text-xs font-mono"
          />
        </div>

        <div class="flex items-center gap-1">
          <span class="text-xs text-muted">{{ $t('workshop.autoDuration') }}:</span>
          <input
            v-model.number="autoDurationModel"
            type="number"
            min="1"
            max="3600"
            class="w-16 rounded border border-border bg-surface px-2 py-1 text-xs font-mono"
          />
        </div>

        <div class="flex gap-1">
          <button
            type="button"
            class="btn-outline text-xs px-2 py-1"
            :disabled="isStepRunDisabled"
            @click="emit('test-step')"
          >
            {{ $t('workshop.controls.step') }}
          </button>

          <button
            type="button"
            class="btn-primary text-xs px-3 py-1"
            :disabled="isStepRunDisabled"
            @click="emit('test-run')"
          >
            <span aria-hidden="true">▶</span>
            {{ $t('workshop.controls.run') }}
          </button>

          <button
            v-if="!props.isRunning"
            type="button"
            class="btn-outline text-xs px-2 py-1"
            :disabled="isExecutionDisabled"
            @click="emit('test-auto')"
          >
            {{ $t('workshop.controls.autorun') }}
          </button>

          <button
            v-else
            type="button"
            class="btn-primary text-xs px-2 py-1"
            @click="emit('test-stop')"
          >
            {{ $t('workshop.controls.stop') }}
          </button>

          <button
            type="button"
            class="btn-ghost text-xs px-2 py-1"
            :title="$t('workshop.controls.reset')"
            @click="emit('test-reset')"
          >
            ↻
          </button>
        </div>

        <div class="text-xs font-mono text-muted" :title="stepCountTitle">#{{ testStepCount }}</div>

        <slot name="actions" />
      </div>
    </div>
  </section>
</template>
