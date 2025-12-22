<template>
  <article
    class="panel flex flex-col gap-3 cursor-pointer transition-all hover:border-accent/50 hover:shadow-lg"
    role="button"
    tabindex="0"
    @click="$emit('click')"
    @keydown.enter="$emit('click')"
    @keydown.space.prevent="$emit('click')"
  >
    <div class="flex items-center gap-3">
      <span class="text-3xl" aria-hidden="true">{{ icon }}</span>
      <h3 class="text-lg font-semibold text-body m-0">{{ title }}</h3>
    </div>
    <p class="text-sm text-muted m-0">{{ description }}</p>
    <ul v-if="highlights.length > 0" class="flex flex-col gap-1 m-0 p-0 list-none">
      <li
        v-for="(highlight, index) in highlights"
        :key="index"
        class="flex items-center gap-2 text-sm text-muted"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-accent shrink-0" aria-hidden="true"></span>
        {{ highlight }}
      </li>
    </ul>
  </article>
</template>

<script setup lang="ts">
/**
 * @fileoverview Feature card component for home page feature highlights.
 */
withDefaults(
  defineProps<{
    icon: string;
    title: string;
    description: string;
    highlights?: string[];
  }>(),
  {
    highlights: () => [],
  },
);

defineEmits<{
  click: [];
}>();
</script>
