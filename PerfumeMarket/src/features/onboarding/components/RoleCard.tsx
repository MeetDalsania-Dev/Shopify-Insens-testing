import { useInsensThemeStore } from '@/src/shared/state/theme.store';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { UserRole } from '../types/onboarding.types';

interface Props {
  id: UserRole;
  label: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onSelect: (role: UserRole) => void;
}

export default function RoleCard({
  id,
  label,
  description,
  icon,
  isSelected,
  onSelect,
}: Props) {
  const { theme } = useInsensThemeStore();
  const { colors } = theme;

  return (
    <TouchableOpacity
      onPress={() => onSelect(id)}
      activeOpacity={0.85}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        backgroundColor: colors.white,
        borderWidth: isSelected ? 1.5 : 0,
        borderColor: isSelected ? colors.buttonBg : 'transparent',
      }}
    >
      {/* ── Label + Description ── */}
      <View style={{ gap: 4 }}>
        <Text style={{
          fontSize: 16,
          fontWeight: '600',
          color: colors.textPrimary,
        }}>
          {label}
        </Text>
        <Text style={{
          fontSize: 12,
          color: colors.textSecondary,
        }}>
          {description}
        </Text>
      </View>

      {/* ── Icon Pill ── */}
      <View style={{
        width: 46,
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
        borderRadius: 100,
        backgroundColor: isSelected ? colors.buttonBg : colors.onboardingBg,
      }}>
        {icon}
      </View>
    </TouchableOpacity>
  );
}
