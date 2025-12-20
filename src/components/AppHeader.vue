<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import LanguageSelector from '@/components/LanguageSelector.vue';
import ThemeSelector from '@/components/ThemeSelector.vue';
import AppLogo from '@/components/ui/AppLogo.vue';
import OptionButtonGroup from '@/components/ui/OptionButtonGroup.vue';
import { useUiStore } from '@/stores/ui';
import { ACTIVE_VIEWS, type ActiveView } from '@/types/ui';

const uiStore = useUiStore();
const { activeView } = storeToRefs(uiStore);

const { t } = useI18n();

const viewOptions = computed(
  () =>
    [
      { value: 'home', label: t('navigation.home') },
      { value: 'learn', label: t('navigation.learn') },
      { value: 'workshop', label: t('navigation.workshop') },
      { value: 'about', label: t('navigation.about') },
    ] as const,
);

function handleActiveViewChange(value: string | number): void {
  if (typeof value !== 'string') {
    return;
  }

  const candidate = value as ActiveView;
  if (!ACTIVE_VIEWS.includes(candidate)) {
    return;
  }

  uiStore.setActiveView(candidate);
}
</script>
<template>
  <header class="border-b border-border">
    <div class="mx-auto p-4">
      <div class="flex items-center justify-between gap-4">
        <!-- Logo/Title -->
        <div class="flex items-center space-x-3 shrink-0">
          <AppLogo class="h-8 w-8 text-accent" aria-hidden="true" />
          <h1 class="text-xl font-semibold text-body">
            {{ $t('app.title') }}
          </h1>
        </div>

        <OptionButtonGroup
          :options="viewOptions"
          :model-value="activeView"
          container-class="flex flex-wrap justify-center gap-2"
          button-class="btn-ghost px-3 py-2 text-sm"
          active-button-class="ring-2 ring-accent"
          @update:modelValue="handleActiveViewChange"
        />

        <!-- Controls -->
        <div class="flex items-center space-x-4 shrink-0">
          <LanguageSelector />

          <!-- Theme Toggle -->
          <ThemeSelector />
        </div>
      </div>
    </div>
  </header>
</template>
