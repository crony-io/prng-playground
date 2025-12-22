<template>
  <div class="flex gap-3">
    <span class="text-xl shrink-0" aria-hidden="true">{{ icon }}</span>
    <div class="flex flex-col gap-1">
      <h3 class="text-sm font-semibold text-body m-0">{{ title }}</h3>
      <p class="text-sm text-muted m-0">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @fileoverview Feature item component for about page features grid.
 */
defineProps<{
  icon: string;
  title: string;
  description: string;
}>();
</script>
