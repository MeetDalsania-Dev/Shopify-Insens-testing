import { useInsensThemeStore } from '@/src/shared/state/theme.store';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface Props {
  sizes: string[];
  selected: string;
  onSelect: (size: string) => void;
}

export default function SizeSelector({ sizes, selected, onSelect }: Props) {
  const { theme } = useInsensThemeStore();
  const { colors } = theme;

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 4,
      borderRadius: 12,
      backgroundColor: colors.cardBg,
    }}>
      {sizes.map((size) => {
        const isActive = selected === size;
        return (
          <TouchableOpacity
            key={size}
            onPress={() => onSelect(size)}
            activeOpacity={0.75}
            style={{
              flex: 1,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: isActive ? 8 : 100,
              backgroundColor: isActive ? colors.homeBg : 'transparent',
            }}
          >
            <Text style={{
              fontSize: 12,
              fontWeight: '500',
              color: colors.brandText,
            }}>
              {size}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
