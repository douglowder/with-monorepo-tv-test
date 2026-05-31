import { commonTabs, type TabSpec } from 'with-monorepo-tv-source/src/constants/tabs';

/**
 * Tabs shown in the TV app. Start from the shared set and append any TV-only
 * tabs here — each `name` must match a route file in `src/app/` (a shared
 * re-export or a TV-specific route). `scripts/sync-routes.js` warns at
 * prebuild if a tab and its route drift out of sync.
 *
 * `tv_focus` is TV-only: its route lives at src/app/tv_focus.tsx in this app
 * (re-exporting the shared screen), and it is intentionally absent from the
 * mobile app's tabs and routes.
 */
export const tabs: TabSpec[] = [
  ...commonTabs,
  {
    name: 'tv_focus',
    href: '/tv_focus',
    label: 'Events',
    icon: require('@/assets/images/tabIcons/tv.png'),
  },
];
