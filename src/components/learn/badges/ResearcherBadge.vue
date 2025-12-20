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
    :aria-label="t('learn.badges.researcher.alt')"
    role="img"
    class="transition-all duration-300"
    :class="{ 'opacity-40 grayscale': !earned }"
  >
    <!-- Badge background circle - special gold for final badge -->
    <circle
      cx="50"
      cy="50"
      r="45"
      fill="url(#researcherGradient)"
      stroke="#FFD700"
      stroke-width="4"
    />

    <!-- Inner circle -->
    <circle cx="50" cy="50" r="35" fill="#1a1a2e" opacity="0.3" />

    <!-- Microscope/magnifying glass -->
    <circle cx="42" cy="42" r="12" fill="none" stroke="#FFD700" stroke-width="2" />
    <line
      x1="51"
      y1="51"
      x2="65"
      y2="65"
      stroke="#FFD700"
      stroke-width="3"
      stroke-linecap="round"
    />

    <!-- Graph/chart lines inside magnifier -->
    <path d="M32 45 L38 40 L44 44 L50 38" fill="none" stroke="#FFD700" stroke-width="1.5" />

    <!-- Stars (excellence) -->
    <polygon points="75,22 77,28 83,28 78,32 80,38 75,34 70,38 72,32 67,28 73,28" fill="#FFD700" />
    <polygon
      points="25,25 26,28 29,28 27,30 28,33 25,31 22,33 23,30 21,28 24,28"
      fill="#FFD700"
      transform="scale(0.7) translate(10, 10)"
    />

    <!-- Document/paper -->
    <rect
      x="55"
      y="55"
      width="20"
      height="25"
      rx="2"
      fill="none"
      stroke="#FFD700"
      stroke-width="1.5"
    />
    <line x1="59" y1="62" x2="71" y2="62" stroke="#FFD700" stroke-width="1" />
    <line x1="59" y1="67" x2="71" y2="67" stroke="#FFD700" stroke-width="1" />
    <line x1="59" y1="72" x2="66" y2="72" stroke="#FFD700" stroke-width="1" />

    <!-- Trophy element -->
    <path d="M20 60 Q20 70 28 75 L22 75 Q15 70 15 60 Z" fill="#FFD700" opacity="0.6" />

    <!-- Gradient definition -->
    <defs>
      <linearGradient id="researcherGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#7c2d12" />
        <stop offset="50%" stop-color="#9a3412" />
        <stop offset="100%" stop-color="#c2410c" />
      </linearGradient>
    </defs>
  </svg>
</template>
