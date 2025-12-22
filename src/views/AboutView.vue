<template>
  <div class="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
    <!-- Header -->
    <header class="text-center">
      <h1 class="text-3xl font-bold text-body sm:text-4xl">{{ t('about.title') }}</h1>
    </header>

    <!-- Introduction -->
    <section class="panel">
      <h2 class="panel-title">{{ t('about.intro.title') }}</h2>
      <p class="text-muted mb-3">{{ t('about.intro.description') }}</p>
      <p class="text-sm text-muted/80 italic border-l-2 border-accent pl-3">
        {{ t('about.intro.disclaimer') }}
      </p>
    </section>

    <!-- Features -->
    <section class="panel">
      <h2 class="panel-title">{{ t('about.features.title') }}</h2>
      <div class="grid gap-4 sm:grid-cols-2">
        <AboutFeatureItem
          icon="📚"
          :title="t('about.features.learnMode.title')"
          :description="t('about.features.learnMode.description')"
        />
        <AboutFeatureItem
          icon="🔧"
          :title="t('about.features.workshop.title')"
          :description="t('about.features.workshop.description')"
        />
        <AboutFeatureItem
          icon="⚙️"
          :title="t('about.features.algorithms.title')"
          :description="t('about.features.algorithms.description')"
        />
        <AboutFeatureItem
          icon="📊"
          :title="t('about.features.visualization.title')"
          :description="t('about.features.visualization.description')"
        />
        <AboutFeatureItem
          icon="✅"
          :title="t('about.features.qualityTests.title')"
          :description="t('about.features.qualityTests.description')"
        />
        <AboutFeatureItem
          icon="🌐"
          :title="t('about.features.i18n.title')"
          :description="t('about.features.i18n.description')"
        />
      </div>
    </section>

    <!-- Technical Details -->
    <section class="panel">
      <h2 class="panel-title">{{ t('about.technical.title') }}</h2>
      <div class="grid gap-6 md:grid-cols-2">
        <!-- Tech Stack -->
        <div>
          <h3 class="text-sm font-semibold text-body mb-2">
            {{ t('about.technical.stack.title') }}
          </h3>
          <ul class="flex flex-col gap-1.5 m-0 p-0 list-none">
            <li
              v-for="item in stackItems"
              :key="item"
              class="flex items-center gap-2 text-sm text-muted"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-accent shrink-0" aria-hidden="true"></span>
              {{ t(`about.technical.stack.items.${item}`) }}
            </li>
          </ul>
        </div>

        <!-- Architecture -->
        <div>
          <h3 class="text-sm font-semibold text-body mb-2">
            {{ t('about.technical.architecture.title') }}
          </h3>
          <ul class="flex flex-col gap-1.5 m-0 p-0 list-none">
            <li
              v-for="item in architectureItems"
              :key="item"
              class="flex items-center gap-2 text-sm text-muted"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-primary shrink-0" aria-hidden="true"></span>
              {{ t(`about.technical.architecture.items.${item}`) }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Credits & License -->
    <section class="panel">
      <h2 class="panel-title">{{ t('about.credits.title') }}</h2>
      <div class="flex flex-col gap-2 text-sm text-muted">
        <p class="m-0">{{ t('about.credits.aiAssisted') }}</p>
        <p class="m-0">{{ t('about.credits.license') }}</p>
        <a
          href="https://github.com/crony-io/prng-playground"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 text-accent hover:underline w-fit"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 2.247a10 10 0 0 0-3.162 19.487c.5.088.687-.212.687-.475 0-.237-.012-1.025-.012-1.862-2.513.462-3.163-.613-3.363-1.175a3.64 3.64 0 0 0-1.025-1.413c-.35-.187-.85-.65-.013-.662a2 2 0 0 1 1.538 1.025 2.137 2.137 0 0 0 2.912.825 2.1 2.1 0 0 1 .638-1.338c-2.225-.25-4.55-1.112-4.55-4.937a3.9 3.9 0 0 1 1.025-2.688 3.6 3.6 0 0 1 .1-2.65s.837-.262 2.75 1.025a9.43 9.43 0 0 1 5 0c1.912-1.3 2.75-1.025 2.75-1.025a3.6 3.6 0 0 1 .1 2.65 3.87 3.87 0 0 1 1.025 2.688c0 3.837-2.338 4.687-4.562 4.937a2.37 2.37 0 0 1 .674 1.85c0 1.338-.012 2.413-.012 2.75 0 .263.187.575.687.475A10.005 10.005 0 0 0 12 2.247"
            />
          </svg>
          {{ t('about.credits.openSource') }}
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
/**
 * @fileoverview About page with project info, features, tech stack, and credits.
 */
import { useI18n } from 'vue-i18n';

import AboutFeatureItem from '@/components/about/AboutFeatureItem.vue';

const { t } = useI18n();

const stackItems = ['vue', 'pinia', 'tailwind', 'vite', 'typescript', 'zod', 'workers'] as const;
const architectureItems = ['clientOnly', 'noRouter', 'dsl', 'persistence'] as const;
</script>
