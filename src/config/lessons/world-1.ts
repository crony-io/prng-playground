import type { WorldDefinition, LessonDefinition } from '@/types/lessons';

export const WORLD_1: WorldDefinition = {
  id: 'world-1',
  order: 1,
  titleKey: 'learn.worlds.world1.title',
  descriptionKey: 'learn.worlds.world1.description',
  badgeKey: 'learn.worlds.world1.badge',
  badgeIcon: '🎖️',
  lessonIds: ['lesson-1-1', 'lesson-1-2', 'lesson-1-3', 'lesson-1-4'],
  unlockCondition: 'start',
  estimatedMinutes: 20,
};

export const LESSON_1_1: LessonDefinition = {
  id: 'lesson-1-1',
  worldId: 'world-1',
  order: 1,
  titleKey: 'learn.lessons.lesson1_1.title',
  objectiveKey: 'learn.lessons.lesson1_1.objective',
  narrativeKey: 'learn.lessons.lesson1_1.narrative',
  steps: [
    {
      id: 'step-1',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson1_1.narrative',
    },
    {
      id: 'step-2',
      type: 'activity',
      activityType: 'interactive',
      activityConfig: {
        type: 'reveal-number',
        revealValue: 42,
      },
    },
    {
      id: 'step-3',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson1_1.bridge',
    },
    {
      id: 'step-4',
      type: 'activity',
      activityType: 'interactive',
      activityConfig: {
        type: 'determinism-demo',
      },
    },
    {
      id: 'step-5',
      type: 'quiz',
      quiz: [
        {
          id: 'q1',
          type: 'concept',
          questionKey: 'learn.lessons.lesson1_1.quiz.q1.question',
          options: [
            { key: 'learn.lessons.lesson1_1.quiz.q1.optionA', correct: false },
            { key: 'learn.lessons.lesson1_1.quiz.q1.optionB', correct: true },
            { key: 'learn.lessons.lesson1_1.quiz.q1.optionC', correct: false },
          ],
          feedbackCorrectKey: 'learn.lessons.lesson1_1.quiz.q1.correct',
          feedbackIncorrectKey: 'learn.lessons.lesson1_1.quiz.q1.incorrect',
        },
      ],
    },
    {
      id: 'step-6',
      type: 'completion',
      contentKey: 'learn.lessons.lesson1_1.completion',
    },
  ],
};

export const LESSON_1_2: LessonDefinition = {
  id: 'lesson-1-2',
  worldId: 'world-1',
  order: 2,
  titleKey: 'learn.lessons.lesson1_2.title',
  objectiveKey: 'learn.lessons.lesson1_2.objective',
  narrativeKey: 'learn.lessons.lesson1_2.narrative',
  steps: [
    {
      id: 'step-1',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson1_2.narrative',
    },
    {
      id: 'step-2',
      type: 'activity',
      activityType: 'interactive',
      activityConfig: {
        type: 'seed-demo',
        seeds: [5, 100, 999],
      },
    },
    {
      id: 'step-3',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson1_2.reflection',
    },
    {
      id: 'step-4',
      type: 'quiz',
      quiz: [
        {
          id: 'q1',
          type: 'concept',
          questionKey: 'learn.lessons.lesson1_2.quiz.q1.question',
          options: [
            { key: 'learn.lessons.lesson1_2.quiz.q1.optionA', correct: true },
            { key: 'learn.lessons.lesson1_2.quiz.q1.optionB', correct: false },
            { key: 'learn.lessons.lesson1_2.quiz.q1.optionC', correct: false },
          ],
          feedbackCorrectKey: 'learn.lessons.lesson1_2.quiz.q1.correct',
          feedbackIncorrectKey: 'learn.lessons.lesson1_2.quiz.q1.incorrect',
        },
      ],
    },
    {
      id: 'step-5',
      type: 'completion',
      contentKey: 'learn.lessons.lesson1_2.completion',
    },
  ],
};

export const LESSON_1_3: LessonDefinition = {
  id: 'lesson-1-3',
  worldId: 'world-1',
  order: 3,
  titleKey: 'learn.lessons.lesson1_3.title',
  objectiveKey: 'learn.lessons.lesson1_3.objective',
  narrativeKey: 'learn.lessons.lesson1_3.narrative',
  algorithmId: 'simple-counter',
  allowedOperations: ['add'],
  steps: [
    {
      id: 'step-1',
      type: 'micro-teaching',
      microTeaching: {
        conceptKey: 'learn.microTeaching.counting.concept',
        visualType: 'counting',
        contentKey: 'learn.microTeaching.counting.content',
        insightKey: 'learn.microTeaching.counting.insight',
      },
    },
    {
      id: 'step-2',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson1_3.narrative',
    },
    {
      id: 'step-3',
      type: 'activity',
      activityType: 'sandbox',
      activityConfig: {
        algorithmId: 'simple-counter',
        showVisualization: 'time-series',
      },
    },
    {
      id: 'step-4',
      type: 'quiz',
      quiz: [
        {
          id: 'q1',
          type: 'concept',
          questionKey: 'learn.lessons.lesson1_3.quiz.q1.question',
          options: [
            { key: 'learn.lessons.lesson1_3.quiz.q1.optionA', correct: true },
            { key: 'learn.lessons.lesson1_3.quiz.q1.optionB', correct: false },
            { key: 'learn.lessons.lesson1_3.quiz.q1.optionC', correct: false },
          ],
          feedbackCorrectKey: 'learn.lessons.lesson1_3.quiz.q1.correct',
          feedbackIncorrectKey: 'learn.lessons.lesson1_3.quiz.q1.incorrect',
        },
      ],
    },
    {
      id: 'step-5',
      type: 'completion',
      contentKey: 'learn.lessons.lesson1_3.completion',
    },
  ],
};

export const LESSON_1_4: LessonDefinition = {
  id: 'lesson-1-4',
  worldId: 'world-1',
  order: 4,
  titleKey: 'learn.lessons.lesson1_4.title',
  objectiveKey: 'learn.lessons.lesson1_4.objective',
  narrativeKey: 'learn.lessons.lesson1_4.narrative',
  steps: [
    {
      id: 'step-1',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson1_4.narrative',
    },
    {
      id: 'step-2',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson1_4.hint',
    },
    {
      id: 'step-3',
      type: 'activity',
      activityType: 'comparison',
      activityConfig: {
        algorithms: ['simple-counter', 'xorshift32'],
        showCorrelationPlot: true,
      },
    },
    {
      id: 'step-4',
      type: 'quiz',
      quiz: [
        {
          id: 'q1',
          type: 'experiment',
          questionKey: 'learn.lessons.lesson1_4.quiz.q1.question',
          options: [
            { key: 'learn.lessons.lesson1_4.quiz.q1.optionA', correct: false },
            { key: 'learn.lessons.lesson1_4.quiz.q1.optionB', correct: false },
            { key: 'learn.lessons.lesson1_4.quiz.q1.optionC', correct: true },
          ],
          feedbackCorrectKey: 'learn.lessons.lesson1_4.quiz.q1.correct',
          feedbackIncorrectKey: 'learn.lessons.lesson1_4.quiz.q1.incorrect',
        },
      ],
    },
    {
      id: 'step-5',
      type: 'completion',
      contentKey: 'learn.lessons.lesson1_4.completion',
    },
  ],
};

export const WORLD_1_LESSONS: LessonDefinition[] = [LESSON_1_1, LESSON_1_2, LESSON_1_3, LESSON_1_4];
