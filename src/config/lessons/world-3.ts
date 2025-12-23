import type { WorldDefinition, LessonDefinition } from '@/types/lessons';

export const WORLD_3: WorldDefinition = {
  id: 'world-3',
  order: 4,
  titleKey: 'learn.worlds.world3.title',
  descriptionKey: 'learn.worlds.world3.description',
  badgeKey: 'learn.worlds.world3.badge',
  badgeIcon: '⚡',
  lessonIds: ['lesson-3-1', 'lesson-3-2', 'lesson-3-3', 'lesson-3-4'],
  unlockCondition: 'previous-world',
  estimatedMinutes: 20,
};

export const LESSON_3_1: LessonDefinition = {
  id: 'lesson-3-1',
  worldId: 'world-3',
  order: 1,
  titleKey: 'learn.lessons.lesson3_1.title',
  objectiveKey: 'learn.lessons.lesson3_1.objective',
  narrativeKey: 'learn.lessons.lesson3_1.narrative',
  allowedOperations: ['shl', 'shr', 'ushr'],
  steps: [
    {
      id: 'step-1',
      type: 'micro-teaching',
      microTeaching: {
        conceptKey: 'learn.microTeaching.shift.concept',
        visualType: 'shift-demo',
        contentKey: 'learn.microTeaching.shift.content',
        insightKey: 'learn.microTeaching.shift.insight',
      },
    },
    {
      id: 'step-2',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson3_1.narrative',
    },
    {
      id: 'step-3',
      type: 'activity',
      activityType: 'interactive',
      activityConfig: {
        type: 'bit-shift-demo',
        showBitVisualization: true,
      },
    },
    {
      id: 'step-4',
      type: 'quiz',
      quiz: [
        {
          id: 'q1',
          type: 'concept',
          questionKey: 'learn.lessons.lesson3_1.quiz.q1.question',
          options: [
            { key: 'learn.lessons.lesson3_1.quiz.q1.optionA', correct: false },
            { key: 'learn.lessons.lesson3_1.quiz.q1.optionB', correct: true },
            { key: 'learn.lessons.lesson3_1.quiz.q1.optionC', correct: false },
          ],
          feedbackCorrectKey: 'learn.lessons.lesson3_1.quiz.q1.correct',
          feedbackIncorrectKey: 'learn.lessons.lesson3_1.quiz.q1.incorrect',
        },
      ],
    },
    {
      id: 'step-5',
      type: 'completion',
      contentKey: 'learn.lessons.lesson3_1.completion',
    },
  ],
};

export const LESSON_3_2: LessonDefinition = {
  id: 'lesson-3-2',
  worldId: 'world-3',
  order: 2,
  titleKey: 'learn.lessons.lesson3_2.title',
  objectiveKey: 'learn.lessons.lesson3_2.objective',
  narrativeKey: 'learn.lessons.lesson3_2.narrative',
  allowedOperations: ['xor'],
  steps: [
    {
      id: 'step-1',
      type: 'micro-teaching',
      microTeaching: {
        conceptKey: 'learn.microTeaching.xor.concept',
        visualType: 'xor-comparison',
        contentKey: 'learn.microTeaching.xor.content',
        insightKey: 'learn.microTeaching.xor.insight',
      },
    },
    {
      id: 'step-2',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson3_2.narrative',
    },
    {
      id: 'step-3',
      type: 'activity',
      activityType: 'interactive',
      activityConfig: {
        type: 'xor-experiment',
        showBitVisualization: true,
      },
    },
    {
      id: 'step-4',
      type: 'quiz',
      quiz: [
        {
          id: 'q1',
          type: 'concept',
          questionKey: 'learn.lessons.lesson3_2.quiz.q1.question',
          options: [
            { key: 'learn.lessons.lesson3_2.quiz.q1.optionA', correct: false },
            { key: 'learn.lessons.lesson3_2.quiz.q1.optionB', correct: true },
            { key: 'learn.lessons.lesson3_2.quiz.q1.optionC', correct: false },
          ],
          feedbackCorrectKey: 'learn.lessons.lesson3_2.quiz.q1.correct',
          feedbackIncorrectKey: 'learn.lessons.lesson3_2.quiz.q1.incorrect',
        },
      ],
    },
    {
      id: 'step-5',
      type: 'completion',
      contentKey: 'learn.lessons.lesson3_2.completion',
    },
  ],
};

