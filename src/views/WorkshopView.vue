<template>
  <div class="flex flex-col h-full">
    <WorkshopHeader
      :active-algorithm="activeAlgorithm"
      :can-execute="validationErrors.length === 0"
      :test-seed="testSeed"
      :test-run-size="testRunSize"
      :auto-duration-seconds="autoDurationSeconds"
      :test-step-count="testStepCount"
      :is-running="runner.isRunning.value"
      @create-new="handleCreateNew"
      @open-fork-modal="showForkModal = true"
      @update:testSeed="testSeed = $event"
      @update:testRunSize="testRunSize = $event"
      @update:autoDurationSeconds="autoDurationSeconds = $event"
      @test-step="handleTestStep"
      @test-run="handleTestRun"
      @test-auto="handleTestAuto"
      @test-stop="handleTestStop"
      @test-reset="handleTestReset"
    />

    <!-- Two-column layout: Editor + Preview -->
    <div class="grid gap-4 lg:grid-cols-2 flex-1 min-h-0">
      <WorkshopEditorColumn />

      <!-- Preview Panel - Sticky on desktop -->
      <div
        class="flex flex-col gap-3 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto"
      >
        <WorkshopPreviewPanel
          :validation-errors="validationErrors"
          :execution-error="executionError"
          :test-state="testState"
          :previous-test-state="previousTestState"
          :test-samples="testSamples"
          :test-step-count="testStepCount"
        />
      </div>
    </div>

    <WorkshopForkModal
      :open="showForkModal"
      @close="showForkModal = false"
      @forked="handleTestReset"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

import WorkshopEditorColumn from '@/components/workshop/WorkshopEditorColumn.vue';
import WorkshopForkModal from '@/components/workshop/WorkshopForkModal.vue';
import WorkshopHeader from '@/components/workshop/WorkshopHeader.vue';
import WorkshopPreviewPanel from '@/components/workshop/WorkshopPreviewPanel.vue';

import { useWorkshopStore } from '@/stores/workshop';
import { useDslRunner } from '@/composables/useDslRunner';
import { validateAlgorithm } from '@/utils/dsl-executor';

const workshopStore = useWorkshopStore();

const runner = useDslRunner();

const activeAlgorithm = computed(() => workshopStore.activeAlgorithm);

const testState = computed(() => runner.state.value);
const previousTestState = computed(() => runner.previousState.value);
const testSamples = computed(() => runner.samples.value);
const testStepCount = computed(() => runner.stepCount.value);
const executionError = computed(() => runner.error.value);

const testSeed = ref(12345);
const testRunSize = ref(1000);
const autoDurationSeconds = ref(5);

const showForkModal = ref(false);

const validationErrors = computed(() => {
  if (!activeAlgorithm.value) {
    return [];
  }
  const result = validateAlgorithm(activeAlgorithm.value);
  return result.errors;
});

watch(
  activeAlgorithm,
  () => {
    handleTestReset();
  },
  { immediate: true },
);

function handleCreateNew(): void {
  workshopStore.createAlgorithm();
  handleTestReset();
}

function handleTestReset(): void {
  if (activeAlgorithm.value) {
    runner.setAlgorithm(activeAlgorithm.value, testSeed.value);
  }
  runner.reset(testSeed.value);
}

function handleTestStep(): void {
  if (!activeAlgorithm.value || validationErrors.value.length > 0) {
    return;
  }

  runner.step(testSeed.value);
}

function handleTestRun(): void {
  if (!activeAlgorithm.value || validationErrors.value.length > 0) {
    return;
  }

  const count = Math.min(testRunSize.value, 10000);
  runner.runSteps(count, testSeed.value);
}

function handleTestAuto(): void {
  if (!activeAlgorithm.value || validationErrors.value.length > 0) {
    return;
  }

  const seconds = Math.max(0, Math.floor(autoDurationSeconds.value));
  runner.startAuto(seconds * 1000, testSeed.value);
}

function handleTestStop(): void {
  runner.stop();
}
</script>
