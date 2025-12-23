<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const initialValue = ref(0b10110011);

// Xorshift32 uses 3 operations: x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
// For 8-bit demo: x ^= x << 2; x ^= x >>> 3; x ^= x << 1;
const step = ref(0);

const binaryInitial = computed(() => {
  return (initialValue.value >>> 0).toString(2).padStart(8, '0');
});

// Step 1: x ^= x << 2
const afterStep1 = computed(() => {
  const x = initialValue.value & 0xff;
  return (x ^ ((x << 2) & 0xff)) & 0xff;
});

const shiftedLeft1 = computed(() => {
  return ((initialValue.value << 2) & 0xff).toString(2).padStart(8, '0');
});

const binaryAfterStep1 = computed(() => {
  return (afterStep1.value >>> 0).toString(2).padStart(8, '0');
});

// Step 2: x ^= x >>> 3
const afterStep2 = computed(() => {
  const x = afterStep1.value;
  return (x ^ (x >>> 3)) & 0xff;
});

const shiftedRight2 = computed(() => {
  return (afterStep1.value >>> 3).toString(2).padStart(8, '0');
});

const binaryAfterStep2 = computed(() => {
  return (afterStep2.value >>> 0).toString(2).padStart(8, '0');
});

// Step 3: x ^= x << 1
const afterStep3 = computed(() => {
  const x = afterStep2.value;
  return (x ^ ((x << 1) & 0xff)) & 0xff;
});

const shiftedLeft3 = computed(() => {
  return ((afterStep2.value << 1) & 0xff).toString(2).padStart(8, '0');
});

const binaryAfterStep3 = computed(() => {
  return (afterStep3.value >>> 0).toString(2).padStart(8, '0');
});

function nextStep() {
  if (step.value < 3) {
    step.value++;
  }
}

function reset() {
  step.value = 0;
  initialValue.value = Math.floor(Math.random() * 256);
}

function randomize() {
  initialValue.value = Math.floor(Math.random() * 256);
  step.value = 0;
}
</script>

