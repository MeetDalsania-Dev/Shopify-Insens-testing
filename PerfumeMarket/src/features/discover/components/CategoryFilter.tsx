import { useInsensThemeStore } from '@/src/shared/state/theme.store';
import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { DiscoverCategory } from '../types/discover.types';

interface Props {
  categories: DiscoverCategory[];
  selected: DiscoverCategory;
  onSelect: (category: DiscoverCategory) => void;
}

export default function CategoryFilter({ categories, selected, onSelect }: Props) {
  const { theme } = useInsensThemeStore();
  const { colors } = theme;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
    >
      {categories.map((category) => {
        const isActive = selected === category;
        return (
          <TouchableOpacity
            key={category}
            onPress={() => onSelect(category)}
            activeOpacity={0.75}
            style={{
              height: 40,
              paddingHorizontal: 20,
              paddingVertical: 8,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: isActive ? colors.slateBlue : '#F9FAFB',
            }}
          >
            <Text style={{
              fontSize: 12,
              fontWeight: '500',
              color: isActive ? '#FFFFFF' : colors.cardTitle,
            }}>
              {category}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
