import type { DslAlgorithmDefinition } from '@/types/dsl';
import { executeStep, initializeState, type DslExecutionState } from '@/utils/dsl-executor';

import type {
  WorkshopDslRunnerWorkerRequest,
  WorkshopDslRunnerWorkerResponse,
} from '@/workers/dsl-runner-protocol';

type WorkerContext = {
  postMessage: (message: WorkshopDslRunnerWorkerResponse) => void;
  addEventListener: (
    type: 'message',
    listener: (event: MessageEvent<WorkshopDslRunnerWorkerRequest>) => void,
  ) => void;
};

const ctx = self as unknown as WorkerContext;

let algorithm: DslAlgorithmDefinition | null = null;
let seed = 0;

let state: DslExecutionState | null = null;
let previousState: DslExecutionState | null = null;
let stepCount = 0;

let taskToken = 0;
let stopRequested = false;

function postMessage(message: WorkshopDslRunnerWorkerResponse): void {
  ctx.postMessage(message);
}

function bumpTaskToken(): number {
  taskToken++;
  return taskToken;
}

function ensureAlgorithm(): DslAlgorithmDefinition {
  if (!algorithm) {
    throw new Error('No algorithm selected');
  }
  return algorithm;
}

function ensureState(): DslExecutionState {
  const alg = ensureAlgorithm();
  if (!state) {
    state = initializeState(alg, seed);
  }
  return state;
}

function doStep(): {
  value: number;
  state: DslExecutionState;
  previousState: DslExecutionState | null;
} {
  const alg = ensureAlgorithm();
  const current = ensureState();

  previousState = { ...current };
  const result = executeStep(alg, current);
  state = result.state;
  return { value: result.value, state: result.state, previousState };
}

function handleSetAlgorithm(nextAlgorithm: DslAlgorithmDefinition, nextSeed: number): void {
  algorithm = nextAlgorithm;
  seed = nextSeed;
  state = null;
  previousState = null;
  stepCount = 0;
}

function handleReset(nextSeed: number): void {
  seed = nextSeed;
  state = null;
  previousState = null;
  stepCount = 0;

  if (algorithm) {
    state = initializeState(algorithm, seed);
    postMessage({
      type: 'reset',
      state,
      stepCount,
    });
  }
}

function runStepsChunk(requestId: number, remaining: number, token: number): void {
  if (token !== taskToken) {
    if (algorithm) {
      postMessage({
        type: 'runChunk',
        requestId,
        values: [],
        state: state ?? initializeState(algorithm, seed),
        previousState,
        stepCount,
        done: true,
        stopped: true,
      });
    }
    return;
  }

  const chunkValues: number[] = [];
  const start = performance.now();

  try {
    while (
      remaining > 0 &&
      !stopRequested &&
      token === taskToken &&
      chunkValues.length < 1000 &&
      performance.now() - start < 16
    ) {
      const r = doStep();
      chunkValues.push(r.value);
      stepCount++;
      remaining--;
    }

    postMessage({
      type: 'runChunk',
      requestId,
      values: chunkValues,
      state: state ?? initializeState(ensureAlgorithm(), seed),
      previousState,
      stepCount,
      done: remaining === 0 || stopRequested || token !== taskToken,
      stopped: stopRequested || token !== taskToken,
    });

    if (remaining > 0 && !stopRequested && token === taskToken) {
      setTimeout(() => runStepsChunk(requestId, remaining, token), 0);
    }
  } catch (err) {
    postMessage({
      type: 'error',
      requestId,
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}

function startAuto(requestId: number, durationMs: number, token: number): void {
  if (token !== taskToken) {
    return;
  }

  const end = performance.now() + durationMs;

  function tick(): void {
    if (token !== taskToken) {
      if (algorithm) {
        postMessage({
          type: 'runChunk',
          requestId,
          values: [],
          state: state ?? initializeState(algorithm, seed),
          previousState,
          stepCount,
          done: true,
          stopped: true,
        });
      }
      return;
    }

    if (stopRequested) {
      postMessage({
        type: 'runChunk',
        requestId,
        values: [],
        state: state ?? initializeState(ensureAlgorithm(), seed),
        previousState,
        stepCount,
        done: true,
        stopped: true,
      });
      return;
    }

    const remainingMs = end - performance.now();
    if (remainingMs <= 0) {
      postMessage({
        type: 'runChunk',
        requestId,
        values: [],
        state: state ?? initializeState(ensureAlgorithm(), seed),
        previousState,
        stepCount,
        done: true,
        stopped: false,
      });
      return;
    }

    const chunkValues: number[] = [];
    const start = performance.now();

    try {
      while (
        performance.now() < end &&
        !stopRequested &&
        token === taskToken &&
        chunkValues.length < 1000 &&
        performance.now() - start < 16
      ) {
        const r = doStep();
        chunkValues.push(r.value);
        stepCount++;
      }

      postMessage({
        type: 'runChunk',
        requestId,
        values: chunkValues,
        state: state ?? initializeState(ensureAlgorithm(), seed),
        previousState,
        stepCount,
        done: performance.now() >= end || stopRequested || token !== taskToken,
        stopped: stopRequested || token !== taskToken,
      });

      if (!stopRequested && token === taskToken && performance.now() < end) {
        setTimeout(tick, 0);
      }
    } catch (err) {
      postMessage({
        type: 'error',
        requestId,
        message: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  tick();
}

ctx.addEventListener('message', (event: MessageEvent<WorkshopDslRunnerWorkerRequest>) => {
  const msg = event.data;

  try {
    switch (msg.type) {
      case 'setAlgorithm': {
        stopRequested = true;
        bumpTaskToken();
        stopRequested = false;
        handleSetAlgorithm(msg.algorithm, msg.seed);
        break;
      }
      case 'reset': {
        stopRequested = true;
        bumpTaskToken();
        stopRequested = false;
        handleReset(msg.seed);
        break;
      }
      case 'step': {
        stopRequested = false;
        bumpTaskToken();

        seed = msg.seed;

        const r = doStep();
        stepCount++;

        postMessage({
          type: 'stepResult',
          requestId: msg.requestId,
          value: r.value,
          state: r.state,
          previousState: r.previousState,
          stepCount,
        });
        break;
      }
      case 'runSteps': {
        stopRequested = false;
        const token = bumpTaskToken();
        seed = msg.seed;
        const steps = Math.max(0, Math.floor(msg.stepCount));
        runStepsChunk(msg.requestId, steps, token);
        break;
      }
      case 'startAuto': {
        stopRequested = false;
        const token = bumpTaskToken();
        seed = msg.seed;
        const duration = Math.max(0, Math.floor(msg.durationMs));
        startAuto(msg.requestId, duration, token);
        break;
      }
      case 'stop': {
        stopRequested = true;
        bumpTaskToken();
        break;
      }
      default: {
        const exhaustive: never = msg;
        void exhaustive;
      }
    }
  } catch (err) {
    postMessage({
      type: 'error',
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
});

postMessage({ type: 'ready' });
