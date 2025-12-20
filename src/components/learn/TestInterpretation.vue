<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <div class="flex flex-col items-center gap-6 w-full max-w-[600px]">
    <h3 class="text-lg font-semibold text-body">
      {{ t('learn.activities.testInterpretation.title') }}
    </h3>
    <p class="text-base text-muted text-center">
      {{ t('learn.activities.testInterpretation.intro') }}
    </p>

    <div class="flex flex-col gap-4 w-full">
      <div class="p-4 glass rounded-xl">
        <h4 class="text-base font-semibold text-primary mb-2">
          {{ t('learn.activities.qualityLab.testMean') }}
        </h4>
        <p class="text-sm text-body">{{ t('learn.activities.testInterpretation.meanExplain') }}</p>
      </div>
      <div class="p-4 glass rounded-xl">
        <h4 class="text-base font-semibold text-primary mb-2">
          {{ t('learn.activities.qualityLab.testVariance') }}
        </h4>
        <p class="text-sm text-body">
          {{ t('learn.activities.testInterpretation.varianceExplain') }}
        </p>
      </div>
      <div class="p-4 glass rounded-xl">
        <h4 class="text-base font-semibold text-primary mb-2">
          {{ t('learn.activities.qualityLab.testChiSquare') }}
        </h4>
        <p class="text-sm text-body">
          {{ t('learn.activities.testInterpretation.chiSquareExplain') }}
        </p>
      </div>
    </div>
  </div>
</template>
