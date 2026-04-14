import { useInsensThemeStore } from '@/src/shared/state/theme.store';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ResetSuccessScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useInsensThemeStore();
  const { colors, spacing, radius } = theme;

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.onboardingBg} />
      <View style={{
        flex: 1,
        backgroundColor: colors.onboardingBg,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}>

        {/* ── Content — centered column ── */}
        <View style={{
          flex: 1,
          paddingHorizontal: spacing.lg,
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: 132 - insets.top,   // matches Figma top: 132px
        }}>

          {/* ── Illustration ── */}
          <Image
            source={require('../assets/reset-success.svg')}
            style={{ width: 270, height: 322 }}
            contentFit="contain"
          />

          {/* ── Success Text ── */}
          <Text style={{
            fontSize: 20,
            fontWeight: '700',
            color: colors.textPrimary,
            textAlign: 'center',
            marginTop: spacing.lg,
            width: 327,
          }}>
            You have successfully changed your password
          </Text>

        </View>

        {/* ── Sign In Button — pinned to bottom ── */}
        <View style={{
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.lg,
          gap: spacing.sm,
        }}>
          <TouchableOpacity
            onPress={() => router.replace('/auth/login')}
            activeOpacity={0.85}
            style={{
              height: 56,
              backgroundColor: colors.buttonBg,
              borderRadius: radius.md,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{
              fontSize: 14,
              fontWeight: '500',
              color: colors.buttonText,
            }}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </>
  );
}
