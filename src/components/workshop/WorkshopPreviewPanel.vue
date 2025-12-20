<script setup lang="ts">
import WorkshopPreviewChartsPanel from '@/components/workshop/WorkshopPreviewChartsPanel.vue';
import WorkshopPreviewOutputPanel from '@/components/workshop/WorkshopPreviewOutputPanel.vue';
import WorkshopPreviewStatePanel from '@/components/workshop/WorkshopPreviewStatePanel.vue';
import WorkshopPreviewTestsPanel from '@/components/workshop/WorkshopPreviewTestsPanel.vue';
import type { DslExecutionState } from '@/utils/dsl-executor';

defineProps<{
  validationErrors: readonly string[];
  executionError: string | null;
  testState: DslExecutionState | null;
  previousTestState: DslExecutionState | null;
  testSamples: readonly number[];
  testStepCount: number;
}>();
</script>

<template>
  <div class="flex flex-col gap-3">
    <section v-if="validationErrors.length > 0 || executionError" class="panel">
      <div
        v-if="validationErrors.length > 0"
        class="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-700 dark:text-red-300"
      >
        <ul class="list-disc list-inside">
          <li v-for="error in validationErrors" :key="error">{{ error }}</li>
        </ul>
      </div>

      <div
        v-if="executionError"
        class="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-700 dark:text-red-300"
      >
        {{ executionError }}
      </div>
    </section>

    <div class="grid gap-3 lg:grid-cols-3">
      <WorkshopPreviewStatePanel
        class="lg:col-span-2"
        :test-state="testState"
        :previous-test-state="previousTestState"
        :test-step-count="testStepCount"
      />
      <WorkshopPreviewOutputPanel :test-samples="testSamples" :test-step-count="testStepCount" />
    </div>

    <div class="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
      <WorkshopPreviewChartsPanel :test-samples="testSamples" />
    </div>

    <WorkshopPreviewTestsPanel :test-samples="testSamples" />
  </div>
</template>
