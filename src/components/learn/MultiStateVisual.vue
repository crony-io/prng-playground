<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

interface StateVar {
  name: string;
  value: number;
  color: string;
}

const states = ref<StateVar[]>([
  { name: 'a', value: 42, color: 'primary' },
  { name: 'b', value: 17, color: 'accent' },
  { name: 'c', value: 99, color: 'success' },
  { name: 'd', value: 5, color: 'warning' },
]);

const stepCount = ref(0);
const activeConnections = ref<[number, number][]>([]);
const lastOperation = ref('');

function step() {
  stepCount.value++;

  // Simulate SFC32-like operations where variables interact
  const stateA = states.value[0];
  const stateB = states.value[1];
  const stateC = states.value[2];
  const stateD = states.value[3];

  if (!stateA || !stateB || !stateC || !stateD) {
    return;
  }

  const a = stateA.value;
  const b = stateB.value;
  const c = stateC.value;
  const d = stateD.value;

  // Show which variables are mixing
  activeConnections.value = [];

  // a affects output and mixes with b
  const newA = (b + c) & 0xff;
  activeConnections.value.push([1, 0], [2, 0]);

  // b rotates and mixes with c
  const newB = (c ^ (c >>> 3)) & 0xff;
  activeConnections.value.push([2, 1]);

  // c uses a
  const newC = (a + (a << 2)) & 0xff;
  activeConnections.value.push([0, 2]);

  // d is a simple counter
  const newD = (d + 1) & 0xff;

  stateA.value = newA;
  stateB.value = newB;
  stateC.value = newC;
  stateD.value = newD;

  lastOperation.value = t('learn.multiState.mixed');

  // Clear connections after animation
  setTimeout(() => {
    activeConnections.value = [];
  }, 500);
}

function reset() {
  const stateA = states.value[0];
  const stateB = states.value[1];
  const stateC = states.value[2];
  const stateD = states.value[3];

  if (stateA) {
    stateA.value = 42;
  }
  if (stateB) {
    stateB.value = 17;
  }
  if (stateC) {
    stateC.value = 99;
  }
  if (stateD) {
    stateD.value = 5;
  }

  stepCount.value = 0;
  activeConnections.value = [];
  lastOperation.value = '';
}

const stateSpaceSize = computed(() => {
  // 4 variables × 256 values each = 256^4
  return '4,294,967,296';
});

function getColorClass(color: string, type: 'bg' | 'border' | 'text') {
  const map: Record<string, Record<string, string>> = {
    primary: { bg: 'bg-primary/20', border: 'border-primary', text: 'text-primary' },
    accent: { bg: 'bg-accent/20', border: 'border-accent', text: 'text-accent' },
    success: { bg: 'bg-green-500/20', border: 'border-green-500', text: 'text-green-500' },
    warning: { bg: 'bg-amber-500/20', border: 'border-amber-500', text: 'text-amber-500' },
  };
  return map[color]?.[type] ?? '';
}
</script>

<template>
  <div class="flex flex-col items-center gap-6 p-6 glass rounded-xl max-w-[500px]">
    <div class="text-lg font-semibold text-body">{{ t('learn.multiState.title') }}</div>

    <!-- State variables grid with connections -->
    <div class="relative">
      <!-- Connection lines (SVG overlay) -->
      <svg
        class="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 280 200"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="currentColor" class="text-primary" />
          </marker>
        </defs>
        <!-- Draw active connections -->
        <line
          v-for="([from, to], idx) in activeConnections"
          :key="idx"
          :x1="70 + (from % 2) * 140"
          :y1="50 + Math.floor(from / 2) * 100"
          :x2="70 + (to % 2) * 140"
          :y2="50 + Math.floor(to / 2) * 100"
          stroke="currentColor"
          stroke-width="2"
          marker-end="url(#arrowhead)"
          class="text-primary animate-pulse"
        />
      </svg>

      <!-- 2x2 grid of state boxes -->
      <div class="grid grid-cols-2 gap-6">
        <div
          v-for="(state, idx) in states"
          :key="state.name"
          class="flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300"
          :class="[
            getColorClass(state.color, 'bg'),
            getColorClass(state.color, 'border'),
            activeConnections.some(([from, to]) => to === idx) ? 'scale-105 shadow-lg' : '',
          ]"
        >
          <span class="text-sm font-mono font-bold" :class="getColorClass(state.color, 'text')">
            {{ state.name }}
          </span>
          <span class="text-2xl font-mono font-bold text-body">
            {{ state.value }}
          </span>
        </div>
      </div>
    </div>

    <!-- Step counter and state space -->
    <div class="flex gap-6 text-sm">
      <div class="flex flex-col items-center">
        <span class="text-muted">{{ t('learn.multiState.steps') }}</span>
        <span class="font-mono font-bold text-primary text-lg">{{ stepCount }}</span>
      </div>
      <div class="flex flex-col items-center">
        <span class="text-muted">{{ t('learn.multiState.possibleStates') }}</span>
        <span class="font-mono font-bold text-accent text-lg">{{ stateSpaceSize }}</span>
      </div>
    </div>

    <!-- Last operation -->
    <div v-if="lastOperation" class="text-sm text-center text-muted">
      {{ lastOperation }}
    </div>

    <!-- Controls -->
    <div class="flex gap-3">
      <button class="btn-primary px-6" @click="step">{{ t('learn.multiState.step') }}</button>
      <button class="btn-outline" @click="reset">{{ t('learn.activities.reset') }}</button>
    </div>

    <!-- Insight -->
    <div class="p-3 bg-accent/10 dark:bg-accent/20 rounded-lg text-center text-sm">
      <span class="text-body">{{ t('learn.multiState.insight') }}</span>
    </div>
  </div>
</template>
