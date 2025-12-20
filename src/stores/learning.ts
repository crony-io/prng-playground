import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { z } from 'zod';

import { createVersionedLocalStorage, makeStorageKey } from '@/utils/persistence';
import { type LearningProgress, type LessonProgress, createInitialProgress } from '@/types/lessons';
import { WORLDS, getWorld, getLesson } from '@/config/lessons';

const learningProgressSchema = z.object({
  schemaVersion: z.literal(1),
  currentWorldId: z.string(),
  currentLessonId: z.string().nullable(),
  worlds: z.record(
    z.string(),
    z.object({
      worldId: z.string(),
      lessonsCompleted: z.array(z.string()),
      badgeEarned: z.boolean(),
      earnedAt: z.number().optional(),
    }),
  ),
  lessons: z.record(
    z.string(),
    z.object({
      lessonId: z.string(),
      completed: z.boolean(),
      completedAt: z.number().optional(),
      currentStepIndex: z.number(),
      attempts: z.number(),
    }),
  ),
  workshopUnlocked: z.boolean(),
  unlockedAt: z.number().optional(),
});

const learningStorage = createVersionedLocalStorage<LearningProgress>({
  key: makeStorageKey('learning', 'progress'),
  latestVersion: 1,
  schemas: {
    1: learningProgressSchema,
  },
  coerce: () => undefined,
});

export const useLearningStore = defineStore('learning', () => {
  const persisted = learningStorage.read();
  const progress = ref<LearningProgress>(persisted ?? createInitialProgress());

  const currentWorld = computed(() => getWorld(progress.value.currentWorldId));

  const currentLesson = computed(() => {
    if (!progress.value.currentLessonId) {
      return null;
    }
    return getLesson(progress.value.currentLessonId);
  });

  const currentLessonProgress = computed((): LessonProgress | null => {
    if (!progress.value.currentLessonId) {
      return null;
    }
    return progress.value.lessons[progress.value.currentLessonId] ?? null;
  });

  const workshopUnlocked = computed(() => progress.value.workshopUnlocked);

  const worldsWithProgress = computed(() => {
    return WORLDS.map((world) => {
      const worldProgress = progress.value.worlds[world.id];
      const lessonsCompleted = worldProgress?.lessonsCompleted.length ?? 0;
      const totalLessons = world.lessonIds.length;
      const isUnlocked = isWorldUnlocked(world.id);
      const isCompleted = lessonsCompleted === totalLessons;

      return {
        ...world,
        lessonsCompleted,
        totalLessons,
        isUnlocked,
        isCompleted,
        badgeEarned: worldProgress?.badgeEarned ?? false,
        progressPercent: totalLessons > 0 ? (lessonsCompleted / totalLessons) * 100 : 0,
      };
    });
  });

  function isWorldUnlocked(worldId: string): boolean {
    const world = getWorld(worldId);
    if (!world) {
      return false;
    }

    if (world.unlockCondition === 'start') {
      return true;
    }

    if (world.unlockCondition === 'previous-world') {
      const prevWorld = WORLDS.find((w) => w.order === world.order - 1);
      if (!prevWorld) {
        return true;
      }

      const prevProgress = progress.value.worlds[prevWorld.id];
      return prevProgress?.badgeEarned ?? false;
    }

    return false;
  }

  function isLessonUnlocked(lessonId: string): boolean {
    const lesson = getLesson(lessonId);
    if (!lesson) {
      return false;
    }

    if (!isWorldUnlocked(lesson.worldId)) {
      return false;
    }

    const world = getWorld(lesson.worldId);
    if (!world) {
      return false;
    }

    const lessonIndex = world.lessonIds.indexOf(lessonId);
    if (lessonIndex === 0) {
      return true;
    }

    const prevLessonId = world.lessonIds[lessonIndex - 1];
    if (!prevLessonId) {
      return true;
    }
    const prevLessonProgress = progress.value.lessons[prevLessonId];
    return prevLessonProgress?.completed ?? false;
  }

  function startLesson(lessonId: string): void {
    if (!isLessonUnlocked(lessonId)) {
      return;
    }

    const lesson = getLesson(lessonId);
    if (!lesson) {
      return;
    }

    progress.value.currentLessonId = lessonId;
    progress.value.currentWorldId = lesson.worldId;

    if (!progress.value.lessons[lessonId]) {
      progress.value.lessons[lessonId] = {
        lessonId,
        completed: false,
        currentStepIndex: 0,
        attempts: 1,
      };
    } else {
      progress.value.lessons[lessonId].attempts += 1;
    }
  }

  function advanceStep(): void {
    const lessonId = progress.value.currentLessonId;
    if (!lessonId) {
      return;
    }

    const lesson = getLesson(lessonId);
    if (!lesson) {
      return;
    }

    const lessonProgress = progress.value.lessons[lessonId];
    if (!lessonProgress) {
      return;
    }

    if (lessonProgress.currentStepIndex < lesson.steps.length - 1) {
      lessonProgress.currentStepIndex += 1;
    }
  }

  function goBackStep(): void {
    const lessonId = progress.value.currentLessonId;
    if (!lessonId) {
      return;
    }

    const lessonProgress = progress.value.lessons[lessonId];
    if (!lessonProgress) {
      return;
    }

    if (lessonProgress.currentStepIndex > 0) {
      lessonProgress.currentStepIndex -= 1;
    }
  }

  function completeLesson(lessonId: string): void {
    const lesson = getLesson(lessonId);
    if (!lesson) {
      return;
    }

    const now = Date.now();

    if (!progress.value.lessons[lessonId]) {
      progress.value.lessons[lessonId] = {
        lessonId,
        completed: true,
        completedAt: now,
        currentStepIndex: 0,
        attempts: 1,
      };
    } else {
      progress.value.lessons[lessonId].completed = true;
      progress.value.lessons[lessonId].completedAt = now;
    }

    if (!progress.value.worlds[lesson.worldId]) {
      progress.value.worlds[lesson.worldId] = {
        worldId: lesson.worldId,
        lessonsCompleted: [lessonId],
        badgeEarned: false,
      };
    } else {
      const worldProgress = progress.value.worlds[lesson.worldId];
      if (worldProgress && !worldProgress.lessonsCompleted.includes(lessonId)) {
        worldProgress.lessonsCompleted.push(lessonId);
      }
    }

    checkWorldCompletion(lesson.worldId);
  }

  function checkWorldCompletion(worldId: string): void {
    const world = getWorld(worldId);
    if (!world) {
      return;
    }

    const worldProgress = progress.value.worlds[worldId];
    if (!worldProgress) {
      return;
    }

    const allCompleted = world.lessonIds.every((id) => worldProgress.lessonsCompleted.includes(id));

    if (allCompleted && !worldProgress.badgeEarned) {
      worldProgress.badgeEarned = true;
      worldProgress.earnedAt = Date.now();

      if (worldId === 'world-4' && !progress.value.workshopUnlocked) {
        progress.value.workshopUnlocked = true;
        progress.value.unlockedAt = Date.now();
      }
    }
  }

  function exitLesson(): void {
    progress.value.currentLessonId = null;
  }

  function resetProgress(): void {
    progress.value = createInitialProgress();
  }

  watch(
    progress,
    (value) => {
      learningStorage.write(value);
    },
    { deep: true, immediate: true },
  );

  return {
    progress,
    currentWorld,
    currentLesson,
    currentLessonProgress,
    workshopUnlocked,
    worldsWithProgress,
    isWorldUnlocked,
    isLessonUnlocked,
    startLesson,
    advanceStep,
    goBackStep,
    completeLesson,
    exitLesson,
    resetProgress,
  };
});
