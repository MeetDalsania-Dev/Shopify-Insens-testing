import { useInsensThemeStore } from '@/src/shared/state/theme.store';
import { useRouter } from 'expo-router';
import React from 'react';
import { Controller } from 'react-hook-form';
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

import { BackArrowIcon, LockIcon } from '../assets/icons';
import AuthInputField from '../components/AuthInputField';
import ResetPasswordIllustration from '../components/ResetPasswordIllustration';
import { useResetPassword } from '../hooks/useResetPassword';

export default function ResetPasswordScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useInsensThemeStore();
  const { colors, spacing, radius } = theme;

  const {
    form,
    isLoading,
    apiError,
    showPassword,
    showConfirmPassword,
    togglePassword,
    toggleConfirmPassword,
    submit,
  } = useResetPassword();

  const { control, formState: { errors } } = form;

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
          <ResetPasswordIllustration />

          {/* ── Title + Subtitle ── */}
          <View style={{
            paddingHorizontal: spacing.lg,
            gap: spacing.sm,
            marginTop: spacing.xl,
            marginBottom: spacing.xl,
            alignItems: 'center',
          }}>
            <Text style={{
              fontSize: 24,
              fontWeight: '700',
              color: colors.textPrimary,
              textAlign: 'center',
            }}>
              New Password
            </Text>
            <Text style={{
              fontSize: 16,
              color: colors.textSecondary,
              textAlign: 'center',
              lineHeight: 24,
            }}>
              Create your new password to Login
            </Text>
          </View>

          {/* ── Inputs ── */}
          <View style={{ paddingHorizontal: spacing.lg, gap: 12 }}>

            {/* New Password */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value, onBlur } }) => (
                <AuthInputField
                  icon={<LockIcon />}
                  placeholder="Password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  isPassword
                  showPassword={showPassword}
                  onTogglePassword={togglePassword}
                  error={errors.password?.message}
                />
              )}
            />

            {/* Confirm Password */}
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value, onBlur } }) => (
                <AuthInputField
                  icon={<LockIcon />}
                  placeholder="Confirm password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  isPassword
                  showPassword={showConfirmPassword}
                  onTogglePassword={toggleConfirmPassword}
                  error={errors.confirmPassword?.message}
                />
              )}
            />
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

          {/* ── Submit Button ── */}
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
                    Create New Password
                  </Text>
              }
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