<template>
  <div class="flex flex-col gap-4 items-center w-full max-w-md">
    <!-- Controls -->
    <div class="flex gap-3 items-center flex-wrap justify-center">
      <label class="flex flex-col items-center gap-1">
        <span class="text-xs text-muted">{{ t('learn.microTeaching.xorshift.initialValue') }}</span>
        <input
          v-model.number="initialValue"
          type="number"
          min="0"
          max="255"
          class="w-20 px-2 py-1 text-center font-mono bg-page border border-border rounded focus:border-primary focus:outline-none"
          @change="step = 0"
        />
      </label>
      <button class="btn-outline text-sm" @click="randomize">
        {{ t('learn.microTeaching.xorshift.random') }}
      </button>
    </div>

    <!-- Algorithm steps visualization -->
    <div class="w-full space-y-3">
      <!-- Initial state -->
      <div class="p-3 bg-surface rounded-lg">
        <div class="text-xs text-muted mb-2">
          {{ t('learn.microTeaching.xorshift.initial') }}: x = {{ initialValue }}
        </div>
        <div class="flex justify-center gap-0.5">
          <span
            v-for="(bit, idx) in binaryInitial"
            :key="'init-' + idx"
            class="w-6 h-7 flex items-center justify-center rounded text-xs font-mono"
            :class="bit === '1' ? 'bg-primary text-page' : 'bg-page text-muted'"
          >
            {{ bit }}
          </span>
        </div>
      </div>

      <!-- Step 1: x ^= x << 2 -->
      <div v-if="step >= 1" class="p-3 bg-surface rounded-lg border-l-4 border-blue-500">
        <div class="text-xs text-blue-400 mb-2 font-mono">
          {{ t('learn.microTeaching.xorshift.step1') }}: x ^= x &lt;&lt; 2
        </div>
        <div class="flex flex-col gap-1 items-center">
          <div class="flex items-center gap-2">
            <span class="text-xs text-muted w-16 text-right">x:</span>
            <div class="flex gap-0.5">
              <span
                v-for="(bit, idx) in binaryInitial"
                :key="'s1-x-' + idx"
                class="w-5 h-6 flex items-center justify-center rounded text-xs font-mono"
                :class="bit === '1' ? 'bg-primary/50 text-page' : 'bg-page text-muted'"
              >
                {{ bit }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-blue-400 w-16 text-right">x&lt;&lt;2:</span>
            <div class="flex gap-0.5">
              <span
                v-for="(bit, idx) in shiftedLeft1"
                :key="'s1-shift-' + idx"
                class="w-5 h-6 flex items-center justify-center rounded text-xs font-mono"
                :class="bit === '1' ? 'bg-blue-500/50 text-page' : 'bg-page text-muted'"
              >
                {{ bit }}
              </span>
            </div>
          </div>
          <div class="text-xs text-muted">↓ XOR</div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-accent w-16 text-right font-bold"
              >{{ t('learn.microTeaching.xorshift.result') }}:</span
            >
            <div class="flex gap-0.5">
              <span
                v-for="(bit, idx) in binaryAfterStep1"
                :key="'s1-res-' + idx"
                class="w-5 h-6 flex items-center justify-center rounded text-xs font-mono"
                :class="bit === '1' ? 'bg-accent text-page' : 'bg-page text-muted'"
              >
                {{ bit }}
              </span>
            </div>
            <span class="text-xs text-accent font-mono">= {{ afterStep1 }}</span>
          </div>
        </div>
      </div>

      <!-- Step 2: x ^= x >>> 3 -->
      <div v-if="step >= 2" class="p-3 bg-surface rounded-lg border-l-4 border-green-500">
        <div class="text-xs text-green-400 mb-2 font-mono">
          {{ t('learn.microTeaching.xorshift.step2') }}: x ^= x &gt;&gt;&gt; 3
        </div>
        <div class="flex flex-col gap-1 items-center">
          <div class="flex items-center gap-2">
            <span class="text-xs text-muted w-16 text-right">x:</span>
            <div class="flex gap-0.5">
              <span
                v-for="(bit, idx) in binaryAfterStep1"
                :key="'s2-x-' + idx"
                class="w-5 h-6 flex items-center justify-center rounded text-xs font-mono"
                :class="bit === '1' ? 'bg-accent/50 text-page' : 'bg-page text-muted'"
              >
                {{ bit }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-green-400 w-16 text-right">x&gt;&gt;&gt;3:</span>
            <div class="flex gap-0.5">
              <span
                v-for="(bit, idx) in shiftedRight2"
                :key="'s2-shift-' + idx"
                class="w-5 h-6 flex items-center justify-center rounded text-xs font-mono"
                :class="bit === '1' ? 'bg-green-500/50 text-page' : 'bg-page text-muted'"
              >
                {{ bit }}
              </span>
            </div>
          </div>
          <div class="text-xs text-muted">↓ XOR</div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-accent w-16 text-right font-bold"
              >{{ t('learn.microTeaching.xorshift.result') }}:</span
            >
            <div class="flex gap-0.5">
              <span
                v-for="(bit, idx) in binaryAfterStep2"
                :key="'s2-res-' + idx"
                class="w-5 h-6 flex items-center justify-center rounded text-xs font-mono"
                :class="bit === '1' ? 'bg-accent text-page' : 'bg-page text-muted'"
              >
                {{ bit }}
              </span>
            </div>
            <span class="text-xs text-accent font-mono">= {{ afterStep2 }}</span>
          </div>
        </div>
      </div>

      <!-- Step 3: x ^= x << 1 -->
      <div v-if="step >= 3" class="p-3 bg-surface rounded-lg border-l-4 border-purple-500">
        <div class="text-xs text-purple-400 mb-2 font-mono">
          {{ t('learn.microTeaching.xorshift.step3') }}: x ^= x &lt;&lt; 1
        </div>
        <div class="flex flex-col gap-1 items-center">
          <div class="flex items-center gap-2">
            <span class="text-xs text-muted w-16 text-right">x:</span>
            <div class="flex gap-0.5">
              <span
                v-for="(bit, idx) in binaryAfterStep2"
                :key="'s3-x-' + idx"
                class="w-5 h-6 flex items-center justify-center rounded text-xs font-mono"
                :class="bit === '1' ? 'bg-accent/50 text-page' : 'bg-page text-muted'"
              >
                {{ bit }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-purple-400 w-16 text-right">x&lt;&lt;1:</span>
            <div class="flex gap-0.5">
              <span
                v-for="(bit, idx) in shiftedLeft3"
                :key="'s3-shift-' + idx"
                class="w-5 h-6 flex items-center justify-center rounded text-xs font-mono"
                :class="bit === '1' ? 'bg-purple-500/50 text-page' : 'bg-page text-muted'"
              >
                {{ bit }}
              </span>
            </div>
          </div>
          <div class="text-xs text-muted">↓ XOR</div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-green-400 w-16 text-right font-bold"
              >{{ t('learn.microTeaching.xorshift.final') }}:</span
            >
            <div class="flex gap-0.5">
              <span
                v-for="(bit, idx) in binaryAfterStep3"
                :key="'s3-res-' + idx"
                class="w-5 h-6 flex items-center justify-center rounded text-xs font-mono bg-green-500 text-page font-bold"
              >
                {{ bit }}
              </span>
            </div>
            <span class="text-xs text-green-400 font-mono font-bold">= {{ afterStep3 }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex gap-3">
      <button v-if="step < 3" class="btn-primary" @click="nextStep">
        {{ t('learn.microTeaching.xorshift.nextStep') }}
      </button>
      <button class="btn-outline" @click="reset">
        {{ t('learn.activities.reset') }}
      </button>
    </div>

    <!-- Summary -->
    <div v-if="step === 3" class="text-center p-3 bg-green-500/10 rounded-lg">
      <div class="text-sm text-green-400 font-bold">{{ initialValue }} → {{ afterStep3 }}</div>
      <div class="text-xs text-muted mt-1">
        {{ t('learn.microTeaching.xorshift.summary') }}
      </div>
    </div>
  </div>
</template>
