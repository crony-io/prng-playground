<template>
  <AppLayout>
    <AboutView v-if="activeView === 'about'" />
    <LearnView v-else-if="activeView === 'learn'" />
    <WorkshopView v-else-if="activeView === 'workshop'" />
    <HomeView v-else />
  </AppLayout>
</template>

<script setup lang="ts">
/**
 * @fileoverview Root application component.
 */
import { storeToRefs } from 'pinia';
import AppLayout from '@/components/AppLayout.vue';
import { useUiStore } from '@/stores/ui';
import AboutView from '@/views/AboutView.vue';
import LearnView from '@/views/LearnView.vue';
import WorkshopView from '@/views/WorkshopView.vue';
import HomeView from '@/views/HomeView.vue';

const uiStore = useUiStore();
const { activeView } = storeToRefs(uiStore);
</script>
