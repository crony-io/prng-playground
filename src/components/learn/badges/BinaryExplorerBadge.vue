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
    :aria-label="t('learn.badges.binaryExplorer.alt')"
    role="img"
    class="transition-all duration-300"
    :class="{ 'opacity-40 grayscale': !earned }"
  >
    <!-- Badge background circle -->
    <circle
      cx="50"
      cy="50"
      r="45"
      fill="url(#binaryExplorerGradient)"
      stroke="#10B981"
      stroke-width="3"
    />

    <!-- Inner circle -->
    <circle cx="50" cy="50" r="35" fill="#1a1a2e" opacity="0.3" />

    <!-- Binary digits in a row -->
    <text x="22" y="48" fill="#10B981" font-size="14" font-family="monospace" font-weight="bold">
      0
    </text>
    <text x="34" y="48" fill="#10B981" font-size="14" font-family="monospace" font-weight="bold">
      1
    </text>
    <text x="46" y="48" fill="#10B981" font-size="14" font-family="monospace" font-weight="bold">
      0
    </text>
    <text x="58" y="48" fill="#10B981" font-size="14" font-family="monospace" font-weight="bold">
      1
    </text>
    <text x="70" y="48" fill="#10B981" font-size="14" font-family="monospace" font-weight="bold">
      0
    </text>

    <!-- Light switches (toggle representations) -->
    <rect
      x="24"
      y="55"
      width="8"
      height="12"
      rx="2"
      fill="#064e3b"
      stroke="#10B981"
      stroke-width="1"
    />
    <rect
      x="36"
      y="55"
      width="8"
      height="12"
      rx="2"
      fill="#10B981"
      stroke="#10B981"
      stroke-width="1"
    />
    <rect
      x="48"
      y="55"
      width="8"
      height="12"
      rx="2"
      fill="#064e3b"
      stroke="#10B981"
      stroke-width="1"
    />
    <rect
      x="60"
      y="55"
      width="8"
      height="12"
      rx="2"
      fill="#10B981"
      stroke="#10B981"
      stroke-width="1"
    />
    <rect
      x="72"
      y="55"
      width="8"
      height="12"
      rx="2"
      fill="#064e3b"
      stroke="#10B981"
      stroke-width="1"
    />

    <!-- Compass/explorer element -->
    <circle cx="50" cy="30" r="8" fill="none" stroke="#FFD700" stroke-width="1.5" />
    <line x1="50" y1="24" x2="50" y2="36" stroke="#FFD700" stroke-width="1.5" />
    <line x1="44" y1="30" x2="56" y2="30" stroke="#FFD700" stroke-width="1.5" />

    <!-- Gradient definition -->
    <defs>
      <linearGradient id="binaryExplorerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#047857" />
        <stop offset="100%" stop-color="#10B981" />
      </linearGradient>
    </defs>
  </svg>
</template>
