import { useInsensThemeStore } from '@/src/shared/state/theme.store';
import React from 'react';
import { Text, View } from 'react-native';

export default function AuthDivider() {
  const { theme } = useInsensThemeStore();
  const { colors, spacing } = theme;

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      marginBottom: spacing.lg,
    }}>
      <View style={{ flex: 1, height: 1, backgroundColor: colors.dotInactive }} />
      <Text style={{ fontSize: 14, color: colors.textSecondary }}>Or</Text>
      <View style={{ flex: 1, height: 1, backgroundColor: colors.dotInactive }} />
    </View>
  );
}
