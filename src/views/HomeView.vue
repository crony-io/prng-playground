<template>
  <div class="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
    <!-- Hero Section -->
    <section class="panel text-center">
      <div class="flex flex-col items-center gap-4 py-4">
        <span
          class="inline-flex items-center rounded-full border border-border bg-accent/10 px-3 py-1 text-xs font-medium text-body"
        >
          {{ t('home.hero.badge') }}
        </span>
        <h1 class="text-3xl font-bold text-body sm:text-4xl">
          {{ t('home.hero.title') }}
        </h1>
        <p class="text-lg text-muted max-w-2xl">
          {{ t('home.hero.subtitle') }}
        </p>
        <div class="flex flex-wrap justify-center gap-3 mt-2">
          <button class="btn-primary" @click="navigateTo('learn')">
            {{ t('home.hero.startLearning') }}
          </button>
          <button class="btn-outline" @click="navigateTo('workshop')">
            {{ t('home.hero.openWorkshop') }}
          </button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="flex flex-col gap-4">
      <h2 class="text-2xl font-semibold text-body text-center">
        {{ t('home.features.title') }}
      </h2>
      <div class="grid gap-4 md:grid-cols-3">
        <FeatureCard
          icon="📚"
          :title="t('home.features.learn.title')"
          :description="t('home.features.learn.description')"
          :highlights="[
            t('home.features.learn.highlights.worlds'),
            t('home.features.learn.highlights.badges'),
            t('home.features.learn.highlights.interactive'),
          ]"
          @click="navigateTo('learn')"
        />
        <FeatureCard
          icon="🔧"
          :title="t('home.features.workshop.title')"
          :description="t('home.features.workshop.description')"
          :highlights="[
            t('home.features.workshop.highlights.dsl'),
            t('home.features.workshop.highlights.preview'),
            t('home.features.workshop.highlights.tests'),
          ]"
          @click="navigateTo('workshop')"
        />
        <FeatureCard
          icon="⚙️"
          :title="t('home.features.algorithms.title')"
          :description="t('home.features.algorithms.description')"
          :highlights="[
            t('home.features.algorithms.highlights.production'),
            t('home.features.algorithms.highlights.educational'),
            t('home.features.algorithms.highlights.fork'),
          ]"
          @click="navigateTo('workshop')"
        />
      </div>
    </section>

    <!-- Highlights Section -->
    <section class="flex flex-col gap-4">
      <h2 class="text-2xl font-semibold text-body text-center">
        {{ t('home.highlights.title') }}
      </h2>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <HighlightCard
          icon="🛡️"
          :title="t('home.highlights.safe.title')"
          :description="t('home.highlights.safe.description')"
        />
        <HighlightCard
          icon="⚡"
          :title="t('home.highlights.responsive.title')"
          :description="t('home.highlights.responsive.description')"
        />
        <HighlightCard
          icon="🌐"
          :title="t('home.highlights.languages.title')"
          :description="t('home.highlights.languages.description')"
        />
        <HighlightCard
          icon="🎨"
          :title="t('home.highlights.themes.title')"
          :description="t('home.highlights.themes.description')"
        />
      </div>
    </section>

    <!-- CTA Section -->
    <section class="panel text-center">
      <div class="flex flex-col items-center gap-4 py-2">
        <h2 class="text-2xl font-semibold text-body">
          {{ t('home.cta.title') }}
        </h2>
        <p class="text-muted max-w-xl">
          {{ t('home.cta.description') }}
        </p>
        <button class="btn-primary" @click="navigateTo('learn')">
          {{ t('home.cta.beginJourney') }}
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
/**
 * @fileoverview Home page with hero, features, highlights, and CTA sections.
 */
import { useI18n } from 'vue-i18n';

import FeatureCard from '@/components/home/FeatureCard.vue';
import HighlightCard from '@/components/home/HighlightCard.vue';
import { useUiStore } from '@/stores/ui';
import type { ActiveView } from '@/types/ui';

const { t } = useI18n();
const uiStore = useUiStore();

function navigateTo(view: ActiveView): void {
  uiStore.setActiveView(view);
}
</script>
