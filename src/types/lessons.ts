import type { DslOperationType } from '@/types/dsl';

/**
 * Quiz question types supported by the learning system
 */
export type QuizQuestionType = 'concept' | 'prediction' | 'experiment' | 'debugging';

/**
 * A single quiz question definition
 */
export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  questionKey: string;
  options?: { key: string; correct?: boolean }[];
  expectedValue?: number | string;
  tolerancePercent?: number;
  feedbackCorrectKey?: string;
  feedbackIncorrectKey?: string;
  hints?: string[];
}

/**
 * Micro-teaching content for prerequisite concepts
 */
export interface MicroTeaching {
  conceptKey: string;
  visualType:
    | 'multiplication-grid'
    | 'candy-distribution'
    | 'bit-toggle'
    | 'modulo-wheel'
    | 'counting'
    | 'xor-comparison'
    | 'shift-demo'
    | 'binary-tree';
  contentKey: string;
  insightKey: string;
}

/**
 * Activity types available in lessons
 */
export type LessonActivityType =
  | 'sandbox'
  | 'comparison'
  | 'observation'
  | 'interactive'
  | 'fork-explore';

/**
 * Lesson step definition - each lesson has multiple steps
 */
export interface LessonStep {
  id: string;
  type: 'narrative' | 'micro-teaching' | 'activity' | 'quiz' | 'completion';
  contentKey?: string;
  microTeaching?: MicroTeaching;
  activityType?: LessonActivityType;
  activityConfig?: Record<string, unknown>;
  quiz?: QuizQuestion[];
}

/**
 * Complete lesson definition
 */
export interface LessonDefinition {
  id: string;
  worldId: string;
  order: number;
  titleKey: string;
  objectiveKey: string;
  narrativeKey: string;
  steps: LessonStep[];
  algorithmId?: string;
  allowedOperations?: DslOperationType[];
  maxOperations?: number;
  requiredStateVars?: string[];
}

/**
 * World (chapter) definition
 */
export interface WorldDefinition {
  id: string;
  order: number;
  titleKey: string;
  descriptionKey: string;
  badgeKey: string;
  badgeIcon: string;
  lessonIds: string[];
  unlockCondition: 'start' | 'previous-world';
  estimatedMinutes: number;
}

/**
 * Progress tracking for a single lesson
 */
export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  completedAt?: number;
  currentStepIndex: number;
  attempts: number;
}

/**
 * Progress tracking for a world
 */
export interface WorldProgress {
  worldId: string;
  lessonsCompleted: string[];
  badgeEarned: boolean;
  earnedAt?: number;
}

/**
 * Complete learning progress state
 */
export interface LearningProgress {
  schemaVersion: number;
  currentWorldId: string;
  currentLessonId: string | null;
  worlds: Record<string, WorldProgress>;
  lessons: Record<string, LessonProgress>;
  workshopUnlocked: boolean;
  unlockedAt?: number;
}

/**
 * Default initial progress state
 */
export function createInitialProgress(): LearningProgress {
  return {
    schemaVersion: 1,
    currentWorldId: 'world-1',
    currentLessonId: null,
    worlds: {},
    lessons: {},
    workshopUnlocked: false,
  };
}
