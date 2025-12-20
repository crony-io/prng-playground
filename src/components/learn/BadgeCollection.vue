<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLearningStore } from '@/stores/learning';
import BadgeDisplay from '@/components/learn/BadgeDisplay.vue';
import { BADGE_WORLD_MAP, type BadgeType } from '@/components/learn/badges';

const { t } = useI18n();
const learningStore = useLearningStore();

interface EarnedBadge {
  badgeType: BadgeType;
  worldId: string;
  earnedAt?: number;
}

const earnedBadges = computed((): EarnedBadge[] => {
  const badges: EarnedBadge[] = [];

  for (const world of learningStore.worldsWithProgress) {
    if (world.badgeEarned) {
      const badgeType = BADGE_WORLD_MAP[world.id];
      if (badgeType) {
        const worldProgress = learningStore.progress.worlds[world.id];
        badges.push({
          badgeType,
          worldId: world.id,
          earnedAt: worldProgress?.earnedAt,
        });
      }
    }
  }

  return badges;
});

const totalBadges = computed(() => Object.keys(BADGE_WORLD_MAP).length);
const earnedCount = computed(() => earnedBadges.value.length);
const hasAnyBadges = computed(() => earnedCount.value > 0);
</script>

<template>
  <div
    v-if="hasAnyBadges"
    class="glass-card border border-border/70 px-6 py-5 shadow-xl backdrop-blur-md transition hover:border-border/90"
  >
    <div class="mb-4 flex items-center justify-between gap-3">
      <h2 class="text-lg font-semibold text-body m-0">{{ t('learn.badges.collection') }}</h2>
      <span
        class="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-sm font-medium text-muted shadow-sm dark:border-border/70 dark:bg-surface/90"
      >
        <span
          class="h-2 w-2 rounded-full bg-accent shadow-[0_0_0_2px_rgba(255,178,62,0.25)]"
        ></span>
        {{ earnedCount }}/{{ totalBadges }}
      </span>
    </div>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      <BadgeDisplay
        v-for="badge in earnedBadges"
        :key="badge.badgeType"
        :badge-type="badge.badgeType"
        :earned="true"
        :earned-at="badge.earnedAt"
        :size="72"
        :show-description="false"
        class="h-full"
      />
    </div>
  </div>
</template>
