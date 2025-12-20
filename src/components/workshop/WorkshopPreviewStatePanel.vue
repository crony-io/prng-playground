<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import StateDiffViewer from '@/components/StateDiffViewer.vue';
import type { DslExecutionState } from '@/utils/dsl-executor';

const props = defineProps<{
  testState: DslExecutionState | null;
  previousTestState: DslExecutionState | null;
  testStepCount: number;
}>();

const { t } = useI18n();

const stateEmptyMessage = computed(() => {
  return t('workshop.previewPanel.stateEmpty', { action: t('workshop.controls.run') });
});
</script>

<template>
  <section class="panel">
    <div class="flex items-center justify-between mb-4">
      <h3 class="panel-title mb-0">{{ $t('workshop.state.title') }}</h3>
      <div class="flex items-center gap-2 text-sm">
        <span class="text-muted">{{ $t('workshop.state.stepCount') }}</span>
        <span class="font-mono text-body font-medium">{{
          props.testStepCount.toLocaleString()
        }}</span>
      </div>
    </div>

    <div v-if="props.testState">
      <StateDiffViewer :current-state="props.testState" :previous-state="props.previousTestState" />
    </div>
    <div v-else class="text-sm text-muted py-4 text-center">
      {{ stateEmptyMessage }}
    </div>
  </section>
</template>
