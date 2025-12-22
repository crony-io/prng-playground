<script setup lang="ts">
import { computed } from 'vue';
import type { LessonDefinition, LessonActivityType } from '@/types/lessons';

// Interactive activity components
import BitTogglePanel from '@/components/learn/BitTogglePanel.vue';
import ModuloWheel from '@/components/learn/ModuloWheel.vue';
import CandyDistribution from '@/components/learn/CandyDistribution.vue';
import VisualCalculator from '@/components/learn/VisualCalculator.vue';
import MultiplicationGrid from '@/components/learn/MultiplicationGrid.vue';
import BinaryGuessingGame from '@/components/learn/BinaryGuessingGame.vue';
import BitShiftDemo from '@/components/learn/BitShiftDemo.vue';
import XorExperiment from '@/components/learn/XorExperiment.vue';
import QualityLab from '@/components/learn/QualityLab.vue';
import DesignerChallenge from '@/components/learn/DesignerChallenge.vue';
import TestInterpretation from '@/components/learn/TestInterpretation.vue';
import FinalProject from '@/components/learn/FinalProject.vue';
import SeedDemo from '@/components/learn/SeedDemo.vue';
import DeterminismDemo from '@/components/learn/DeterminismDemo.vue';
import RotationVsShiftDemo from '@/components/learn/RotationVsShiftDemo.vue';

// Sandbox activity components
import LessonSandbox from '@/components/learn/LessonSandbox.vue';
import ShiftXorCombine from '@/components/learn/ShiftXorCombine.vue';

// Comparison activity components
import AddVsMultiplyComparison from '@/components/learn/AddVsMultiplyComparison.vue';
import ComparativeTable from '@/components/learn/ComparativeTable.vue';
import LessonComparisonView from '@/components/learn/LessonComparisonView.vue';

// Extracted activity components with encapsulated state
import {
  RevealNumberActivity,
  EngagementActivity,
  OverflowDemoActivity,
  RecipeBuilderActivity,
  CounterActivity,
  CounterComparisonActivity,
  ForkExploreActivity,
} from '@/components/learn/activities';

const props = defineProps<{
  activityType: LessonActivityType;
  activityConfig?: Record<string, unknown>;
  lesson: LessonDefinition;
}>();

const sandboxVisualization = computed((): 'time-series' | 'bit' | 'none' => {
  if (props.activityConfig?.showTimeSeries) {
    return 'time-series';
  }
  if (props.activityConfig?.showBitVisualization) {
    return 'bit';
  }
  return 'none';
});
</script>

