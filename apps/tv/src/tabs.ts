import { commonTabs, type TabSpec } from 'with-monorepo-tv-source/src/constants/tabs';

/**
 * Tabs shown in the TV app. Start from the shared set and append any TV-only
 * tabs here — each `name` must match a route file in `src/app/` (a shared
 * re-export or a TV-specific route). `scripts/sync-routes.js` warns at
 * prebuild if a tab and its route drift out of sync.
 */
export const tabs: TabSpec[] = [...commonTabs];
