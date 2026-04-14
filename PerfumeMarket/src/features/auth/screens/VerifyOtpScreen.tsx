import { useInsensThemeStore } from '@/src/shared/state/theme.store';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackArrowIcon } from '../assets/icons';
import OtpInput from '../components/OtpInput';
import VerifyOtpIllustration from '../components/VerifyOtpIllustration';
import { useVerifyOtp } from '../hooks/useVerifyOtp';

export default function VerifyOtpScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useInsensThemeStore();
  const { colors, spacing, radius } = theme;

  const {
    code,
    setCode,
    isLoading,
    apiError,
    resendTimer,
    isResending,
    maskedEmail,
    submit,
    handleResend,
  } = useVerifyOtp();

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.onboardingBg} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={{ flex: 1, backgroundColor: colors.onboardingBg }}
          contentContainerStyle={{ flex: 1, paddingBottom: insets.bottom + spacing.lg }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Back Button ── */}
          <View style={{
            paddingTop: insets.top,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
          }}>
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <BackArrowIcon strokeWidth={2} color="#212427" />
            </TouchableOpacity>
          </View>

          {/* ── Illustration ── */}
          <VerifyOtpIllustration />

          {/* ── Title + Subtitle ── */}
          <View style={{
            paddingHorizontal: spacing.lg,
            gap: spacing.sm,
            marginTop: spacing.xl,
            marginBottom: spacing.lg,
          }}>
            <Text style={{
              fontSize: 24,
              fontWeight: '700',
              color: colors.textPrimary,
              textAlign: 'center',
            }}>
              Verification Code
            </Text>
            <Text style={{
              fontSize: 16,
              textAlign: 'center',
              lineHeight: 24,
            }}>
              <Text style={{ color: colors.textSecondary }}>
                We have sent the verification to your email{' '}
              </Text>
              <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>
                {maskedEmail}
              </Text>
            </Text>
          </View>

          {/* ── OTP Boxes + Resend ── */}
          <View style={{
            paddingHorizontal: spacing.lg,
            gap: spacing.md,
          }}>
            <OtpInput code={code} onChange={setCode} />

            {/* Resend */}
            <TouchableOpacity
              onPress={handleResend}
              disabled={resendTimer > 0 || isResending}
              style={{ alignSelf: 'center' }}
            >
              <Text style={{
                fontSize: 14,
                fontWeight: '700',
                color: resendTimer > 0 ? colors.textSecondary : colors.textPrimary,
                textAlign: 'center',
              }}>
                {resendTimer > 0
                  ? `Resend code in ${resendTimer}s`
                  : isResending ? 'Sending...' : 'Resend code'
                }
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── API Error ── */}
          {apiError && (
            <Text style={{
              color: colors.error,
              fontSize: 13,
              textAlign: 'center',
              marginTop: spacing.sm,
              paddingHorizontal: spacing.lg,
            }}>
              {apiError}
            </Text>
          )}

          {/* ── Spacer ── */}
          <View style={{ flex: 1 }} />

          {/* ── Verify Button ── */}
          <View style={{ paddingHorizontal: spacing.lg }}>
            <TouchableOpacity
              onPress={submit}
              disabled={isLoading}
              activeOpacity={0.85}
              style={{
                height: 56,
                backgroundColor: colors.buttonBg,
                borderRadius: radius.md,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading
                ? <ActivityIndicator color={colors.buttonText} />
                : <Text style={{ fontSize: 14, fontWeight: '500', color: colors.buttonText }}>
                    Verify
                  </Text>
              }
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
