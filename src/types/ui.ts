export const ACTIVE_VIEWS = ['home', 'learn', 'workshop', 'about'] as const;

export type ActiveView = (typeof ACTIVE_VIEWS)[number];
