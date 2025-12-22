/**
 * Centralized configuration for application limits.
 * These values control various caps and defaults throughout the application.
 */

export const LIMITS = {
  /** Maximum number of samples to keep in history for charts and analysis */
  MAX_SAMPLES_IN_HISTORY: 10000,

  /** Maximum number of steps to run in a single batch */
  MAX_RUN_SIZE: 10000,

  /** Maximum auto-run duration in seconds */
  MAX_AUTO_DURATION_SECONDS: 3600,

  /** Maximum operations allowed per step in DSL execution (prevents infinite loops) */
  MAX_OPERATIONS_PER_STEP: 100,

  /** Default maximum points to display in time series charts */
  DEFAULT_CHART_MAX_POINTS: 500,

  /** Default maximum points to display in correlation plots */
  DEFAULT_CORRELATION_MAX_POINTS: 2000,

  /** Default number of bins for distribution histograms */
  DEFAULT_HISTOGRAM_BINS: 20,

  /** Maximum steps per tick for PRNG runner (performance) */
  MAX_STEPS_PER_TICK: 1000,

  // Activity-specific limits (extracted from LessonActivity components)

  /** Maximum counter history size for counter activities */
  MAX_COUNTER_HISTORY: 50,

  /** Initial counter steps for comparison activities */
  INITIAL_COUNTER_STEPS: 20,

  /** Maximum value for overflow demo (8-bit simulation) */
  OVERFLOW_MAX_VALUE: 256,

  /** Maximum overflow history size */
  OVERFLOW_HISTORY_SIZE: 20,

  /** Default sample count for algorithm comparison */
  DEFAULT_SAMPLE_COUNT: 100,

  /** Maximum recipe history size */
  MAX_RECIPE_HISTORY: 10,

  /** Minimum samples required for quality tests */
  MIN_SAMPLES_FOR_QUALITY_TESTS: 1000,
} as const;

export type Limits = typeof LIMITS;
