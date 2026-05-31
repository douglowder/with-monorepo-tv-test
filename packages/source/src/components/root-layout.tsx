import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import React from 'react';
import { Platform, useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import type { TabSpec } from '@/constants/tabs';

/**
 * Shared root layout. Each app's `src/app/_layout.tsx` renders this with its
 * own tab list (see `src/tabs.ts`), which is how an app adds or removes tabs
 * without forking the layout itself.
 */
export default function RootLayout({ tabs }: { tabs: TabSpec[] }) {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {Platform.OS === 'ios' || !Platform.isTV ? (
        <AnimatedSplashOverlay />
      ) : null}
      <AppTabs tabs={tabs} />
    </ThemeProvider>
  );
}
