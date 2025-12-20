<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import AlgorithmTagChips from '@/components/ui/AlgorithmTagChips.vue';
import { useWorkshopStore } from '@/stores/workshop';
import { BUILTIN_TEMPLATES, createDslFromTemplate } from '@/utils/builtin-to-dsl';

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'forked'): void;
}>();

const { t } = useI18n();
const workshopStore = useWorkshopStore();

const selectedTemplateId = ref<string | null>(null);
const forkName = ref('');

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      selectedTemplateId.value = null;
      forkName.value = '';
    }
  },
);

function getTemplateName(nameKey: string): string {
  return t(nameKey);
}

function getTemplateDescription(descriptionKey?: string): string {
  if (!descriptionKey) {
    return '';
  }
  return t(descriptionKey);
}

function handleSelectTemplate(templateId: string, nameKey: string): void {
  selectedTemplateId.value = templateId;
  if (!forkName.value.trim()) {
    forkName.value = t('workshop.templates.defaultForkName', { name: t(nameKey) });
  }
}

function handleForkTemplate(): void {
  if (!selectedTemplateId.value || !forkName.value.trim()) {
    return;
  }

  const template = BUILTIN_TEMPLATES.find((tpl) => tpl.id === selectedTemplateId.value);
  if (!template) {
    return;
  }

  const newAlgorithm = createDslFromTemplate(template, forkName.value.trim());
  workshopStore.algorithms = [...workshopStore.algorithms, newAlgorithm];
  workshopStore.setActiveAlgorithm(newAlgorithm.id);

  emit('forked');
  handleClose();
}

function handleClose(): void {
  selectedTemplateId.value = null;
  forkName.value = '';
  emit('close');
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    @click.self="handleClose"
  >
    <div class="glass-card p-6 w-full max-w-md mx-4 space-y-4">
      <h3 class="text-lg font-semibold text-body">{{ $t('workshop.forkBuiltin') }}</h3>

      <div>
        <label class="block text-sm font-medium text-body mb-2">
          {{ $t('workshop.templates.selectTemplate') }}
        </label>
        <div class="space-y-2 max-h-64 overflow-y-auto">
          <button
            v-for="template in BUILTIN_TEMPLATES"
            :key="template.id"
            type="button"
            class="w-full glass-card p-3 text-left transition hover:ring-2 hover:ring-accent"
            :class="{ 'ring-2 ring-accent': selectedTemplateId === template.id }"
            @click="handleSelectTemplate(template.id, template.nameKey)"
          >
            <div class="flex items-center justify-between gap-2">
              <span class="font-medium text-body text-sm">
                {{ getTemplateName(template.nameKey) }}
              </span>
              <span class="text-xs text-muted">{{ template.stateSizeBits }}b</span>
            </div>
            <AlgorithmTagChips :tags="template.tags" size="xs" class="mt-1" />
            <div class="text-xs text-muted mt-1">
              {{ getTemplateDescription(template.descriptionKey) }}
            </div>
          </button>
        </div>
      </div>

      <div v-if="selectedTemplateId">
        <label class="block text-sm font-medium text-body mb-1">
          {{ $t('workshop.templates.forkAs') }}
        </label>
        <input
          v-model="forkName"
          type="text"
          class="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-body focus:outline-none focus:ring-2 focus:ring-accent"
          :placeholder="$t('workshop.namePlaceholder')"
          @keyup.enter="handleForkTemplate"
        />
      </div>

      <div class="flex justify-end gap-2">
        <button type="button" class="btn-ghost" @click="handleClose">
          {{ $t('common.cancel') }}
        </button>
        <button
          type="button"
          class="btn-primary"
          :disabled="!selectedTemplateId || !forkName.trim()"
          @click="handleForkTemplate"
        >
          {{ $t('workshop.forkBuiltin') }}
        </button>
      </div>
    </div>
  </div>
</template>
