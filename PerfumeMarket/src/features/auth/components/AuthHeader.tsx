import { useInsensThemeStore } from '@/src/shared/state/theme.store';
import React from 'react';
import { Text, View } from 'react-native';

interface Props {
  title: string;
  subtitle?: string;
}

export default function AuthHeader({ title, subtitle }: Props) {
  const { theme } = useInsensThemeStore();
  const { colors, spacing } = theme;

  return (
    <View style={{ gap: spacing.sm, marginBottom: spacing.xl }}>
      <Text style={{
        fontSize: 24,
        fontWeight: '700',
        color: colors.textPrimary,
      }}>
        {title}
      </Text>
      {subtitle && (
        <Text style={{
          fontSize: 16,
          color: colors.textSecondary,
          width: 268,
        }}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}
