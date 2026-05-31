import type { ImageSourcePropType } from 'react-native';

/**
 * Describes one entry in the tab bar. `name` must match a route file in an
 * app's `src/app/` directory (e.g. `index` -> `src/app/index.tsx`); the
 * prebuild step in `scripts/sync-routes.js` warns if a tab and its route
 * drift out of sync.
 */
export type TabSpec = {
  /** Route name — matches a file in `src/app` (e.g. "index", "explore"). */
  name: string;
  /** Href used by the web tab bar. */
  href: string;
  /** Visible label. */
  label: string;
  /** Tab bar icon (used by the native tab bar). */
  icon: ImageSourcePropType;
};

/**
 * Tabs shared by every app. Each app's `src/tabs.ts` spreads this list and
 * may append its own app-specific entries.
 */
export const commonTabs: TabSpec[] = [
  {
    name: 'index',
    href: '/',
    label: 'Home',
    icon: require('@/assets/images/tabIcons/home.png'),
  },
  {
    name: 'explore',
    href: '/explore',
    label: 'Explore',
    icon: require('@/assets/images/tabIcons/explore.png'),
  },
];
