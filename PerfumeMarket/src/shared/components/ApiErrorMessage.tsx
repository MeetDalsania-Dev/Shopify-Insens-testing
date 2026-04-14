import { useInsensThemeStore } from '@/src/shared/state/theme.store';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { AppError } from '../types/api.types';

interface Props {
  error: AppError | null;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export default function ApiErrorMessage({ error, onRetry, onDismiss }: Props) {
  const { theme } = useInsensThemeStore();
  const { colors, spacing, radius } = theme;

  if (!error) return null;

  return (
    <View style={{
      backgroundColor: '#FEF2F2',
      borderRadius: radius.sm ?? 8,
      padding: spacing.md,
      borderLeftWidth: 3,
      borderLeftColor: colors.error,
      gap: 8,
    }}>
      {/* Main message */}
      <Text style={{ fontSize: 13, color: colors.error, fontWeight: '500' }}>
        {error.message}
      </Text>

      {/* Field-level errors */}
      {error.fieldErrors && (
        <View style={{ gap: 2 }}>
          {Object.entries(error.fieldErrors).map(([field, msg]) => (
            <Text key={field} style={{ fontSize: 12, color: colors.error }}>
              • {field}: {msg}
            </Text>
          ))}
        </View>
      )}

      {/* Actions */}
      {(onRetry || onDismiss) && (
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          {onRetry && (
            <TouchableOpacity onPress={onRetry}>
              <Text style={{
                fontSize: 12,
                fontWeight: '700',
                color: colors.error,
                textDecorationLine: 'underline',
              }}>
                Try again
              </Text>
            </TouchableOpacity>
          )}
          {onDismiss && (
            <TouchableOpacity onPress={onDismiss}>
              <Text style={{
                fontSize: 12,
                color: colors.textSecondary,
                textDecorationLine: 'underline',
              }}>
                Dismiss
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
