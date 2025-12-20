import { ref, shallowRef, readonly, onUnmounted, toRaw, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { LIMITS } from '@/constants/limits';
import type { DslAlgorithmDefinition } from '@/types/dsl';
import type { DslExecutionState } from '@/utils/dsl-executor';

import type {
  WorkshopDslRunnerWorkerRequest,
  WorkshopDslRunnerWorkerResponse,
} from '@/workers/dsl-runner-protocol';

export interface DslRunnerOptions {
  maxSamplesInHistory?: number;
}

const DEFAULT_OPTIONS: Required<DslRunnerOptions> = {
  maxSamplesInHistory: LIMITS.MAX_SAMPLES_IN_HISTORY,
};

export function useDslRunner(options: DslRunnerOptions = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  const { t } = useI18n();

  const isReady = ref(false);
  const isRunning = ref(false);
  const error = ref<string | null>(null);

  const state = shallowRef<DslExecutionState | null>(null);
  const previousState = shallowRef<DslExecutionState | null>(null);
  const samples = shallowRef<number[]>([]);
  const stepCount = ref(0);

  let worker: Worker | null = null;

  let requestIdCounter = 0;
  let activeRunRequestId: number | null = null;
  let activeStepRequestId: number | null = null;

  function nextRequestId(): number {
    requestIdCounter++;
    return requestIdCounter;
  }

  function appendSamples(values: readonly number[]): void {
    if (values.length === 0) {
      return;
    }

    const current = samples.value;
    const nextLength = current.length + values.length;

    if (nextLength <= opts.maxSamplesInHistory) {
      samples.value = [...current, ...values];
      return;
    }

    const overflow = nextLength - opts.maxSamplesInHistory;

    if (overflow >= current.length) {
      samples.value = values.slice(overflow - current.length);
      return;
    }

    samples.value = [...current.slice(overflow), ...values];
  }

  function clearLocalState(): void {
    state.value = null;
    previousState.value = null;
    samples.value = [];
    stepCount.value = 0;
    error.value = null;
  }

  function handleWorkerMessage(message: WorkshopDslRunnerWorkerResponse): void {
    switch (message.type) {
      case 'ready': {
        isReady.value = true;
        break;
      }
      case 'reset': {
        break;
      }
      case 'stepResult': {
        if (activeStepRequestId !== message.requestId) {
          return;
        }

        state.value = message.state;
        previousState.value = message.previousState;
        stepCount.value = message.stepCount;
        appendSamples([message.value]);
        error.value = null;
        break;
      }
      case 'runChunk': {
        if (activeRunRequestId !== message.requestId) {
          return;
        }

        state.value = message.state;
        previousState.value = message.previousState;
        stepCount.value = message.stepCount;
        appendSamples(message.values);
        error.value = null;

        if (message.done) {
          isRunning.value = false;
          activeRunRequestId = null;
        }
        break;
      }
      case 'error': {
        if (
          typeof message.requestId === 'number' &&
          message.requestId !== activeRunRequestId &&
          message.requestId !== activeStepRequestId
        ) {
          return;
        }

        isRunning.value = false;
        activeRunRequestId = null;
        error.value = message.message;
        break;
      }
      default: {
        const exhaustive: never = message;
        void exhaustive;
      }
    }
  }

  function ensureWorker(): Worker {
    if (worker) {
      return worker;
    }

    worker = new Worker(new URL('@/workers/dsl-runner.worker.ts', import.meta.url), {
      type: 'module',
    });

    worker.addEventListener('message', (event: MessageEvent<WorkshopDslRunnerWorkerResponse>) => {
      handleWorkerMessage(event.data);
    });

    worker.addEventListener('error', () => {
      isRunning.value = false;
      activeRunRequestId = null;
      error.value = t('common.unknownError');
    });

    return worker;
  }

  function cloneAlgorithmForWorker(algorithm: DslAlgorithmDefinition): DslAlgorithmDefinition {
    const raw = toRaw(algorithm) as DslAlgorithmDefinition;

    try {
      return structuredClone(raw);
    } catch {
      return JSON.parse(JSON.stringify(raw)) as DslAlgorithmDefinition;
    }
  }

  function postMessage(message: WorkshopDslRunnerWorkerRequest): void {
    try {
      ensureWorker().postMessage(message);
    } catch {
      isRunning.value = false;
      activeRunRequestId = null;
      activeStepRequestId = null;
      error.value = t('common.unknownError');
    }
  }

  function setAlgorithm(algorithm: DslAlgorithmDefinition, seed: number): void {
    stop();
    clearLocalState();
    postMessage({ type: 'setAlgorithm', algorithm: cloneAlgorithmForWorker(algorithm), seed });
  }

  function reset(seed: number): void {
    stop();
    clearLocalState();
    postMessage({ type: 'reset', seed });
  }

  function step(seed: number): void {
    stop();

    const requestId = nextRequestId();
    activeStepRequestId = requestId;

    postMessage({ type: 'step', requestId, seed });
  }

  function runSteps(stepCount: number, seed: number): void {
    stop();

    const requestId = nextRequestId();
    activeRunRequestId = requestId;
    isRunning.value = true;
    error.value = null;

    postMessage({ type: 'runSteps', requestId, stepCount, seed });
  }

  function startAuto(durationMs: number, seed: number): void {
    stop();

    const requestId = nextRequestId();
    activeRunRequestId = requestId;
    isRunning.value = true;
    error.value = null;

    postMessage({ type: 'startAuto', requestId, durationMs, seed });
  }

  function stop(): void {
    isRunning.value = false;
    activeRunRequestId = null;
    activeStepRequestId = null;

    if (!worker) {
      return;
    }

    postMessage({ type: 'stop' });
  }

  onUnmounted(() => {
    if (worker) {
      worker.terminate();
      worker = null;
    }
  });

  ensureWorker();

  return {
    isReady: readonly(isReady),
    isRunning: readonly(isRunning),
    error: readonly(error) as Readonly<Ref<string | null>>,

    state: readonly(state) as Readonly<Ref<DslExecutionState | null>>,
    previousState: readonly(previousState) as Readonly<Ref<DslExecutionState | null>>,
    samples: readonly(samples) as Readonly<Ref<readonly number[]>>,
    stepCount: readonly(stepCount),

    setAlgorithm,
    reset,
    step,
    runSteps,
    startAuto,
    stop,
  };
}
