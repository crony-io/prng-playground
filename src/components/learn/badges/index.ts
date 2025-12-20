export { default as NumberKeeperBadge } from '@/components/learn/badges/NumberKeeperBadge.vue';
export { default as RecipeMixerBadge } from '@/components/learn/badges/RecipeMixerBadge.vue';
export { default as BinaryExplorerBadge } from '@/components/learn/badges/BinaryExplorerBadge.vue';
export { default as BitMasterBadge } from '@/components/learn/badges/BitMasterBadge.vue';
export { default as RandomnessEngineerBadge } from '@/components/learn/badges/RandomnessEngineerBadge.vue';
export { default as ResearcherBadge } from '@/components/learn/badges/ResearcherBadge.vue';

export type BadgeType =
  | 'numberKeeper'
  | 'recipeMixer'
  | 'binaryExplorer'
  | 'bitMaster'
  | 'randomnessEngineer'
  | 'researcher';

export const BADGE_WORLD_MAP: Record<string, BadgeType> = {
  'world-1': 'numberKeeper',
  'world-2': 'recipeMixer',
  'world-2-5': 'binaryExplorer',
  'world-3': 'bitMaster',
  'world-4': 'randomnessEngineer',
  'world-5': 'researcher',
};
