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
  <div v-else class="learn-view">
    <header class="learn-header">
      <h1 class="learn-title">{{ t('learn.title') }}</h1>
      <p class="learn-subtitle">{{ t('learn.subtitle') }}</p>
    </header>

    <BadgeCollection />

    <WorldMap
      :worlds="worlds"
      :workshop-unlocked="workshopUnlocked"
      @select-lesson="handleSelectLesson"
    />

    <footer class="learn-footer">
      <button class="reset-button" @click="handleResetProgress">
        {{ t('learn.resetProgress') }}
      </button>
    </footer>
  </div>
</template>

<style scoped>
.learn-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.learn-header {
  text-align: center;
}

.learn-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--body-color);
  margin: 0 0 0.5rem 0;
}

.learn-subtitle {
  font-size: 1.125rem;
  color: var(--app-muted);
  margin: 0;
}

.learn-footer {
  display: flex;
  justify-content: center;
  padding-top: 2rem;
  border-top: 1px solid var(--app-border);
}

.reset-button {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: var(--app-muted);
  background: transparent;
  border: 1px solid var(--app-border);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-button:hover {
  color: var(--app-error);
  border-color: var(--app-error);
}
</style>
