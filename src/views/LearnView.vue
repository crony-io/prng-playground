<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLearningStore } from '@/stores/learning';
import WorldMap from '@/components/learn/WorldMap.vue';
import LessonView from '@/views/LessonView.vue';
import BadgeCollection from '@/components/learn/BadgeCollection.vue';

const { t } = useI18n();
const learningStore = useLearningStore();

const worlds = computed(() => learningStore.worldsWithProgress);
const workshopUnlocked = computed(() => learningStore.workshopUnlocked);
const currentLesson = computed(() => learningStore.currentLesson);

// Save scroll position when entering a lesson
const savedScrollPosition = ref(0);

function handleSelectLesson(lessonId: string) {
  // Save current scroll position before entering lesson
  savedScrollPosition.value = window.scrollY;
  learningStore.startLesson(lessonId);
}

function handleResetProgress() {
  if (confirm(t('learn.confirmReset'))) {
    learningStore.resetProgress();
  }
}

// Restore scroll position when returning from a lesson
watch(currentLesson, (newLesson, oldLesson) => {
  if (!newLesson && oldLesson) {
    // Returning from a lesson - restore scroll position
    nextTick(() => {
      window.scrollTo({ top: savedScrollPosition.value, behavior: 'smooth' });
    });
  }
});
</script>

<template>
  <LessonView v-if="currentLesson" />
  <div v-else class="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
    <header class="text-center">
      <h1 class="text-3xl font-bold text-body sm:text-4xl">
        {{ t('learn.title') }}
      </h1>
      <p class="mt-2 text-lg text-muted">
        {{ t('learn.subtitle') }}
      </p>
    </header>

    <BadgeCollection />

    <WorldMap
      :worlds="worlds"
      :workshop-unlocked="workshopUnlocked"
      @select-lesson="handleSelectLesson"
    />

    <footer class="flex justify-center border-t border-border pt-8">
      <button
        class="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted transition hover:border-error hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        @click="handleResetProgress"
      >
        {{ t('learn.resetProgress') }}
      </button>
    </footer>
  </div>
</template>
