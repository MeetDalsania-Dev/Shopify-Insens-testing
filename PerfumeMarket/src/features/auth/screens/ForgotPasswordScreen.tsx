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

import { BackArrowIcon, EmailIcon } from '../assets/icons';
import AuthInputField from '../components/AuthInputField';
import ForgotPasswordIllustration from '../components/ForgotPasswordIllustration';
import { useForgotPassword } from '../hooks/useForgotPassword';

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useInsensThemeStore();
  const { colors, spacing, radius } = theme;
  const { form, isLoading, apiError, submit } = useForgotPassword();
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
          contentContainerStyle={{
            flex: 1,
            paddingBottom: insets.bottom + spacing.lg,
          }}
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

          {/* ── Illustration — centered ── */}
          <ForgotPasswordIllustration />

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
              Forgot Password?
            </Text>
            <Text style={{
              fontSize: 16,
              color: colors.textSecondary,
              textAlign: 'center',
              lineHeight: 24,
            }}>
              Type your email, we will send you verification code via email
            </Text>
          </View>

          {/* ── Email Input ── */}
          <View style={{ paddingHorizontal: spacing.lg }}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value, onBlur } }) => (
                <AuthInputField
                  icon={<EmailIcon />}
                  placeholder="Email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  error={errors.email?.message}
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

          {/* ── Spacer pushes button to bottom ── */}
          <View style={{ flex: 1 }} />

          {/* ── Send Button ── */}
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
                : <Text style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: colors.buttonText,
                  }}>
                    Send Me Email
                  </Text>
              }
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
