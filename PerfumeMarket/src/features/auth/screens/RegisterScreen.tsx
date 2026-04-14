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

import { AppleIcon, BackArrowIcon, EmailIcon, GoogleIcon, LockIcon, UserIcon } from '../assets/icons';
import AuthDivider from '../components/AuthDivider';
import AuthHeader from '../components/AuthHeader';
import AuthInputField from '../components/AuthInputField';
import AuthSocialButton from '../components/AuthSocialButton';
import { useRegister } from '../hooks/useRegister';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useInsensThemeStore();
  const { colors, spacing, radius } = theme;
  const { form, isLoading, apiError, showPassword, togglePassword, submit } = useRegister();
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
            paddingBottom: insets.bottom + spacing.lg,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <View style={{
            paddingTop: insets.top,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
          }}>
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <BackArrowIcon />
            </TouchableOpacity>
          </View>

          <View style={{ paddingHorizontal: spacing.lg, gap: spacing.lg }}>

            <AuthHeader title="Create an account" />

            <View style={{ gap: spacing.lg }}>

              {/* Inputs */}
              <View style={{ gap: 12 }}>
                <Controller
                  control={control}
                  name="username"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <AuthInputField
                      icon={<UserIcon />}
                      placeholder="Your Name"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="words"
                      error={errors.username?.message}
                    />
                  )}
                />
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
              </View>

              {apiError && (
                <Text style={{ color: colors.error, fontSize: 13, textAlign: 'center' }}>
                  {apiError}
                </Text>
              )}

              {/* Sign Up Button */}
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
                      Sign Up
                    </Text>
                }
              </TouchableOpacity>

              <AuthDivider />

              <View style={{ gap: 12 }}>
                <AuthSocialButton icon={<GoogleIcon />} label="Sign In with Google" onPress={() => {}} />
                <AuthSocialButton icon={<AppleIcon />} label="Sign In with Apple" onPress={() => {}} />
              </View>

            </View>
          </View>

          {/* Sign In Link */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl }}>
            <Text style={{ fontSize: 14, color: colors.textSecondary }}>Already Have an Account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.textPrimary }}>Sign In</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
