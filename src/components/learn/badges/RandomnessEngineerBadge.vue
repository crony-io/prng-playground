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
    :aria-label="t('learn.badges.randomnessEngineer.alt')"
    role="img"
    class="transition-all duration-300"
    :class="{ 'opacity-40 grayscale': !earned }"
  >
    <!-- Badge background circle -->
    <circle
      cx="50"
      cy="50"
      r="45"
      fill="url(#randomnessEngineerGradient)"
      stroke="#F59E0B"
      stroke-width="3"
    />

    <!-- Inner circle -->
    <circle cx="50" cy="50" r="35" fill="#1a1a2e" opacity="0.3" />

    <!-- Gear/cog (engineer symbol) -->
    <circle cx="50" cy="50" r="15" fill="none" stroke="#F59E0B" stroke-width="3" />
    <circle cx="50" cy="50" r="6" fill="#F59E0B" />

    <!-- Gear teeth -->
    <rect x="47" y="30" width="6" height="8" fill="#F59E0B" />
    <rect x="47" y="62" width="6" height="8" fill="#F59E0B" />
    <rect x="30" y="47" width="8" height="6" fill="#F59E0B" />
    <rect x="62" y="47" width="8" height="6" fill="#F59E0B" />

    <!-- Diagonal teeth -->
    <rect x="32" y="32" width="6" height="6" fill="#F59E0B" transform="rotate(45 35 35)" />
    <rect x="62" y="32" width="6" height="6" fill="#F59E0B" transform="rotate(45 65 35)" />
    <rect x="32" y="62" width="6" height="6" fill="#F59E0B" transform="rotate(45 35 65)" />
    <rect x="62" y="62" width="6" height="6" fill="#F59E0B" transform="rotate(45 65 65)" />

    <!-- Random scatter dots -->
    <circle cx="25" cy="25" r="2" fill="#FFD700" />
    <circle cx="75" cy="28" r="2" fill="#FFD700" />
    <circle cx="78" cy="72" r="2" fill="#FFD700" />
    <circle cx="22" cy="70" r="2" fill="#FFD700" />

    <!-- Wrench accent -->
    <path d="M70 20 L78 28 L75 31 L67 23 Z" fill="#FFD700" />

    <!-- Gradient definition -->
    <defs>
      <linearGradient id="randomnessEngineerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#b45309" />
        <stop offset="100%" stop-color="#F59E0B" />
      </linearGradient>
    </defs>
  </svg>
</template>
