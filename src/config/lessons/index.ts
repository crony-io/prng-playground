import type { WorldDefinition, LessonDefinition } from '@/types/lessons';
import { WORLD_1, WORLD_1_LESSONS } from '@/config/lessons/world-1';
import { WORLD_2, WORLD_2_LESSONS } from '@/config/lessons/world-2';
import { WORLD_2_5, WORLD_2_5_LESSONS } from '@/config/lessons/world-2-5';
import { WORLD_3, WORLD_3_LESSONS } from '@/config/lessons/world-3';
import { WORLD_4, WORLD_4_LESSONS } from '@/config/lessons/world-4';
import { WORLD_5, WORLD_5_LESSONS } from '@/config/lessons/world-5';

export const WORLDS: WorldDefinition[] = [WORLD_1, WORLD_2, WORLD_2_5, WORLD_3, WORLD_4, WORLD_5];

export const LESSONS: LessonDefinition[] = [
  ...WORLD_1_LESSONS,
  ...WORLD_2_LESSONS,
  ...WORLD_2_5_LESSONS,
  ...WORLD_3_LESSONS,
  ...WORLD_4_LESSONS,
  ...WORLD_5_LESSONS,
];

const worldsById = new Map<string, WorldDefinition>(WORLDS.map((world) => [world.id, world]));

const lessonsById = new Map<string, LessonDefinition>(LESSONS.map((lesson) => [lesson.id, lesson]));

/**
 * Get a world definition by ID
 */
export function getWorld(worldId: string): WorldDefinition | undefined {
  return worldsById.get(worldId);
}

/**
 * Get a lesson definition by ID
 */
export function getLesson(lessonId: string): LessonDefinition | undefined {
  return lessonsById.get(lessonId);
}

/**
 * Get all lessons for a specific world
 */
export function getLessonsForWorld(worldId: string): LessonDefinition[] {
  return LESSONS.filter((lesson) => lesson.worldId === worldId);
}

/**
 * Get the next lesson after the given lesson ID
 */
export function getNextLesson(currentLessonId: string): LessonDefinition | undefined {
  const currentLesson = getLesson(currentLessonId);
  if (!currentLesson) {
    return undefined;
  }

  const world = getWorld(currentLesson.worldId);
  if (!world) {
    return undefined;
  }

  const currentIndex = world.lessonIds.indexOf(currentLessonId);
  if (currentIndex < world.lessonIds.length - 1) {
    const nextLessonId = world.lessonIds[currentIndex + 1];
    if (nextLessonId) {
      return getLesson(nextLessonId);
    }
  }

  const nextWorld = WORLDS.find((w) => w.order === world.order + 1);
  if (nextWorld && nextWorld.lessonIds.length > 0) {
    const firstLessonId = nextWorld.lessonIds[0];
    if (firstLessonId) {
      return getLesson(firstLessonId);
    }
  }

  return undefined;
}
