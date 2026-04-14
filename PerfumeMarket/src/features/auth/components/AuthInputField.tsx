import { useInsensThemeStore } from '@/src/shared/state/theme.store';
import React from 'react';
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { EyeOffIcon, EyeOnIcon } from '../assets/icons';

interface Props extends TextInputProps {
  icon: React.ReactNode;
  error?: string;
  isPassword?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

export default function AuthInputField({
  icon,
  error,
  isPassword = false,
  showPassword = false,
  onTogglePassword,
  ...props
}: Props) {
  const { theme } = useInsensThemeStore();
  const { colors, radius, spacing } = theme;

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 56,
          backgroundColor: colors.white,
          borderRadius: radius.md,
          paddingHorizontal: spacing.lg,
          borderWidth: error ? 1.5 : 0,
          borderColor: error ? colors.error : 'transparent',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm + 4, flex: 1 }}>
          {icon}
          <TextInput
            style={{ flex: 1, fontSize: 14, color: colors.textPrimary }}
            placeholderTextColor={colors.textSecondary}
            secureTextEntry={isPassword && !showPassword}
            autoCapitalize="none"
            {...props}
          />
        </View>
        {isPassword && (
          <TouchableOpacity
            onPress={onTogglePassword}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {showPassword ? <EyeOnIcon /> : <EyeOffIcon />}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={{
          color: colors.error,
          fontSize: 12,
          marginTop: 4,
          marginLeft: spacing.xs,
        }}>
          {error}
        </Text>
      )}
    </View>
  );
}
