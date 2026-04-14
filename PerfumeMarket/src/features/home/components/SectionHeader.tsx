import { useInsensThemeStore } from '@/src/shared/state/theme.store';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface Props {
  title: string;
  onSeeMore?: () => void;
}

export default function SectionHeader({ title, onSeeMore }: Props) {
  const { theme } = useInsensThemeStore();
  const { colors } = theme;

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <Text style={{ fontSize: 16, fontWeight: '600', color: colors.cardTitle }}>
        {title}
      </Text>
      <TouchableOpacity onPress={onSeeMore} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text style={{ fontSize: 12, fontWeight: '500', color: colors.slateBlue }}>
          See More
        </Text>
      </TouchableOpacity>
    </View>
  );
}
