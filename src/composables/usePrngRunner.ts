import { ref, computed, shallowRef, readonly, onUnmounted, type Ref } from 'vue';
import type { PrngAlgorithmDefinition, PrngSeed } from '@/types/prng';
import { getAlgorithm, DEFAULT_ALGORITHM_ID } from '@/algorithms';
import { LIMITS } from '@/constants/limits';

export interface PrngSample {
  index: number;
  value: number;
}

export interface PrngRunnerError {
  key: string;
  params?: Record<string, unknown>;
}

export interface UsePrngRunnerOptions {
  maxSamplesInHistory?: number;
  maxStepsPerTick?: number;
  autorunIntervalMs?: number;
}

const DEFAULT_OPTIONS: Required<UsePrngRunnerOptions> = {
  maxSamplesInHistory: LIMITS.MAX_SAMPLES_IN_HISTORY,
  maxStepsPerTick: LIMITS.MAX_STEPS_PER_TICK,
  autorunIntervalMs: 50,
};

export function usePrngRunner(options: UsePrngRunnerOptions = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  const algorithmId = ref(DEFAULT_ALGORITHM_ID);
  const seed = ref<PrngSeed>('default');
  const state = shallowRef<unknown>(null);
  const previousState = shallowRef<unknown>(null);
  const samples = shallowRef<PrngSample[]>([]);
  const stepCount = ref(0);
  const isRunning = ref(false);
  const error = ref<PrngRunnerError | null>(null);

  let autorunInterval: ReturnType<typeof setInterval> | null = null;

  const algorithm = computed<PrngAlgorithmDefinition | undefined>(() => {
    return getAlgorithm(algorithmId.value);
  });

  const currentState = computed(() => {
    const alg = algorithm.value;
    if (!alg || state.value === null) {
      return null;
    }
    return alg.peekState ? alg.peekState(state.value) : state.value;
  });

  const prevState = computed(() => {
    const alg = algorithm.value;
    if (!alg || previousState.value === null) {
      return null;
    }
    return alg.peekState ? alg.peekState(previousState.value) : previousState.value;
  });

  const lastSample = computed<PrngSample | null>(() => {
    const s = samples.value;
    return s.length > 0 ? (s[s.length - 1] ?? null) : null;
  });

  function initialize() {
    const alg = algorithm.value;
    if (!alg) {
      error.value = {
        key: 'prngRunner.errors.algorithmNotFound',
        params: { id: algorithmId.value },
      };
      return false;
    }

    try {
      state.value = alg.init(seed.value);
      previousState.value = null;
      samples.value = [];
      stepCount.value = 0;
      error.value = null;
      return true;
    } catch {
      error.value = {
        key: 'prngRunner.errors.failedToInitialize',
      };
      return false;
    }
  }

  function step(): PrngSample | null {
    const alg = algorithm.value;
    if (!alg || state.value === null) {
      if (!initialize()) {
        return null;
      }
    }

    try {
      const result = alg!.next(state.value);

      if (typeof result.value !== 'number' || !Number.isFinite(result.value)) {
        error.value = { key: 'prngRunner.errors.invalidValue' };
        stopAutorun();
        return null;
      }

      if (result.value < 0 || result.value >= 1) {
        error.value = {
          key: 'prngRunner.errors.valueOutOfRange',
          params: { value: result.value },
        };
        stopAutorun();
        return null;
      }

      previousState.value = state.value;
      state.value = result.state;
      stepCount.value++;

      const sample: PrngSample = {
        index: stepCount.value,
        value: result.value,
      };

      const currentSamples = samples.value;
      if (currentSamples.length >= opts.maxSamplesInHistory) {
        samples.value = [...currentSamples.slice(1), sample];
      } else {
        samples.value = [...currentSamples, sample];
      }

      return sample;
    } catch {
      error.value = {
        key: 'prngRunner.errors.stepFailed',
      };
      stopAutorun();
      return null;
    }
  }

  function runN(count: number): PrngSample[] {
    const results: PrngSample[] = [];
    const steps = Math.min(count, opts.maxStepsPerTick);

    for (let i = 0; i < steps; i++) {
      const sample = step();
      if (sample === null) {
        break;
      }
      results.push(sample);
    }

    return results;
  }

  function startAutorun() {
    if (isRunning.value) {
      return;
    }

    if (state.value === null && !initialize()) {
      return;
    }

    isRunning.value = true;
    autorunInterval = setInterval(() => {
      if (error.value) {
        stopAutorun();
        return;
      }
      runN(opts.maxStepsPerTick);
    }, opts.autorunIntervalMs);
  }

  function stopAutorun() {
    if (autorunInterval !== null) {
      clearInterval(autorunInterval);
      autorunInterval = null;
    }
    isRunning.value = false;
  }

  function toggleAutorun() {
    if (isRunning.value) {
      stopAutorun();
    } else {
      startAutorun();
    }
  }

  function reset() {
    stopAutorun();
    initialize();
  }

  function reseed(newSeed: PrngSeed) {
    stopAutorun();
    seed.value = newSeed;
    initialize();
  }

  function setAlgorithm(id: string) {
    stopAutorun();
    algorithmId.value = id;
    initialize();
  }

  function clearError() {
    error.value = null;
  }

  function clearSamples() {
    samples.value = [];
    stepCount.value = 0;
  }

  initialize();

  onUnmounted(() => {
    stopAutorun();
  });

  return {
    algorithmId: readonly(algorithmId) as Readonly<Ref<string>>,
    algorithm,
    seed: readonly(seed) as Readonly<Ref<PrngSeed>>,
    state: currentState,
    previousState: prevState,
    samples: readonly(samples) as Readonly<Ref<readonly PrngSample[]>>,
    stepCount: readonly(stepCount),
    isRunning: readonly(isRunning),
    error: readonly(error) as Readonly<Ref<PrngRunnerError | null>>,
    lastSample,

    step,
    runN,
    startAutorun,
    stopAutorun,
    toggleAutorun,
    reset,
    reseed,
    setAlgorithm,
    clearError,
    clearSamples,
  };
}