<template>
  <div class="w-full max-w-[700px]">
    <!-- Interactive Activities -->
    <div v-if="activityType === 'interactive'" class="flex flex-col items-center gap-6">
      <!-- Reveal Number -->
      <template v-if="activityConfig?.type === 'reveal-number'">
        <RevealNumberActivity :reveal-value="activityConfig?.revealValue as number" />
      </template>

      <!-- Engagement -->
      <template v-else-if="activityConfig?.type === 'engagement'">
        <EngagementActivity :prompt-key="String(activityConfig.promptKey)" />
      </template>

      <!-- Seed Demo -->
      <template v-else-if="activityConfig?.type === 'seed-demo'">
        <SeedDemo :preset-seeds="(activityConfig.seeds as number[]) ?? [5, 100, 999]" />
      </template>

      <!-- Determinism Demo -->
      <template v-else-if="activityConfig?.type === 'determinism-demo'">
        <DeterminismDemo />
      </template>

      <!-- Overflow Demo -->
      <template v-else-if="activityConfig?.type === 'overflow-demo'">
        <OverflowDemoActivity />
      </template>

      <!-- Binary Guessing Game -->
      <template v-else-if="activityConfig?.type === 'binary-guessing-game'">
        <BinaryGuessingGame :max-number="(activityConfig?.maxNumber as number) ?? 16" />
      </template>

      <!-- Bit Toggle -->
      <template v-else-if="activityConfig?.type === 'bit-toggle'">
        <BitTogglePanel
          :bit-count="(activityConfig?.bitCount as 4 | 8) ?? 8"
          :initial-value="0"
          :show-preview32="(activityConfig?.showPreview32 as boolean) ?? false"
        />
      </template>

      <!-- Bit Shift Demo -->
      <template v-else-if="activityConfig?.type === 'bit-shift-demo'">
        <BitShiftDemo :initial-value="12" :bit-count="8" />
      </template>

      <!-- XOR Experiment -->
      <template v-else-if="activityConfig?.type === 'xor-experiment'">
        <XorExperiment />
      </template>

      <!-- Rotation vs Shift Demo -->
      <template v-else-if="activityConfig?.type === 'rotation-vs-shift'">
        <RotationVsShiftDemo />
      </template>

      <!-- Quality Lab -->
      <template v-else-if="activityConfig?.type === 'quality-lab'">
        <QualityLab
          :algorithms="
            (activityConfig?.algorithms as string[]) ?? ['lcg', 'xorshift32', 'mulberry32', 'sfc32']
          "
        />
      </template>

      <!-- Designer Challenge -->
      <template v-else-if="activityConfig?.type === 'designer-challenge'">
        <DesignerChallenge />
      </template>

      <!-- Test Interpretation -->
      <template v-else-if="activityConfig?.type === 'test-interpretation'">
        <TestInterpretation />
      </template>

      <!-- Final Project -->
      <template v-else-if="activityConfig?.type === 'final-project'">
        <FinalProject />
      </template>

      <!-- Modulo Wheel -->
      <template v-else-if="activityConfig?.type === 'modulo-wheel'">
        <ModuloWheel :mod-value="(activityConfig?.modValue as number) ?? 10" />
      </template>

      <!-- Candy Distribution (for remainder/modulo lessons) -->
      <template v-else-if="activityConfig?.type === 'candy-distribution'">
        <CandyDistribution />
      </template>

      <!-- Visual Calculator -->
      <template v-else-if="activityConfig?.type === 'visual-calculator'">
        <VisualCalculator
          :initial-value="(activityConfig?.initialValue as number) ?? 1"
          :allowed-operations="
            (activityConfig?.allowedOperations as (
              | 'add'
              | 'sub'
              | 'mul'
              | 'mod'
              | 'xor'
              | 'shl'
              | 'shr'
            )[]) ?? ['add', 'mul', 'mod']
          "
        />
      </template>

      <!-- Multiplication Grid -->
      <template v-else-if="activityConfig?.type === 'multiplication-grid'">
        <MultiplicationGrid :size="(activityConfig?.size as number) ?? 5" />
      </template>
    </div>

    <!-- Sandbox Activities -->
    <div v-else-if="activityType === 'sandbox'" class="flex flex-col items-center gap-6">
      <!-- Use LessonSandbox component for general sandbox -->
      <template v-if="activityConfig?.type === 'sandbox' || !activityConfig?.type">
        <LessonSandbox
          :lesson="lesson"
          :show-visualization="sandboxVisualization"
          :algorithm-id="(activityConfig as { algorithmId?: string })?.algorithmId"
        />
      </template>

      <!-- Shift-XOR Combine -->
      <template v-else-if="activityConfig?.type === 'shift-xor-combine'">
        <ShiftXorCombine :initial-value="42" />
      </template>

      <!-- Designer Challenge -->
      <template v-else-if="activityConfig?.type === 'designer-challenge'">
        <DesignerChallenge />
      </template>

      <!-- Final Project -->
      <template v-else-if="activityConfig?.type === 'final-project'">
        <FinalProject />
      </template>

      <!-- Recipe Builder -->
      <template v-else-if="activityConfig?.type === 'recipe-builder'">
        <RecipeBuilderActivity />
      </template>

      <!-- Default Counter -->
      <template v-else>
        <CounterActivity />
      </template>
    </div>

    <!-- Fork Explore -->
    <ForkExploreActivity
      v-else-if="activityType === 'fork-explore'"
      :algorithm-id="(activityConfig as { algorithmId?: string })?.algorithmId"
      :show-time-series="(activityConfig as { showTimeSeries?: boolean })?.showTimeSeries"
      :show-correlation-plot="
        (activityConfig as { showCorrelationPlot?: boolean })?.showCorrelationPlot
      "
      :show-histogram="(activityConfig as { showHistogram?: boolean })?.showHistogram"
      :show-multi-state="(activityConfig as { showMultiState?: boolean })?.showMultiState"
      :show-bit-visualization="
        (activityConfig as { showBitVisualization?: boolean })?.showBitVisualization
      "
      :show-rotations="(activityConfig as { showRotations?: boolean })?.showRotations"
    />

    <!-- Comparison -->
    <div v-else-if="activityType === 'comparison'" class="flex flex-col gap-6">
      <!-- Add vs Multiply Comparison -->
      <template v-if="activityConfig?.type === 'add-vs-multiply'">
        <AddVsMultiplyComparison />
      </template>

      <!-- Multi-Algorithm Comparison (3+ algorithms) -->
      <template
        v-else-if="((activityConfig as { algorithms?: string[] })?.algorithms?.length ?? 0) >= 3"
      >
        <LessonComparisonView
          :algorithms="(activityConfig as { algorithms?: string[] })?.algorithms ?? []"
          :show-correlation="
            (activityConfig as { showCorrelationPlot?: boolean })?.showCorrelationPlot ?? true
          "
          :show-histogram="(activityConfig as { showHistogram?: boolean })?.showHistogram ?? false"
          :show-time-series="
            (activityConfig as { showTimeSeries?: boolean })?.showTimeSeries ?? false
          "
          :show-quality-tests="
            (activityConfig as { showQualityTests?: boolean })?.showQualityTests ?? false
          "
        />

        <!-- Comparative Table -->
        <ComparativeTable
          v-if="(activityConfig as { showComparativeTable?: boolean })?.showComparativeTable"
          :algorithms="(activityConfig as { algorithms?: string[] })?.algorithms ?? []"
          class="mt-4"
        />
      </template>

      <!-- Default Counter vs Algorithm Comparison (2 algorithms) -->
      <template v-else>
        <CounterComparisonActivity
          :algorithms="(activityConfig as { algorithms?: string[] })?.algorithms"
        />
      </template>
    </div>
  </div>
</template>
