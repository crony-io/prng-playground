import type { DslAlgorithmDefinition } from '@/types/dsl';
import type { DslExecutionState } from '@/utils/dsl-executor';

export type WorkshopDslRunnerWorkerRequest =
  | {
      type: 'setAlgorithm';
      algorithm: DslAlgorithmDefinition;
      seed: number;
    }
  | {
      type: 'reset';
      seed: number;
    }
  | {
      type: 'step';
      requestId: number;
      seed: number;
    }
  | {
      type: 'runSteps';
      requestId: number;
      stepCount: number;
      seed: number;
    }
  | {
      type: 'startAuto';
      requestId: number;
      durationMs: number;
      seed: number;
    }
  | {
      type: 'stop';
    };

export type WorkshopDslRunnerWorkerResponse =
  | {
      type: 'ready';
    }
  | {
      type: 'reset';
      state: DslExecutionState;
      stepCount: number;
    }
  | {
      type: 'stepResult';
      requestId: number;
      value: number;
      state: DslExecutionState;
      previousState: DslExecutionState | null;
      stepCount: number;
    }
  | {
      type: 'runChunk';
      requestId: number;
      values: number[];
      state: DslExecutionState;
      previousState: DslExecutionState | null;
      stepCount: number;
      done: boolean;
      stopped: boolean;
    }
  | {
      type: 'error';
      message: string;
      requestId?: number;
    };
