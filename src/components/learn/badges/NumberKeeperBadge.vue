<script setup lang="ts">
import { useI18n } from 'vue-i18n';

withDefaults(
  defineProps<{
    size?: number;
    earned?: boolean;
  }>(),
  {
    size: 80,
    earned: false,
  },
);

const { t } = useI18n();
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 100 100"
    :aria-label="t('learn.badges.numberKeeper.alt')"
    role="img"
    class="transition-all duration-300"
    :class="{ 'opacity-40 grayscale': !earned }"
  >
    <!-- Badge background circle -->
    <circle
      cx="50"
      cy="50"
      r="45"
      fill="url(#numberKeeperGradient)"
      stroke="#FFD700"
      stroke-width="3"
    />

    <!-- Inner circle -->
    <circle cx="50" cy="50" r="35" fill="#1a1a2e" opacity="0.3" />

    <!-- Number box icon -->
    <rect
      x="30"
      y="30"
      width="40"
      height="40"
      rx="5"
      fill="none"
      stroke="#FFD700"
      stroke-width="2"
    />

    <!-- Question marks / number inside -->
    <text x="50" y="58" text-anchor="middle" fill="#FFD700" font-size="24" font-weight="bold">
      42
    </text>

    <!-- Sparkles -->
    <circle cx="25" cy="25" r="3" fill="#FFD700" opacity="0.8" />
    <circle cx="75" cy="25" r="2" fill="#FFD700" opacity="0.6" />
    <circle cx="75" cy="75" r="3" fill="#FFD700" opacity="0.7" />

    <!-- Gradient definition -->
    <defs>
      <linearGradient id="numberKeeperGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4a1d96" />
        <stop offset="100%" stop-color="#7c3aed" />
      </linearGradient>
    </defs>
  </svg>
</template>
