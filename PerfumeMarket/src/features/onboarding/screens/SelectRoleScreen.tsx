import { useInsensThemeStore } from '@/src/shared/state/theme.store';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackArrowIcon } from '@/src/features/auth/assets/icons';
import { SellerIcon, VisitorIcon } from '../assets/icons';
import RoleCard from '../components/RoleCard';
import { useSelectRole } from '../hooks/useSelectRole';
import { RoleOption, UserRole } from '../types/onboarding.types';

const ROLES: RoleOption[] = [
  {
    id: 'visitor',
    label: 'Visitor',
    description: 'Browse, explore, buy perfumes',
  },
  {
    id: 'seller',
    label: 'Seller',
    description: 'Sell their products on INSENS',
  },
];

const ROLE_ICONS: Record<UserRole, (isSelected: boolean) => React.ReactNode> = {
  visitor: (isSelected) => (
    <VisitorIcon color={isSelected ? '#FFFFFF' : '#6D7F8F'} />
  ),
  seller: (isSelected) => (
    <SellerIcon color={isSelected ? '#FFFFFF' : '#6D7F8F'} />
  ),
};

export default function SelectRoleScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useInsensThemeStore();
  const { colors, spacing, radius } = theme;
  const { selectedRole, isLoading, selectRole, continueWithRole } = useSelectRole();

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.onboardingBg} />
      <View style={{
        flex: 1,
        backgroundColor: colors.onboardingBg,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}>

        {/* ── Back Button ── */}
        <View style={{
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
        }}>
          <TouchableOpacity
            onPress={() => router.navigate("/auth/login")}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <BackArrowIcon strokeWidth={1.5} color="#1C1C1E" />
          </TouchableOpacity>
        </View>

        {/* ── Content ── */}
        <View style={{
          flex: 1,
          paddingHorizontal: spacing.lg,
          gap: spacing.lg,
        }}>

          {/* Title */}
          <Text style={{
            fontSize: 24,
            fontWeight: '700',
            color: colors.textPrimary,
          }}>
            Select Your Role!
          </Text>

          {/* ── Role Cards ── */}
          <View style={{ gap: 12 }}>
            {ROLES.map((role) => (
              <RoleCard
                key={role.id}
                id={role.id}
                label={role.label}
                description={role.description}
                icon={ROLE_ICONS[role.id](selectedRole === role.id)}
                isSelected={selectedRole === role.id}
                onSelect={selectRole}
              />
            ))}
          </View>

        </View>

        {/* ── Continue Button — pinned bottom ── */}
        <View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.lg }}>
          <TouchableOpacity
            onPress={continueWithRole}
            disabled={!selectedRole || isLoading}
            activeOpacity={0.85}
            style={{
              height: 56,
              backgroundColor: colors.buttonBg,
              borderRadius: radius.md,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: !selectedRole || isLoading ? 0.5 : 1,
            }}
          >
            {isLoading
              ? <ActivityIndicator color={colors.buttonText} />
              : <Text style={{ fontSize: 14, fontWeight: '500', color: colors.buttonText }}>
                  Continue
                </Text>
            }
          </TouchableOpacity>
        </View>

      </View>
    </>
  );
}
