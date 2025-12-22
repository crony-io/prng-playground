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
