<template>
  <article class="panel flex flex-col items-center gap-2 text-center p-4">
    <span class="text-2xl" aria-hidden="true">{{ icon }}</span>
    <h3 class="text-sm font-semibold text-body m-0">{{ title }}</h3>
    <p class="text-xs text-muted m-0">{{ description }}</p>
  </article>
</template>

<script setup lang="ts">
/**
 * @fileoverview Highlight card component for home page feature highlights.
 */
defineProps<{
  icon: string;
  title: string;
  description: string;
}>();
</script>
