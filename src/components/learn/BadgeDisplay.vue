<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import type { BadgeType } from '@/components/learn/badges';

const props = withDefaults(
  defineProps<{
    badgeType: BadgeType;
    earned?: boolean;
    earnedAt?: number;
    size?: number;
    showDescription?: boolean;
    animate?: boolean;
  }>(),
  {
    earned: true,
    size: 80,
    showDescription: false,
    animate: false,
  },
);

const { t } = useI18n();

const badgeComponents = {
  numberKeeper: defineAsyncComponent(
    () => import('@/components/learn/badges/NumberKeeperBadge.vue'),
  ),
  recipeMixer: defineAsyncComponent(() => import('@/components/learn/badges/RecipeMixerBadge.vue')),
  binaryExplorer: defineAsyncComponent(
    () => import('@/components/learn/badges/BinaryExplorerBadge.vue'),
  ),
  bitMaster: defineAsyncComponent(() => import('@/components/learn/badges/BitMasterBadge.vue')),
  randomnessEngineer: defineAsyncComponent(
    () => import('@/components/learn/badges/RandomnessEngineerBadge.vue'),
  ),
  researcher: defineAsyncComponent(() => import('@/components/learn/badges/ResearcherBadge.vue')),
};

const badgeComponent = computed(() => badgeComponents[props.badgeType]);

const formattedDate = computed(() => {
  if (!props.earnedAt) {
    return '';
  }
  return new Date(props.earnedAt).toLocaleDateString();
});

const badgeName = computed(() => t(`learn.badges.${props.badgeType}.name`));
const badgeDescription = computed(() => t(`learn.badges.${props.badgeType}.description`));
</script>

<template>
  <div
    class="flex flex-col items-center gap-3 p-6 glass rounded-xl text-center"
    :class="{ 'animate-pulse': animate && earned }"
  >
    <div :class="{ 'animate-bounce': animate && earned }">
      <component :is="badgeComponent" :size="size" :earned="earned" />
    </div>
    <h3 class="text-lg font-bold text-primary m-0">
      {{ badgeName }}
    </h3>
    <p v-if="showDescription" class="text-sm text-body m-0 max-w-[250px]">
      {{ badgeDescription }}
    </p>
    <p v-if="earnedAt && earned" class="text-sm text-muted m-0">
      {{ t('learn.badges.earnedOn', { date: formattedDate }) }}
    </p>
  </div>
</template>
