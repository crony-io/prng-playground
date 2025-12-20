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
    :aria-label="t('learn.badges.bitMaster.alt')"
    role="img"
    class="transition-all duration-300"
    :class="{ 'opacity-40 grayscale': !earned }"
  >
    <!-- Badge background circle -->
    <circle
      cx="50"
      cy="50"
      r="45"
      fill="url(#bitMasterGradient)"
      stroke="#3B82F6"
      stroke-width="3"
    />

    <!-- Inner circle -->
    <circle cx="50" cy="50" r="35" fill="#1a1a2e" opacity="0.3" />

    <!-- XOR symbol stylized -->
    <circle cx="35" cy="45" r="10" fill="none" stroke="#3B82F6" stroke-width="2" />
    <circle cx="50" cy="45" r="10" fill="none" stroke="#3B82F6" stroke-width="2" />

    <!-- Bit arrows (shift visualization) -->
    <path d="M25 65 L45 65" stroke="#60A5FA" stroke-width="2" />
    <path d="M40 60 L45 65 L40 70" fill="none" stroke="#60A5FA" stroke-width="2" />
    <path d="M55 65 L75 65" stroke="#60A5FA" stroke-width="2" />
    <path d="M60 60 L55 65 L60 70" fill="none" stroke="#60A5FA" stroke-width="2" />

    <!-- Binary bits -->
    <text x="30" y="80" fill="#FFD700" font-size="10" font-family="monospace" font-weight="bold">
      1
    </text>
    <text x="42" y="80" fill="#FFD700" font-size="10" font-family="monospace" font-weight="bold">
      0
    </text>
    <text x="54" y="80" fill="#FFD700" font-size="10" font-family="monospace" font-weight="bold">
      1
    </text>
    <text x="66" y="80" fill="#FFD700" font-size="10" font-family="monospace" font-weight="bold">
      1
    </text>

    <!-- Crown/master symbol -->
    <path d="M40 25 L50 18 L60 25 L58 32 L42 32 Z" fill="#FFD700" />

    <!-- Gradient definition -->
    <defs>
      <linearGradient id="bitMasterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1d4ed8" />
        <stop offset="100%" stop-color="#3B82F6" />
      </linearGradient>
    </defs>
  </svg>
</template>