export const LESSON_3_3: LessonDefinition = {
  id: 'lesson-3-3',
  worldId: 'world-3',
  order: 3,
  titleKey: 'learn.lessons.lesson3_3.title',
  objectiveKey: 'learn.lessons.lesson3_3.objective',
  narrativeKey: 'learn.lessons.lesson3_3.narrative',
  allowedOperations: ['xor', 'shl', 'ushr'],
  steps: [
    {
      id: 'step-1',
      type: 'micro-teaching',
      microTeaching: {
        conceptKey: 'learn.microTeaching.shiftXorCombo.concept',
        visualType: 'xor-comparison',
        contentKey: 'learn.microTeaching.shiftXorCombo.content',
        insightKey: 'learn.microTeaching.shiftXorCombo.insight',
      },
    },
    {
      id: 'step-2',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson3_3.narrative',
    },
    {
      id: 'step-3',
      type: 'activity',
      activityType: 'sandbox',
      activityConfig: {
        type: 'shift-xor-combine',
        showBitVisualization: true,
        showTimeSeries: true,
      },
    },
    {
      id: 'step-4',
      type: 'quiz',
      quiz: [
        {
          id: 'q1',
          type: 'concept',
          questionKey: 'learn.lessons.lesson3_3.quiz.q1.question',
          options: [
            { key: 'learn.lessons.lesson3_3.quiz.q1.optionA', correct: false },
            { key: 'learn.lessons.lesson3_3.quiz.q1.optionB', correct: true },
            { key: 'learn.lessons.lesson3_3.quiz.q1.optionC', correct: false },
          ],
          feedbackCorrectKey: 'learn.lessons.lesson3_3.quiz.q1.correct',
          feedbackIncorrectKey: 'learn.lessons.lesson3_3.quiz.q1.incorrect',
        },
      ],
    },
    {
      id: 'step-5',
      type: 'completion',
      contentKey: 'learn.lessons.lesson3_3.completion',
    },
  ],
};

export const LESSON_3_4: LessonDefinition = {
  id: 'lesson-3-4',
  worldId: 'world-3',
  order: 4,
  titleKey: 'learn.lessons.lesson3_4.title',
  objectiveKey: 'learn.lessons.lesson3_4.objective',
  narrativeKey: 'learn.lessons.lesson3_4.narrative',
  algorithmId: 'xorshift32',
  allowedOperations: ['xor', 'shl', 'ushr'],
  steps: [
    {
      id: 'step-1',
      type: 'micro-teaching',
      microTeaching: {
        conceptKey: 'learn.microTeaching.xorshift.concept',
        visualType: 'xor-comparison',
        contentKey: 'learn.microTeaching.xorshift.content',
        insightKey: 'learn.microTeaching.xorshift.insight',
      },
    },
    {
      id: 'step-2',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson3_4.narrative',
    },
    {
      id: 'step-3',
      type: 'activity',
      activityType: 'fork-explore',
      activityConfig: {
        algorithmId: 'xorshift32',
        showBitVisualization: true,
        showCorrelationPlot: true,
      },
    },
    {
      id: 'step-4',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson3_4.comparisonIntro',
    },
    {
      id: 'step-5',
      type: 'activity',
      activityType: 'comparison',
      activityConfig: {
        algorithms: ['lcg', 'xorshift32'],
        showCorrelationPlot: true,
      },
    },
    {
      id: 'step-6',
      type: 'quiz',
      quiz: [
        {
          id: 'q1',
          type: 'experiment',
          questionKey: 'learn.lessons.lesson3_4.quiz.q1.question',
          options: [
            { key: 'learn.lessons.lesson3_4.quiz.q1.optionA', correct: false },
            { key: 'learn.lessons.lesson3_4.quiz.q1.optionB', correct: true },
            { key: 'learn.lessons.lesson3_4.quiz.q1.optionC', correct: false },
          ],
          feedbackCorrectKey: 'learn.lessons.lesson3_4.quiz.q1.correct',
          feedbackIncorrectKey: 'learn.lessons.lesson3_4.quiz.q1.incorrect',
        },
      ],
    },
    {
      id: 'step-7',
      type: 'completion',
      contentKey: 'learn.lessons.lesson3_4.completion',
    },
  ],
};

export const WORLD_3_LESSONS: LessonDefinition[] = [LESSON_3_1, LESSON_3_2, LESSON_3_3, LESSON_3_4];
