import type { WorldDefinition, LessonDefinition } from '@/types/lessons';

export const WORLD_2: WorldDefinition = {
  id: 'world-2',
  order: 2,
  titleKey: 'learn.worlds.world2.title',
  descriptionKey: 'learn.worlds.world2.description',
  badgeKey: 'learn.worlds.world2.badge',
  badgeIcon: '🎖️',
  lessonIds: ['lesson-2-1', 'lesson-2-2', 'lesson-2-3', 'lesson-2-4', 'lesson-2-5'],
  unlockCondition: 'previous-world',
  estimatedMinutes: 25,
};

export const LESSON_2_1: LessonDefinition = {
  id: 'lesson-2-1',
  worldId: 'world-2',
  order: 1,
  titleKey: 'learn.lessons.lesson2_1.title',
  objectiveKey: 'learn.lessons.lesson2_1.objective',
  narrativeKey: 'learn.lessons.lesson2_1.narrative',
  steps: [
    {
      id: 'step-1',
      type: 'micro-teaching',
      microTeaching: {
        conceptKey: 'learn.microTeaching.multiplication.concept',
        visualType: 'multiplication-grid',
        contentKey: 'learn.microTeaching.multiplication.content',
        insightKey: 'learn.microTeaching.multiplication.insight',
      },
    },
    {
      id: 'step-2',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson2_1.narrative',
    },
    {
      id: 'step-3',
      type: 'activity',
      activityType: 'comparison',
      activityConfig: {
        type: 'add-vs-multiply',
        showTimeSeries: true,
      },
    },
    {
      id: 'step-4',
      type: 'quiz',
      quiz: [
        {
          id: 'q1',
          type: 'experiment',
          questionKey: 'learn.lessons.lesson2_1.quiz.q1.question',
          options: [
            { key: 'learn.lessons.lesson2_1.quiz.q1.optionA', correct: true },
            { key: 'learn.lessons.lesson2_1.quiz.q1.optionB', correct: false },
            { key: 'learn.lessons.lesson2_1.quiz.q1.optionC', correct: false },
          ],
          feedbackCorrectKey: 'learn.lessons.lesson2_1.quiz.q1.correct',
          feedbackIncorrectKey: 'learn.lessons.lesson2_1.quiz.q1.incorrect',
        },
      ],
    },
    {
      id: 'step-5',
      type: 'completion',
      contentKey: 'learn.lessons.lesson2_1.completion',
    },
  ],
};

export const LESSON_2_2: LessonDefinition = {
  id: 'lesson-2-2',
  worldId: 'world-2',
  order: 2,
  titleKey: 'learn.lessons.lesson2_2.title',
  objectiveKey: 'learn.lessons.lesson2_2.objective',
  narrativeKey: 'learn.lessons.lesson2_2.narrative',
  steps: [
    {
      id: 'step-1',
      type: 'micro-teaching',
      microTeaching: {
        conceptKey: 'learn.microTeaching.overflow.concept',
        visualType: 'overflow',
        contentKey: 'learn.microTeaching.overflow.content',
        insightKey: 'learn.microTeaching.overflow.insight',
      },
    },
    {
      id: 'step-2',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson2_2.narrative',
    },
    {
      id: 'step-3',
      type: 'activity',
      activityType: 'interactive',
      activityConfig: {
        type: 'overflow-demo',
      },
    },
    {
      id: 'step-4',
      type: 'quiz',
      quiz: [
        {
          id: 'q1',
          type: 'concept',
          questionKey: 'learn.lessons.lesson2_2.quiz.q1.question',
          options: [
            { key: 'learn.lessons.lesson2_2.quiz.q1.optionA', correct: false },
            { key: 'learn.lessons.lesson2_2.quiz.q1.optionB', correct: true },
            { key: 'learn.lessons.lesson2_2.quiz.q1.optionC', correct: false },
          ],
          feedbackCorrectKey: 'learn.lessons.lesson2_2.quiz.q1.correct',
          feedbackIncorrectKey: 'learn.lessons.lesson2_2.quiz.q1.incorrect',
        },
      ],
    },
    {
      id: 'step-5',
      type: 'completion',
      contentKey: 'learn.lessons.lesson2_2.completion',
    },
  ],
};

