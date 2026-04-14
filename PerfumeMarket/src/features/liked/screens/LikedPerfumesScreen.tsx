import { useInsensThemeStore } from '@/src/shared/state/theme.store';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { useLikedStore } from '../state/liked.store';
import { LikedProduct } from '../types/liked.types';

// ── Icons ─────────────────────────────────────────────────────────────────────

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
        d="M14.3889 20.8572C13.0247 22.3719 10.8967 22.3899 9.51953 20.8572"
        stroke="#1C1C1E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function HeartFilled() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path
        d="M10.9599 2.06665C9.75325 2.06665 8.67325 2.65332 7.99992 3.55332C7.32659 2.65332 6.24659 2.06665 5.03992 2.06665C2.99325 2.06665 1.33325 3.73332 1.33325 5.79332C1.33325 6.58665 1.45992 7.31998 1.67992 7.99998C2.73325 11.3333 5.97992 13.3266 7.58659 13.8733C7.81325 13.9533 8.18659 13.9533 8.41325 13.8733C10.0199 13.3266 13.2666 11.3333 14.3199 7.99998C14.5399 7.31998 14.6666 6.58665 14.6666 5.79332C14.6666 3.73332 13.0066 2.06665 10.9599 2.06665Z"
        fill="#FF4747"
      />
    </Svg>
  );
}

// ── Liked Product Card ────────────────────────────────────────────────────────

function LikedCard({ id, brand, name, image }: LikedProduct & { onUnlike: () => void }) {
  const { theme } = useInsensThemeStore();
  const { colors } = theme;

  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.cardBg,
      borderRadius: 16,
      paddingHorizontal: 8,
      paddingTop: 16,
      paddingBottom: 8,
    }}>
      <Image
        source={image}
        style={{ width: '100%', height: 100, borderRadius: 8 }}
        resizeMode="contain"
      />

      {/* Heart badge — always filled red in liked screen */}
      <View style={{
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255,255,255,0.4)',
        borderRadius: 10,
        padding: 10,
      }}>
        <HeartFilled />
      </View>

      {/* Brand + name */}
      <View style={{ padding: 8, gap: 4 }}>
        <Text
          style={{ fontSize: 14, fontWeight: '700', color: colors.brandText }}
          numberOfLines={1}
        >
          {brand}
        </Text>
        <Text
          style={{ fontSize: 12, color: colors.muted }}
          numberOfLines={1}
        >
          {name}
        </Text>
      </View>
    </View>
  );
}

// ── LikedPerfumesScreen ───────────────────────────────────────────────────────

export default function LikedPerfumesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useInsensThemeStore();
  const { colors, spacing } = theme;

  const { getLikedProducts, toggle } = useLikedStore();
  const liked = getLikedProducts();

  // Pair products into rows of 2
  const rows: [LikedProduct, LikedProduct | null][] = [];
  for (let i = 0; i < liked.length; i += 2) {
    rows.push([liked[i], liked[i + 1] ?? null]);
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
              Liked Perfumes
            </Text>
            <TouchableOpacity>
              <BellIcon />
            </TouchableOpacity>
          </View>

          {/* ── Grid ── */}
          <View style={{ paddingHorizontal: spacing.lg, paddingVertical: 12, gap: 12 }}>
            {liked.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 48 }}>
                <Text style={{ fontSize: 16, color: colors.muted }}>No liked perfumes yet</Text>
              </View>
            ) : (
              rows.map((row, rowIdx) => (
                <View key={rowIdx} style={{ flexDirection: 'row', gap: 12 }}>
                  <LikedCard
                    {...row[0]}
                    onUnlike={() => toggle(row[0].id)}
                  />
                  {row[1] ? (
                    <LikedCard
                      {...row[1]}
                      onUnlike={() => toggle(row[1]!.id)}
                    />
                  ) : (
                    <View style={{ flex: 1 }} />
                  )}
                </View>
              ))
            )}
          </View>

        </ScrollView>
      </View>
    </>
  );
}
