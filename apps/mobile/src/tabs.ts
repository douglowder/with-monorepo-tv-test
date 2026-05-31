import { commonTabs, type TabSpec } from 'with-monorepo-tv-source/src/constants/tabs';

/**
 * Tabs shown in the mobile app. Start from the shared set and append any
 * mobile-only tabs here — each `name` must match a route file in `src/app/`
 * (a shared re-export or a mobile-specific route). `scripts/sync-routes.js`
 * warns at prebuild if a tab and its route drift out of sync.
 */
export const tabs: TabSpec[] = [...commonTabs];
