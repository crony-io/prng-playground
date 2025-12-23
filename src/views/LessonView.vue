<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLearningStore } from '@/stores/learning';
import LessonNarrative from '@/components/learn/LessonNarrative.vue';
import LessonQuiz from '@/components/learn/LessonQuiz.vue';
import LessonProgress from '@/components/learn/LessonProgress.vue';
import LessonActivity from '@/components/learn/LessonActivity.vue';
import MicroTeaching from '@/components/learn/MicroTeaching.vue';
import BadgeDisplay from '@/components/learn/BadgeDisplay.vue';
import type { LessonStep, MicroTeachingVisualType } from '@/types/lessons';
import { BADGE_WORLD_MAP, type BadgeType } from '@/components/learn/badges';

const { t } = useI18n();
const learningStore = useLearningStore();

const lesson = computed(() => learningStore.currentLesson);
const lessonProgress = computed(() => learningStore.currentLessonProgress);

// Get world and lesson numbers for display
const worldNumber = computed(() => {
  if (!lesson.value?.worldId) {
    return '';
  }
  // Extract from ID: 'world-2-5' → '2.5', 'world-3' → '3'
  const match = lesson.value.worldId.match(/world-(\d+(?:-\d+)?)/);
  if (match?.[1]) {
    return match[1].replace('-', '.');
  }
  return '';
});

const lessonNumber = computed(() => {
  if (!lesson.value) {
    return '';
  }
  return lesson.value.order ?? '';
});

const currentStepIndex = computed(() => lessonProgress.value?.currentStepIndex ?? 0);

const currentStep = computed((): LessonStep | null => {
  if (!lesson.value) {
    return null;
  }
  return lesson.value.steps[currentStepIndex.value] ?? null;
});

const totalSteps = computed(() => lesson.value?.steps.length ?? 0);

const isLastStep = computed(() => currentStepIndex.value >= totalSteps.value - 1);
const isFirstStep = computed(() => currentStepIndex.value === 0);

const microTeachingVisualType = computed((): MicroTeachingVisualType => {
  if (currentStep.value?.type === 'micro-teaching' && currentStep.value.microTeaching?.visualType) {
    return currentStep.value.microTeaching.visualType;
  }
  return 'counting';
});

const worldBadgeType = computed((): BadgeType => {
  if (lesson.value?.worldId) {
    return BADGE_WORLD_MAP[lesson.value.worldId] ?? 'numberKeeper';
  }
  return 'numberKeeper';
});

const isLastLessonInWorld = computed((): boolean => {
  if (!lesson.value) {
    return false;
  }
  const worldProgress = learningStore.worldsWithProgress.find(
    (w) => w.id === lesson.value!.worldId,
  );
  if (!worldProgress) {
    return false;
  }
  // Check if this is the last lesson and all OTHER lessons are completed
  const worldLessons = worldProgress.lessonIds ?? [];
  const lastLessonId = worldLessons[worldLessons.length - 1];
  if (lesson.value.id !== lastLessonId) {
    return false;
  }
  // Check if all other lessons are completed
  return worldLessons.slice(0, -1).every((id) => learningStore.progress.lessons[id]?.completed);
});

const willEarnBadge = computed((): boolean => {
  if (!lesson.value) {
    return false;
  }
  const worldProgress = learningStore.progress.worlds[lesson.value.worldId];
  // If badge already earned, don't show again
  if (worldProgress?.badgeEarned) {
    return false;
  }
  // Show badge if this is the last lesson in the world
  return isLastLessonInWorld.value;
});

const canAdvance = computed(() => {
  if (!currentStep.value) {
    return false;
  }
  return currentStep.value.type !== 'quiz';
});

const canGoBack = computed(() => !isFirstStep.value);

function handleAdvance() {
  if (isLastStep.value) {
    handleComplete();
  } else {
    learningStore.advanceStep();
  }
}

function handleQuizComplete() {
  if (isLastStep.value) {
    handleComplete();
  } else {
    learningStore.advanceStep();
  }
}

function handleComplete() {
  if (lesson.value) {
    learningStore.completeLesson(lesson.value.id);
    learningStore.exitLesson();
  }
}

function handleExit() {
  learningStore.exitLesson();
}

function handleGoBack() {
  learningStore.goBackStep();
}
</script>

<template>
  <div v-if="lesson" class="flex flex-col min-h-[calc(100vh-80px)] max-w-[800px] mx-auto p-6">
    <!-- Header -->
    <header class="flex flex-col gap-4 pb-6 border-b border-border">
      <button
        class="self-start px-4 py-2 text-sm text-muted bg-transparent border border-border rounded-md transition-all duration-200 hover:text-body hover:border-muted"
        @click="handleExit"
      >
        ← {{ t('common.close') }}
      </button>
      <div class="text-center">
        <p class="text-sm text-muted mb-1">
          {{ t('learn.worldLesson', { world: worldNumber, lesson: lessonNumber }) }}
        </p>
        <h1 class="text-2xl font-bold text-body mb-2">{{ t(lesson.titleKey) }}</h1>
        <p class="text-base text-muted m-0">{{ t(lesson.objectiveKey) }}</p>
      </div>
      <LessonProgress :current-step="currentStepIndex" :total-steps="totalSteps" />
    </header>

    <!-- Content -->
    <main class="flex-1 flex flex-col items-center justify-center py-8">
      <template v-if="currentStep">
        <LessonNarrative
          v-if="currentStep.type === 'narrative'"
          :content-key="currentStep.contentKey!"
        />

        <MicroTeaching
          v-else-if="currentStep.type === 'micro-teaching'"
          :concept-key="currentStep.microTeaching!.conceptKey"
          :visual-type="microTeachingVisualType"
          :content-key="currentStep.microTeaching!.contentKey"
          :insight-key="currentStep.microTeaching!.insightKey"
        />

        <LessonActivity
          v-else-if="currentStep.type === 'activity'"
          :activity-type="currentStep.activityType!"
          :activity-config="currentStep.activityConfig"
          :lesson="lesson"
        />

        <LessonQuiz
          v-else-if="currentStep.type === 'quiz'"
          :questions="currentStep.quiz!"
          @complete="handleQuizComplete"
        />

        <div
          v-else-if="currentStep.type === 'completion'"
          class="flex flex-col items-center gap-6 text-center"
        >
          <div class="text-6xl mb-4">🎉</div>
          <p class="text-xl text-body max-w-[500px] leading-relaxed">
            {{ t(currentStep.contentKey!) }}
          </p>
          <BadgeDisplay
            v-if="willEarnBadge"
            :badge-type="worldBadgeType"
            :earned="true"
            :animate="true"
            :show-description="true"
          />
        </div>
      </template>
    </main>

    <!-- Footer -->
    <footer class="flex justify-center gap-4 pt-6 border-t border-border">
      <button v-if="canGoBack" class="btn-outline" @click="handleGoBack">
        {{ t('learn.previous') }}
      </button>
      <button
        v-if="canAdvance"
        class="btn-primary px-8 hover:-translate-y-0.5 transition-transform"
        @click="handleAdvance"
      >
        {{ isLastStep ? t('learn.finish') : t('learn.continue') }}
      </button>
    </footer>
  </div>
</template>
