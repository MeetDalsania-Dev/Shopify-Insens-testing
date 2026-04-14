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

import { AppleIcon, EmailIcon, GoogleIcon, LockIcon } from '../assets/icons';
import AuthDivider from '../components/AuthDivider';
import AuthHeader from '../components/AuthHeader';
import AuthInputField from '../components/AuthInputField';
import AuthSocialButton from '../components/AuthSocialButton';
import { useLogin } from '../hooks/useLogin';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useInsensThemeStore();
  const { colors, spacing, radius } = theme;
  const { form, isLoading, apiError, showPassword, togglePassword, submit,setApiError } = useLogin();
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
            paddingTop: insets.top + 88,
            paddingBottom: insets.bottom + spacing.lg,
            paddingHorizontal: spacing.lg,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthHeader
            title="Hello Again!"
            subtitle="Welcome back, you've been missed"
          />

          {/* Inputs */}
          <View style={{ gap: 12, marginBottom: 12 }}>
            <Controller
              control={control}
              name="identifier"
              render={({ field: { onChange, value, onBlur } }) => (
                <AuthInputField
                  icon={<EmailIcon />}
                  placeholder="Email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  error={errors.identifier?.message}
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

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => router.push('/auth/forgot-password')}
            style={{ alignSelf: 'flex-end', marginBottom: spacing.xl }}
          >
            <Text style={{ fontSize: 14, fontWeight: '700', color: colors.textPrimary }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* API Error */}
          {apiError && (
            <Text style={{
              color: colors.error,
              fontSize: 13,
              textAlign: 'center',
              marginBottom: spacing.sm,
            }}>
              {apiError.message}
            </Text>
          )}

          {/* Sign In Button */}
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
              marginBottom: spacing.lg,
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading
              ? <ActivityIndicator color={colors.buttonText} />
              : <Text style={{ fontSize: 14, fontWeight: '500', color: colors.buttonText }}>
                  Sign In
                </Text>
            }
          </TouchableOpacity>

          <AuthDivider />

          <View style={{ gap: 12, marginBottom: spacing.xl }}>
            <AuthSocialButton icon={<GoogleIcon />} label="Sign In with Google" onPress={() => {}} />
            <AuthSocialButton icon={<AppleIcon />} label="Sign In with Apple" onPress={() => {}} />
          </View>

          {/* Register Link */}
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ fontSize: 14, color: colors.textSecondary }}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/register')}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.textPrimary }}>Register</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
        
      </KeyboardAvoidingView>
    </>
  );
}
