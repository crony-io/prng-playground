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
    :aria-label="t('learn.badges.recipeMixer.alt')"
    role="img"
    class="transition-all duration-300"
    :class="{ 'opacity-40 grayscale': !earned }"
  >
    <!-- Badge background circle -->
    <circle
      cx="50"
      cy="50"
      r="45"
      fill="url(#recipeMixerGradient)"
      stroke="#FF6B35"
      stroke-width="3"
    />

    <!-- Inner circle -->
    <circle cx="50" cy="50" r="35" fill="#1a1a2e" opacity="0.3" />

    <!-- Mixing bowl -->
    <ellipse cx="50" cy="60" rx="20" ry="12" fill="none" stroke="#FF6B35" stroke-width="2" />
    <path d="M30 55 Q50 45 70 55" fill="none" stroke="#FF6B35" stroke-width="2" />

    <!-- Whisk/spoon -->
    <line
      x1="60"
      y1="35"
      x2="70"
      y2="25"
      stroke="#FFD700"
      stroke-width="3"
      stroke-linecap="round"
    />
    <circle cx="58" cy="38" r="5" fill="none" stroke="#FFD700" stroke-width="2" />

    <!-- Math symbols floating -->
    <text x="35" y="38" fill="#FFD700" font-size="12" font-weight="bold">×</text>
    <text x="55" y="32" fill="#FFD700" font-size="12" font-weight="bold">+</text>
    <text x="40" y="28" fill="#FFD700" font-size="10" font-weight="bold">%</text>

    <!-- Gradient definition -->
    <defs>
      <linearGradient id="recipeMixerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#dc2626" />
        <stop offset="100%" stop-color="#f97316" />
      </linearGradient>
    </defs>
  </svg>
</template>
