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
 * Visual types for micro-teaching components
 */
export type MicroTeachingVisualType =
  | 'multiplication-grid'
  | 'candy-distribution'
  | 'bit-toggle'
  | 'modulo-wheel'
  | 'counting'
  | 'xor-comparison'
  | 'shift-demo'
  | 'binary-tree'
  | 'overflow'
  | 'multi-state';

/**
 * Micro-teaching content for prerequisite concepts
 */
export interface MicroTeaching {
  conceptKey: string;
  visualType: MicroTeachingVisualType;
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
 * Typed activity configurations with discriminated union.
 * Use these for type-safe activity config definitions.
 */
export type TypedActivityConfig =
  // Interactive activities
  | { type: 'reveal-number'; revealValue: number }
  | { type: 'engagement'; promptKey: string }
  | { type: 'seed-demo'; seeds?: number[] }
  | { type: 'determinism-demo' }
  | { type: 'overflow-demo' }
  | { type: 'binary-guessing-game'; maxNumber?: number; questionsNeeded?: number }
  | { type: 'bit-toggle'; bitCount?: 4 | 8; showPreview32?: boolean }
  | { type: 'bit-shift-demo'; showBitVisualization?: boolean }
  | { type: 'xor-experiment'; showBitVisualization?: boolean }
  | { type: 'modulo-wheel'; modValue?: number }
  | { type: 'candy-distribution' }
  | { type: 'multiplication-grid'; size?: number }
  | { type: 'visual-calculator'; initialValue?: number; allowedOperations?: string[] }
  | { type: 'quality-lab'; algorithms?: string[]; showAllTests?: boolean }
  | { type: 'designer-challenge' }
  | { type: 'test-interpretation'; showDetailedExplanations?: boolean }
  | { type: 'final-project' }
  | { type: 'rotation-vs-shift' }
  | { type: 'shift-xor-combine'; showBitVisualization?: boolean; showTimeSeries?: boolean }
  // Sandbox activities
  | { type: 'sandbox'; algorithmId?: string; showVisualization?: 'time-series' | 'bit' }
  | { type: 'recipe-builder' }
  // Comparison activities
  | { type: 'add-vs-multiply'; showTimeSeries?: boolean }
  // Fork-explore activities (when used with activityType: 'fork-explore')
  | {
      type?: 'fork-explore';
      algorithmId: string;
      showTimeSeries?: boolean;
      showCorrelationPlot?: boolean;
      showHistogram?: boolean;
      showBitVisualization?: boolean;
      showMultiState?: boolean;
      showRotations?: boolean;
    };

/**
 * Activity configuration - accepts typed configs or legacy Record pattern.
 * Gradually migrate from Record<string, unknown> to TypedActivityConfig.
 */
export type ActivityConfig = TypedActivityConfig | Record<string, unknown>;

/**
 * Lesson step definition - each lesson has multiple steps
 */
export interface LessonStep {
  id: string;
  type: 'narrative' | 'micro-teaching' | 'activity' | 'quiz' | 'completion';
  contentKey?: string;
  microTeaching?: MicroTeaching;
  activityType?: LessonActivityType;
  activityConfig?: ActivityConfig;
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
