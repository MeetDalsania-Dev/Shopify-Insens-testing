import { useInsensThemeStore } from '@/src/shared/state/theme.store';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface Props {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
}

export default function AuthSocialButton({ icon, label, onPress }: Props) {
  const { theme } = useInsensThemeStore();
  const { colors, radius, spacing } = theme;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        height: 56,
        backgroundColor: colors.white,
        borderRadius: radius.md,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        gap: 56,
      }}
    >
      {icon}
      <Text style={{
        fontSize: 14,
        fontWeight: '500',
        color: colors.textPrimary,
      }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
