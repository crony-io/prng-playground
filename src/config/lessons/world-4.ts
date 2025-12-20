import type { WorldDefinition, LessonDefinition } from '@/types/lessons';

export const WORLD_4: WorldDefinition = {
  id: 'world-4',
  order: 5,
  titleKey: 'learn.worlds.world4.title',
  descriptionKey: 'learn.worlds.world4.description',
  badgeKey: 'learn.worlds.world4.badge',
  badgeIcon: '🏗️',
  lessonIds: ['lesson-4-1', 'lesson-4-2', 'lesson-4-3', 'lesson-4-4'],
  unlockCondition: 'previous-world',
  estimatedMinutes: 20,
};

export const LESSON_4_1: LessonDefinition = {
  id: 'lesson-4-1',
  worldId: 'world-4',
  order: 1,
  titleKey: 'learn.lessons.lesson4_1.title',
  objectiveKey: 'learn.lessons.lesson4_1.objective',
  narrativeKey: 'learn.lessons.lesson4_1.narrative',
  algorithmId: 'mulberry32',
  steps: [
    {
      id: 'step-1',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson4_1.narrative',
    },
    {
      id: 'step-2',
      type: 'activity',
      activityType: 'fork-explore',
      activityConfig: {
        algorithmId: 'mulberry32',
        showBitVisualization: true,
        showHistogram: true,
        showCorrelationPlot: true,
      },
    },
    {
      id: 'step-3',
      type: 'quiz',
      quiz: [
        {
          id: 'q1',
          type: 'concept',
          questionKey: 'learn.lessons.lesson4_1.quiz.q1.question',
          options: [
            { key: 'learn.lessons.lesson4_1.quiz.q1.optionA', correct: false },
            { key: 'learn.lessons.lesson4_1.quiz.q1.optionB', correct: false },
            { key: 'learn.lessons.lesson4_1.quiz.q1.optionC', correct: true },
          ],
          feedbackCorrectKey: 'learn.lessons.lesson4_1.quiz.q1.correct',
          feedbackIncorrectKey: 'learn.lessons.lesson4_1.quiz.q1.incorrect',
        },
      ],
    },
    {
      id: 'step-4',
      type: 'completion',
      contentKey: 'learn.lessons.lesson4_1.completion',
    },
  ],
};

export const LESSON_4_2: LessonDefinition = {
  id: 'lesson-4-2',
  worldId: 'world-4',
  order: 2,
  titleKey: 'learn.lessons.lesson4_2.title',
  objectiveKey: 'learn.lessons.lesson4_2.objective',
  narrativeKey: 'learn.lessons.lesson4_2.narrative',
  steps: [
    {
      id: 'step-1',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson4_2.narrative',
    },
    {
      id: 'step-2',
      type: 'activity',
      activityType: 'interactive',
      activityConfig: {
        type: 'quality-lab',
        showAllTests: true,
        algorithms: ['simple-counter', 'lcg', 'xorshift32', 'mulberry32'],
      },
    },
    {
      id: 'step-3',
      type: 'quiz',
      quiz: [
        {
          id: 'q1',
          type: 'experiment',
          questionKey: 'learn.lessons.lesson4_2.quiz.q1.question',
          options: [
            { key: 'learn.lessons.lesson4_2.quiz.q1.optionA', correct: false },
            { key: 'learn.lessons.lesson4_2.quiz.q1.optionB', correct: true },
          ],
          feedbackCorrectKey: 'learn.lessons.lesson4_2.quiz.q1.correct',
          feedbackIncorrectKey: 'learn.lessons.lesson4_2.quiz.q1.incorrect',
        },
      ],
    },
    {
      id: 'step-4',
      type: 'completion',
      contentKey: 'learn.lessons.lesson4_2.completion',
    },
  ],
};

export const LESSON_4_3: LessonDefinition = {
  id: 'lesson-4-3',
  worldId: 'world-4',
  order: 3,
  titleKey: 'learn.lessons.lesson4_3.title',
  objectiveKey: 'learn.lessons.lesson4_3.objective',
  narrativeKey: 'learn.lessons.lesson4_3.narrative',
  steps: [
    {
      id: 'step-1',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson4_3.narrative',
    },
    {
      id: 'step-2',
      type: 'activity',
      activityType: 'sandbox',
      activityConfig: {
        type: 'designer-challenge',
        showAllOperations: true,
        showQualityTests: true,
        challenges: ['pass-histogram', 'under-5-ops', 'pass-all-tests'],
      },
    },
    {
      id: 'step-3',
      type: 'completion',
      contentKey: 'learn.lessons.lesson4_3.completion',
    },
  ],
};

export const LESSON_4_4: LessonDefinition = {
  id: 'lesson-4-4',
  worldId: 'world-4',
  order: 4,
  titleKey: 'learn.lessons.lesson4_4.title',
  objectiveKey: 'learn.lessons.lesson4_4.objective',
  narrativeKey: 'learn.lessons.lesson4_4.narrative',
  steps: [
    {
      id: 'step-1',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson4_4.narrative',
    },
    {
      id: 'step-2',
      type: 'activity',
      activityType: 'comparison',
      activityConfig: {
        algorithms: ['simple-counter', 'lcg', 'xorshift32', 'mulberry32'],
        showCorrelationPlot: true,
        showHistogram: true,
        showQualityTests: true,
        showComparativeTable: true,
      },
    },
    {
      id: 'step-3',
      type: 'quiz',
      quiz: [
        {
          id: 'q1',
          type: 'experiment',
          questionKey: 'learn.lessons.lesson4_4.quiz.q1.question',
          options: [
            { key: 'learn.lessons.lesson4_4.quiz.q1.optionA', correct: false },
            { key: 'learn.lessons.lesson4_4.quiz.q1.optionB', correct: true },
          ],
          feedbackCorrectKey: 'learn.lessons.lesson4_4.quiz.q1.correct',
          feedbackIncorrectKey: 'learn.lessons.lesson4_4.quiz.q1.incorrect',
        },
      ],
    },
    {
      id: 'step-4',
      type: 'completion',
      contentKey: 'learn.lessons.lesson4_4.completion',
    },
  ],
};

export const WORLD_4_LESSONS: LessonDefinition[] = [LESSON_4_1, LESSON_4_2, LESSON_4_3, LESSON_4_4];
