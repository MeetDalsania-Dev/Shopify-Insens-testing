import { useInsensThemeStore } from '@/src/shared/state/theme.store';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { NewArrival } from '../types/home.types';

export default function NewArrivalCard({ brand, image }: NewArrival) {
  const { theme } = useInsensThemeStore();
  const { colors } = theme;

  return (
    <View style={{ flex: 1, gap: 8 }}>
      <Image
        source={image}
        style={{ height: 101, borderRadius: 16, width: '100%' }}
        resizeMode="cover"
      />
      <Text style={{
        fontSize: 12,
        fontWeight: '600',
        color: colors.brandText,
        textAlign: 'center',
      }}>
        {brand}
      </Text>
    </View>
  );
}
