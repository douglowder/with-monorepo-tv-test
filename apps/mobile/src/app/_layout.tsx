import RootLayout from 'with-monorepo-tv-source/src/components/root-layout';

import { tabs } from '../tabs';

// App-specific layout: renders the shared RootLayout with this app's tab list.
// Not managed by scripts/sync-routes.js (no @generated marker), so edits here
// are preserved. Customize the tab bar in ../tabs.ts.
export default function Layout() {
  return <RootLayout tabs={tabs} />;
}
