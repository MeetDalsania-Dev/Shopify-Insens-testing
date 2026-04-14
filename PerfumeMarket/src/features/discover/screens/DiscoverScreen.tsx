import { useInsensThemeStore } from '@/src/shared/state/theme.store';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

import { useLikedStore } from '@/src/features/liked/state/liked.store';
import { DISCOVER_CATEGORIES, DISCOVER_PRODUCTS } from '../config/discover.config';
import CategoryFilter from '../components/CategoryFilter';
import ProductGridCard from '../components/ProductGridCard';
import { DiscoverCategory } from '../types/discover.types';

// ── Inline Icons ──────────────────────────────────────────────────────────────

function BackArrow({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path
          d="M10 16L6 12M6 12L10 8M6 12L18 12"
          stroke="#1C1C1E"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </TouchableOpacity>
  );
}

function BellIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 17.8476C17.6392 17.8476 20.2481 17.1242 20.5 14.2205C20.5 11.3188 18.6812 11.5054 18.6812 7.94511C18.6812 5.16414 16.0452 2 12 2C7.95477 2 5.31885 5.16414 5.31885 7.94511C5.31885 11.5054 3.5 11.3188 3.5 14.2205C3.75295 17.1352 6.36177 17.8476 12 17.8476Z"
        stroke="#1C1C1E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14.3887 20.8572C13.0246 22.3719 10.8966 22.3899 9.51941 20.8572"
        stroke="#1C1C1E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SearchIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Circle
        cx="9.80547"
        cy="9.80541"
        r="7.49046"
        stroke="#6D7F8F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.0153 15.4043L17.9519 18.3334"
        stroke="#6D7F8F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function FilterIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 2.25C14.932 2.25 13.25 3.932 13.25 6C13.25 8.068 14.932 9.75 17 9.75C19.068 9.75 20.75 8.068 20.75 6C20.75 3.932 19.068 2.25 17 2.25ZM17 8.25C15.759 8.25 14.75 7.241 14.75 6C14.75 4.759 15.759 3.75 17 3.75C18.241 3.75 19.25 4.759 19.25 6C19.25 7.241 18.241 8.25 17 8.25ZM7 14.25C4.932 14.25 3.25 15.932 3.25 18C3.25 20.068 4.932 21.75 7 21.75C9.068 21.75 10.75 20.068 10.75 18C10.75 15.932 9.068 14.25 7 14.25ZM7 20.25C5.759 20.25 4.75 19.241 4.75 18C4.75 16.759 5.759 15.75 7 15.75C8.241 15.75 9.25 16.759 9.25 18C9.25 19.241 8.241 20.25 7 20.25ZM17 14.25C16.586 14.25 16.25 14.586 16.25 15V21C16.25 21.414 16.586 21.75 17 21.75C17.414 21.75 17.75 21.414 17.75 21V15C17.75 14.586 17.414 14.25 17 14.25ZM7 9.75C7.414 9.75 7.75 9.414 7.75 9V3C7.75 2.586 7.414 2.25 7 2.25C6.586 2.25 6.25 2.586 6.25 3V9C6.25 9.414 6.586 9.75 7 9.75Z"
        fill="white"
      />
    </Svg>
  );
}

// ── DiscoverScreen ────────────────────────────────────────────────────────────

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useInsensThemeStore();
  const { colors, spacing } = theme;

  const [selectedCategory, setSelectedCategory] = useState<DiscoverCategory>('For Him');
  const { isLiked, toggle } = useLikedStore();

  const products = DISCOVER_PRODUCTS;

  // Pair products into rows of 2
  const rows: [typeof products[0], typeof products[0] | null][] = [];
  for (let i = 0; i < products.length; i += 2) {
    rows.push([products[i], products[i + 1] ?? null]);
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.homeBg} />
      <View style={{ flex: 1, backgroundColor: colors.homeBg }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >

          {/* ── Header ── */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
          }}>
            <BackArrow onPress={() => router.back()} />
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.cardTitle }}>
              Discover
            </Text>
            <TouchableOpacity>
              <BellIcon />
            </TouchableOpacity>
          </View>

          {/* ── Search Bar ── */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingHorizontal: spacing.lg,
            paddingVertical: 12,
          }}>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              height: 48,
              backgroundColor: colors.cardBg,
              borderRadius: 12,
              paddingHorizontal: spacing.md,
            }}>
              <SearchIcon />
              <TextInput
                placeholder="Search here..."
                placeholderTextColor={colors.lightGray}
                style={{ flex: 1, fontSize: 14, color: colors.cardTitle }}
              />
            </View>
            <View style={{
              width: 48,
              height: 48,
              backgroundColor: colors.slateBlue,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 4,
            }}>
              <FilterIcon />
            </View>
          </View>

          {/* ── Category Filter ── */}
          <View style={{ paddingVertical: 12 }}>
            <CategoryFilter
              categories={DISCOVER_CATEGORIES}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </View>

          {/* ── Product Grid ── */}
          <View style={{ paddingHorizontal: spacing.lg, paddingVertical: 12, gap: 12 }}>
            {rows.map((row, rowIdx) => (
              <View key={rowIdx} style={{ flexDirection: 'row', gap: 12 }}>
                <ProductGridCard
                  {...row[0]}
                  isFavorited={isLiked(row[0].id)}
                  onPress={() => router.push(`/product/${row[0].id}`)}
                  onToggleFavorite={() => toggle(row[0].id)}
                />
                {row[1] ? (
                  <ProductGridCard
                    {...row[1]}
                    isFavorited={isLiked(row[1].id)}
                    onPress={() => router.push(`/product/${row[1]!.id}`)}
                    onToggleFavorite={() => toggle(row[1]!.id)}
                  />
                ) : (
                  <View style={{ flex: 1 }} />
                )}
              </View>
            ))}
          </View>

        </ScrollView>
      </View>
    </>
  );
}
