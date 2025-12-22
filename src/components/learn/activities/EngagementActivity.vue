<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineProps<{
  promptKey: string;
}>();

const { t } = useI18n();

const inputValue = ref<string>('');
</script>

<template>
  <div class="flex flex-col items-center gap-6">
    <p class="text-xl text-body text-center">{{ t(promptKey) }}</p>
    <input
      v-model="inputValue"
      type="number"
      class="form-control w-[150px] text-xl text-center"
      :placeholder="t('learn.activities.enterNumber')"
    />
    <p v-if="inputValue" class="text-base text-accent">
      {{ t('learn.activities.yourNumber', { number: inputValue }) }}
    </p>
  </div>
</template>
