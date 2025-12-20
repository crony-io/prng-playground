<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent } from 'vue';
import type { WorldDefinition } from '@/types/lessons';
import { getLessonsForWorld } from '@/config/lessons';
import { useLearningStore } from '@/stores/learning';
import { BADGE_WORLD_MAP, type BadgeType } from '@/components/learn/badges';

const badgeComponents: Record<BadgeType, ReturnType<typeof defineAsyncComponent>> = {
  numberKeeper: defineAsyncComponent(
    () => import('@/components/learn/badges/NumberKeeperBadge.vue'),
  ),
  recipeMixer: defineAsyncComponent(() => import('@/components/learn/badges/RecipeMixerBadge.vue')),
  binaryExplorer: defineAsyncComponent(
    () => import('@/components/learn/badges/BinaryExplorerBadge.vue'),
  ),
  bitMaster: defineAsyncComponent(() => import('@/components/learn/badges/BitMasterBadge.vue')),
  randomnessEngineer: defineAsyncComponent(
    () => import('@/components/learn/badges/RandomnessEngineerBadge.vue'),
  ),
  researcher: defineAsyncComponent(() => import('@/components/learn/badges/ResearcherBadge.vue')),
};

function getBadgeComponent(worldId: string) {
  const badgeType = BADGE_WORLD_MAP[worldId];
  return badgeType ? badgeComponents[badgeType] : null;
}

interface WorldWithProgress extends WorldDefinition {
  lessonsCompleted: number;
  totalLessons: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  badgeEarned: boolean;
  progressPercent: number;
}

const props = defineProps<{
  worlds: WorldWithProgress[];
  workshopUnlocked: boolean;
}>();

const emit = defineEmits<{
  selectLesson: [lessonId: string];
}>();

const { t } = useI18n();
const learningStore = useLearningStore();

function getLessons(worldId: string) {
  return getLessonsForWorld(worldId);
}

function isLessonUnlocked(lessonId: string): boolean {
  return learningStore.isLessonUnlocked(lessonId);
}

function isLessonCompleted(lessonId: string): boolean {
  return learningStore.progress.lessons[lessonId]?.completed ?? false;
}

function handleLessonClick(lessonId: string) {
  if (isLessonUnlocked(lessonId)) {
    emit('selectLesson', lessonId);
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- World Cards -->
    <div
      v-for="world in props.worlds"
      :key="world.id"
      class="glass rounded-xl p-5 transition-all duration-200"
      :class="{
        'opacity-60': !world.isUnlocked,
        'border-accent': world.isCompleted,
        'hover:border-primary': world.isUnlocked && !world.isCompleted,
      }"
    >
      <!-- Header -->
      <div class="flex items-start gap-4 mb-4">
        <span class="text-3xl">{{ world.badgeIcon }}</span>
        <div class="flex-1">
          <h2 class="text-xl font-semibold text-body m-0 mb-1">{{ t(world.titleKey) }}</h2>
          <p class="text-sm text-muted m-0">{{ t(world.descriptionKey) }}</p>
        </div>
        <component
          v-if="world.badgeEarned && getBadgeComponent(world.id)"
          :is="getBadgeComponent(world.id)"
          :size="40"
          :earned="true"
        />
      </div>

      <!-- Progress -->
      <div class="h-2 bg-surface rounded overflow-hidden mb-2">
        <div
          class="h-full bg-accent rounded transition-all duration-300"
          :style="{ width: `${world.progressPercent}%` }"
        />
      </div>
      <span class="text-xs text-muted">{{ world.lessonsCompleted }}/{{ world.totalLessons }}</span>

      <!-- Lessons List -->
      <div v-if="world.isUnlocked" class="flex flex-col gap-2 mt-4">
        <button
          v-for="lesson in getLessons(world.id)"
          :key="lesson.id"
          class="flex items-center gap-3 px-4 py-3 bg-page dark:bg-page border rounded-lg text-left transition-all duration-200"
          :class="{
            'opacity-50 cursor-not-allowed border-border': !isLessonUnlocked(lesson.id),
            'border-accent': isLessonCompleted(lesson.id),
            'border-border hover:border-primary hover:bg-surface':
              isLessonUnlocked(lesson.id) && !isLessonCompleted(lesson.id),
          }"
          :disabled="!isLessonUnlocked(lesson.id)"
          @click="handleLessonClick(lesson.id)"
        >
          <span
            class="text-base w-6 text-center"
            :class="isLessonCompleted(lesson.id) ? 'text-accent' : ''"
          >
            <template v-if="isLessonCompleted(lesson.id)">✓</template>
            <template v-else-if="isLessonUnlocked(lesson.id)">○</template>
            <template v-else>🔒</template>
          </span>
          <span class="flex-1 text-[15px] text-body">{{ t(lesson.titleKey) }}</span>
        </button>
      </div>

      <!-- Locked Overlay -->
      <div v-else class="flex flex-col items-center justify-center py-8 text-center">
        <span class="text-3xl mb-2">🔒</span>
        <span class="text-sm text-muted">{{ t('learn.completePrerequisites') }}</span>
      </div>
    </div>

    <!-- Workshop Unlocked -->
    <div
      v-if="props.workshopUnlocked"
      class="flex items-center gap-4 p-6 bg-linear-to-br from-primary/10 to-surface border-2 border-primary rounded-xl"
    >
      <span class="text-4xl">🎁</span>
      <div>
        <h3 class="text-lg font-semibold text-body m-0 mb-1">
          {{ t('learn.workshopUnlocked.title') }}
        </h3>
        <p class="text-sm text-muted m-0">{{ t('learn.workshopUnlocked.description') }}</p>
      </div>
    </div>
  </div>
</template>
