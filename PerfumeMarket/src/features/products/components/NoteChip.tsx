import { useInsensThemeStore } from '@/src/shared/state/theme.store';
import React from 'react';
import { Text, View } from 'react-native';
import { ScentNote } from '../types/product.types';

export default function NoteChip({ name, emoji }: ScentNote) {
  const { theme } = useInsensThemeStore();
  const { colors } = theme;

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingLeft: 4,
      paddingRight: 16,
      paddingVertical: 4,
      borderRadius: 100,
      backgroundColor: colors.homeBg,
    }}>
      <Text style={{ fontSize: 20 }}>{emoji}</Text>
      <Text style={{ fontSize: 12, fontWeight: '500', color: colors.brandText }}>
        {name}
      </Text>
    </View>
  );
}
