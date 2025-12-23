import type { WorldDefinition, LessonDefinition } from '@/types/lessons';

export const WORLD_2_5: WorldDefinition = {
  id: 'world-2-5',
  order: 3,
  titleKey: 'learn.worlds.world2_5.title',
  descriptionKey: 'learn.worlds.world2_5.description',
  badgeKey: 'learn.worlds.world2_5.badge',
  badgeIcon: '💡',
  lessonIds: ['lesson-2-5-1', 'lesson-2-5-2', 'lesson-2-5-3'],
  unlockCondition: 'previous-world',
  estimatedMinutes: 15,
};

export const LESSON_2_5_1: LessonDefinition = {
  id: 'lesson-2-5-1',
  worldId: 'world-2-5',
  order: 1,
  titleKey: 'learn.lessons.lesson2_5_1.title',
  objectiveKey: 'learn.lessons.lesson2_5_1.objective',
  narrativeKey: 'learn.lessons.lesson2_5_1.narrative',
  steps: [
    {
      id: 'step-1',
      type: 'micro-teaching',
      microTeaching: {
        conceptKey: 'learn.microTeaching.binarySearch.concept',
        visualType: 'binary-search',
        contentKey: 'learn.microTeaching.binarySearch.content',
        insightKey: 'learn.microTeaching.binarySearch.insight',
      },
    },
    {
      id: 'step-2',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson2_5_1.narrative',
    },
    {
      id: 'step-3',
      type: 'activity',
      activityType: 'interactive',
      activityConfig: {
        type: 'binary-guessing-game',
        maxNumber: 16,
        questionsNeeded: 4,
      },
    },
    {
      id: 'step-4',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson2_5_1.binaryConnection',
    },
    {
      id: 'step-5',
      type: 'quiz',
      quiz: [
        {
          id: 'q1',
          type: 'concept',
          questionKey: 'learn.lessons.lesson2_5_1.quiz.q1.question',
          options: [
            { key: 'learn.lessons.lesson2_5_1.quiz.q1.optionA', correct: false },
            { key: 'learn.lessons.lesson2_5_1.quiz.q1.optionB', correct: true },
            { key: 'learn.lessons.lesson2_5_1.quiz.q1.optionC', correct: false },
          ],
          feedbackCorrectKey: 'learn.lessons.lesson2_5_1.quiz.q1.correct',
          feedbackIncorrectKey: 'learn.lessons.lesson2_5_1.quiz.q1.incorrect',
        },
      ],
    },
    {
      id: 'step-6',
      type: 'completion',
      contentKey: 'learn.lessons.lesson2_5_1.completion',
    },
  ],
};

export const LESSON_2_5_2: LessonDefinition = {
  id: 'lesson-2-5-2',
  worldId: 'world-2-5',
  order: 2,
  titleKey: 'learn.lessons.lesson2_5_2.title',
  objectiveKey: 'learn.lessons.lesson2_5_2.objective',
  narrativeKey: 'learn.lessons.lesson2_5_2.narrative',
  steps: [
    {
      id: 'step-1',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson2_5_2.narrative',
    },
    {
      id: 'step-2',
      type: 'activity',
      activityType: 'interactive',
      activityConfig: {
        type: 'bit-toggle',
        bitCount: 4,
      },
    },
    {
      id: 'step-3',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson2_5_2.insight',
    },
    {
      id: 'step-4',
      type: 'quiz',
      quiz: [
        {
          id: 'q1',
          type: 'concept',
          questionKey: 'learn.lessons.lesson2_5_2.quiz.q1.question',
          options: [
            { key: 'learn.lessons.lesson2_5_2.quiz.q1.optionA', correct: true },
            { key: 'learn.lessons.lesson2_5_2.quiz.q1.optionB', correct: false },
            { key: 'learn.lessons.lesson2_5_2.quiz.q1.optionC', correct: false },
          ],
          feedbackCorrectKey: 'learn.lessons.lesson2_5_2.quiz.q1.correct',
          feedbackIncorrectKey: 'learn.lessons.lesson2_5_2.quiz.q1.incorrect',
        },
      ],
    },
    {
      id: 'step-5',
      type: 'completion',
      contentKey: 'learn.lessons.lesson2_5_2.completion',
    },
  ],
};

export const LESSON_2_5_3: LessonDefinition = {
  id: 'lesson-2-5-3',
  worldId: 'world-2-5',
  order: 3,
  titleKey: 'learn.lessons.lesson2_5_3.title',
  objectiveKey: 'learn.lessons.lesson2_5_3.objective',
  narrativeKey: 'learn.lessons.lesson2_5_3.narrative',
  steps: [
    {
      id: 'step-1',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson2_5_3.narrative',
    },
    {
      id: 'step-2',
      type: 'activity',
      activityType: 'interactive',
      activityConfig: {
        type: 'bit-toggle',
        bitCount: 8,
        showPreview32: true,
      },
    },
    {
      id: 'step-3',
      type: 'narrative',
      contentKey: 'learn.lessons.lesson2_5_3.primer',
    },
    {
      id: 'step-4',
      type: 'quiz',
      quiz: [
        {
          id: 'q1',
          type: 'concept',
          questionKey: 'learn.lessons.lesson2_5_3.quiz.q1.question',
          options: [
            { key: 'learn.lessons.lesson2_5_3.quiz.q1.optionA', correct: false },
            { key: 'learn.lessons.lesson2_5_3.quiz.q1.optionB', correct: true },
            { key: 'learn.lessons.lesson2_5_3.quiz.q1.optionC', correct: false },
          ],
          feedbackCorrectKey: 'learn.lessons.lesson2_5_3.quiz.q1.correct',
          feedbackIncorrectKey: 'learn.lessons.lesson2_5_3.quiz.q1.incorrect',
        },
      ],
    },
    {
      id: 'step-5',
      type: 'completion',
      contentKey: 'learn.lessons.lesson2_5_3.completion',
    },
  ],
};

export const WORLD_2_5_LESSONS: LessonDefinition[] = [LESSON_2_5_1, LESSON_2_5_2, LESSON_2_5_3];
