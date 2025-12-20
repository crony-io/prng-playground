import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { z } from 'zod';

import { createVersionedLocalStorage, makeStorageKey } from '@/utils/persistence';
import { DEFAULT_ALGORITHM_ID, ALGORITHM_IDS } from '@/algorithms';

const persistedPrngStateV1Schema = z.object({
  schemaVersion: z.literal(1),
  algorithmId: z.string(),
  seed: z.string(),
  sampleSize: z.number().int().min(1).max(100000),
});

type PersistedPrngStateV1 = z.infer<typeof persistedPrngStateV1Schema>;

const prngStorage = createVersionedLocalStorage<PersistedPrngStateV1>({
  key: makeStorageKey('prng', 'settings'),
  latestVersion: 1,
  schemas: {
    1: persistedPrngStateV1Schema,
  },
  coerce: (input) => {
    if (typeof input === 'object' && input !== null) {
      const value = input as Record<string, unknown>;
      if (value.schemaVersion == null) {
        return {
          schemaVersion: 1,
          algorithmId:
            typeof value.algorithmId === 'string' ? value.algorithmId : DEFAULT_ALGORITHM_ID,
          seed: typeof value.seed === 'string' ? value.seed : 'default',
          sampleSize: typeof value.sampleSize === 'number' ? value.sampleSize : 100,
        };
      }
    }
    return undefined;
  },
});

export const usePrngStore = defineStore('prng', () => {
  const persisted = prngStorage.read();

  const algorithmId = ref(persisted?.algorithmId ?? DEFAULT_ALGORITHM_ID);
  const seed = ref(persisted?.seed ?? 'default');
  const sampleSize = ref(persisted?.sampleSize ?? 100);

  function setAlgorithm(id: string) {
    if (ALGORITHM_IDS.includes(id as (typeof ALGORITHM_IDS)[number])) {
      algorithmId.value = id;
    }
  }

  function setSeed(value: string) {
    seed.value = value;
  }

  function setSampleSize(value: number) {
    sampleSize.value = Math.max(1, Math.min(100000, Math.floor(value)));
  }

  watch(
    [algorithmId, seed, sampleSize],
    ([alg, s, size]) => {
      const payload: PersistedPrngStateV1 = {
        schemaVersion: 1,
        algorithmId: alg,
        seed: s,
        sampleSize: size,
      };
      prngStorage.write(payload);
    },
    { immediate: true },
  );

  return {
    algorithmId,
    seed,
    sampleSize,
    setAlgorithm,
    setSeed,
    setSampleSize,
  };
});
