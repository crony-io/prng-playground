import type { WorldDefinition, LessonDefinition } from '@/types/lessons';

export const WORLD_5: WorldDefinition = {
  id: 'world-5',
  order: 6,
  titleKey: 'learn.worlds.world5.title',
  descriptionKey: 'learn.worlds.world5.description',
  badgeKey: 'learn.worlds.world5.badge',
  badgeIcon: '🏆',
  lessonIds: ['lesson-5-1', 'lesson-5-2', 'lesson-5-3', 'lesson-5-4'],
  unlockCondition: 'previous-world',
  estimatedMinutes: 25,
};

export const LESSON_5_1: LessonDefinition = {
  id: 'lesson-5-1',
  worldId: 'world-5',
  order: 1,
  titleKey: 'learn.lessons.lesson5_1.title',
  objectiveKey: 'learn.lessons.lesson5_1.objective',
  narrativeKey: 'learn.lessons.lesson5_1.narrative',
  algorithmId: 'sfc32',
  steps: [
    {
      id: 'step-1',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson5_1.narrative',
    },
    {
      id: 'step-2',
      type: 'activity',
      activityType: 'fork-explore',
      activityConfig: {
        algorithmId: 'sfc32',
        showMultiState: true,
        showBitVisualization: true,
      },
    },
    {
      id: 'step-3',
      type: 'quiz',
      quiz: [
        {
          id: 'q1',
          type: 'concept',
          questionKey: 'learn.lessons.lesson5_1.quiz.q1.question',
          options: [
            { key: 'learn.lessons.lesson5_1.quiz.q1.optionA', correct: false },
            { key: 'learn.lessons.lesson5_1.quiz.q1.optionB', correct: true },
            { key: 'learn.lessons.lesson5_1.quiz.q1.optionC', correct: false },
          ],
          feedbackCorrectKey: 'learn.lessons.lesson5_1.quiz.q1.correct',
          feedbackIncorrectKey: 'learn.lessons.lesson5_1.quiz.q1.incorrect',
        },
      ],
    },
    {
      id: 'step-4',
      type: 'completion',
      contentKey: 'learn.lessons.lesson5_1.completion',
    },
  ],
};

export const LESSON_5_2: LessonDefinition = {
  id: 'lesson-5-2',
  worldId: 'world-5',
  order: 2,
  titleKey: 'learn.lessons.lesson5_2.title',
  objectiveKey: 'learn.lessons.lesson5_2.objective',
  narrativeKey: 'learn.lessons.lesson5_2.narrative',
  algorithmId: 'xoshiro128ss',
  steps: [
    {
      id: 'step-1',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson5_2.narrative',
    },
    {
      id: 'step-2',
      type: 'activity',
      activityType: 'fork-explore',
      activityConfig: {
        algorithmId: 'xoshiro128ss',
        showMultiState: true,
        showRotations: true,
      },
    },
    {
      id: 'step-3',
      type: 'quiz',
      quiz: [
        {
          id: 'q1',
          type: 'concept',
          questionKey: 'learn.lessons.lesson5_2.quiz.q1.question',
          options: [
            { key: 'learn.lessons.lesson5_2.quiz.q1.optionA', correct: true },
            { key: 'learn.lessons.lesson5_2.quiz.q1.optionB', correct: false },
          ],
          feedbackCorrectKey: 'learn.lessons.lesson5_2.quiz.q1.correct',
          feedbackIncorrectKey: 'learn.lessons.lesson5_2.quiz.q1.incorrect',
        },
      ],
    },
    {
      id: 'step-4',
      type: 'completion',
      contentKey: 'learn.lessons.lesson5_2.completion',
    },
  ],
};

export const LESSON_5_3: LessonDefinition = {
  id: 'lesson-5-3',
  worldId: 'world-5',
  order: 3,
  titleKey: 'learn.lessons.lesson5_3.title',
  objectiveKey: 'learn.lessons.lesson5_3.objective',
  narrativeKey: 'learn.lessons.lesson5_3.narrative',
  steps: [
    {
      id: 'step-1',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson5_3.narrative',
    },
    {
      id: 'step-2',
      type: 'activity',
      activityType: 'interactive',
      activityConfig: {
        type: 'test-interpretation',
        showDetailedExplanations: true,
      },
    },
    {
      id: 'step-3',
      type: 'quiz',
      quiz: [
        {
          id: 'q1',
          type: 'concept',
          questionKey: 'learn.lessons.lesson5_3.quiz.q1.question',
          options: [
            { key: 'learn.lessons.lesson5_3.quiz.q1.optionA', correct: false },
            { key: 'learn.lessons.lesson5_3.quiz.q1.optionB', correct: true },
            { key: 'learn.lessons.lesson5_3.quiz.q1.optionC', correct: false },
          ],
          feedbackCorrectKey: 'learn.lessons.lesson5_3.quiz.q1.correct',
          feedbackIncorrectKey: 'learn.lessons.lesson5_3.quiz.q1.incorrect',
        },
      ],
    },
    {
      id: 'step-4',
      type: 'completion',
      contentKey: 'learn.lessons.lesson5_3.completion',
    },
  ],
};

export const LESSON_5_4: LessonDefinition = {
  id: 'lesson-5-4',
  worldId: 'world-5',
  order: 4,
  titleKey: 'learn.lessons.lesson5_4.title',
  objectiveKey: 'learn.lessons.lesson5_4.objective',
  narrativeKey: 'learn.lessons.lesson5_4.narrative',
  steps: [
    {
      id: 'step-1',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson5_4.narrative',
    },
    {
      id: 'step-2',
      type: 'activity',
      activityType: 'sandbox',
      activityConfig: {
        type: 'final-project',
        showAllOperations: true,
        showQualityTests: true,
        requireDocumentation: true,
      },
    },
    {
      id: 'step-3',
      type: 'completion',
      contentKey: 'learn.lessons.lesson5_4.completion',
    },
  ],
};

export const WORLD_5_LESSONS: LessonDefinition[] = [LESSON_5_1, LESSON_5_2, LESSON_5_3, LESSON_5_4];