export const LESSON_2_3: LessonDefinition = {
  id: 'lesson-2-3',
  worldId: 'world-2',
  order: 3,
  titleKey: 'learn.lessons.lesson2_3.title',
  objectiveKey: 'learn.lessons.lesson2_3.objective',
  narrativeKey: 'learn.lessons.lesson2_3.narrative',
  steps: [
    {
      id: 'step-1',
      type: 'micro-teaching',
      microTeaching: {
        conceptKey: 'learn.microTeaching.remainder.concept',
        visualType: 'candy-distribution',
        contentKey: 'learn.microTeaching.remainder.content',
        insightKey: 'learn.microTeaching.remainder.insight',
      },
    },
    {
      id: 'step-2',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson2_3.narrative',
    },
    {
      id: 'step-3',
      type: 'activity',
      activityType: 'interactive',
      activityConfig: {
        type: 'modulo-wheel',
        modValue: 10,
      },
    },
    {
      id: 'step-4',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson2_3.primer',
    },
    {
      id: 'step-5',
      type: 'quiz',
      quiz: [
        {
          id: 'q1',
          type: 'concept',
          questionKey: 'learn.lessons.lesson2_3.quiz.q1.question',
          options: [
            { key: 'learn.lessons.lesson2_3.quiz.q1.optionA', correct: true },
            { key: 'learn.lessons.lesson2_3.quiz.q1.optionB', correct: false },
            { key: 'learn.lessons.lesson2_3.quiz.q1.optionC', correct: false },
          ],
          feedbackCorrectKey: 'learn.lessons.lesson2_3.quiz.q1.correct',
          feedbackIncorrectKey: 'learn.lessons.lesson2_3.quiz.q1.incorrect',
        },
      ],
    },
    {
      id: 'step-6',
      type: 'completion',
      contentKey: 'learn.lessons.lesson2_3.completion',
    },
  ],
};

export const LESSON_2_4: LessonDefinition = {
  id: 'lesson-2-4',
  worldId: 'world-2',
  order: 4,
  titleKey: 'learn.lessons.lesson2_4.title',
  objectiveKey: 'learn.lessons.lesson2_4.objective',
  narrativeKey: 'learn.lessons.lesson2_4.narrative',
  allowedOperations: ['mul', 'add'],
  steps: [
    {
      id: 'step-1',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson2_4.narrative',
    },
    {
      id: 'step-2',
      type: 'activity',
      activityType: 'interactive',
      activityConfig: {
        type: 'visual-calculator',
        initialValue: 1,
        allowedOperations: ['mul', 'add'],
      },
    },
    {
      id: 'step-3',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson2_4.warning',
    },
    {
      id: 'step-4',
      type: 'quiz',
      quiz: [
        {
          id: 'q1',
          type: 'debugging',
          questionKey: 'learn.lessons.lesson2_4.quiz.q1.question',
          options: [
            { key: 'learn.lessons.lesson2_4.quiz.q1.optionA', correct: false },
            { key: 'learn.lessons.lesson2_4.quiz.q1.optionB', correct: true },
            { key: 'learn.lessons.lesson2_4.quiz.q1.optionC', correct: false },
          ],
          feedbackCorrectKey: 'learn.lessons.lesson2_4.quiz.q1.correct',
          feedbackIncorrectKey: 'learn.lessons.lesson2_4.quiz.q1.incorrect',
          hints: ['learn.lessons.lesson2_4.quiz.q1.hint1'],
        },
      ],
    },
    {
      id: 'step-5',
      type: 'completion',
      contentKey: 'learn.lessons.lesson2_4.completion',
    },
  ],
};

export const LESSON_2_5: LessonDefinition = {
  id: 'lesson-2-5',
  worldId: 'world-2',
  order: 5,
  titleKey: 'learn.lessons.lesson2_5.title',
  objectiveKey: 'learn.lessons.lesson2_5.objective',
  narrativeKey: 'learn.lessons.lesson2_5.narrative',
  algorithmId: 'lcg',
  steps: [
    {
      id: 'step-1',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson2_5.narrative',
    },
    {
      id: 'step-2',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson2_5.formula',
    },
    {
      id: 'step-3',
      type: 'activity',
      activityType: 'fork-explore',
      activityConfig: {
        algorithmId: 'lcg',
        showHistogram: true,
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
          questionKey: 'learn.lessons.lesson2_5.quiz.q1.question',
          options: [
            { key: 'learn.lessons.lesson2_5.quiz.q1.optionA', correct: false },
            { key: 'learn.lessons.lesson2_5.quiz.q1.optionB', correct: true },
            { key: 'learn.lessons.lesson2_5.quiz.q1.optionC', correct: false },
          ],
          feedbackCorrectKey: 'learn.lessons.lesson2_5.quiz.q1.correct',
          feedbackIncorrectKey: 'learn.lessons.lesson2_5.quiz.q1.incorrect',
        },
      ],
    },
    {
      id: 'step-5',
      type: 'completion',
      contentKey: 'learn.lessons.lesson2_5.completion',
    },
  ],
};

export const WORLD_2_LESSONS: LessonDefinition[] = [
  LESSON_2_1,
  LESSON_2_2,
  LESSON_2_3,
  LESSON_2_4,
  LESSON_2_5,
];
