import { NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';
import { Platform, useColorScheme } from 'react-native';
import WebTabs from './app-tabs.web';

import { Colors } from '@/constants/theme';
import type { TabSpec } from '@/constants/tabs';

export default function AppTabs({ tabs }: { tabs: TabSpec[] }) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  if (Platform.OS === 'android' && Platform.isTV) {
    return <WebTabs tabs={tabs} />;
  }

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.text}
      tintColor={colors.tint}
      iconColor={colors.text}
      labelStyle={{
        selected: { color: colors.tint },
        default: { color: colors.text },
      }}
    >
      {tabs.map((tab) => (
        <NativeTabs.Trigger key={tab.name} name={tab.name}>
          <NativeTabs.Trigger.Label>{tab.label}</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon src={tab.icon} renderingMode="template" />
        </NativeTabs.Trigger>
      ))}
    </NativeTabs>
  );
}
