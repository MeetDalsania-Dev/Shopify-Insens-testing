import { useInsensThemeStore } from '@/src/shared/state/theme.store';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { DiscoverProduct } from '../types/discover.types';

// ── Heart icons ───────────────────────────────────────────────────────────────

function HeartOutline() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8.41331 13.8733C8.18665 13.9533 7.81331 13.9533 7.58665 13.8733C5.65331 13.2133 1.33331 10.46 1.33331 5.79332C1.33331 3.73332 2.99331 2.06665 5.03998 2.06665C6.25331 2.06665 7.32665 2.65332 7.99998 3.55998C8.67331 2.65332 9.75331 2.06665 10.96 2.06665C13.0066 2.06665 14.6666 3.73332 14.6666 5.79332C14.6666 10.46 10.3466 13.2133 8.41331 13.8733Z"
        stroke="#B3BDC4"
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
        d="M10.96 2.06665C9.75338 2.06665 8.67337 2.65332 8.00004 3.55332C7.32671 2.65332 6.24671 2.06665 5.04004 2.06665C2.99337 2.06665 1.33337 3.73332 1.33337 5.79332C1.33337 6.58665 1.46004 7.31998 1.68004 7.99998C2.73337 11.3333 5.98004 13.3266 7.58671 13.8733C7.81337 13.9533 8.18671 13.9533 8.41337 13.8733C10.02 13.3266 13.2667 11.3333 14.32 7.99998C14.54 7.31998 14.6667 6.58665 14.6667 5.79332C14.6667 3.73332 13.0067 2.06665 10.96 2.06665Z"
        fill="#FF4747"
      />
    </Svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props extends DiscoverProduct {
  onPress?: () => void;
  onToggleFavorite?: () => void;
}

export default function ProductGridCard({
  brand,
  name,
  image,
  isFavorited,
  onPress,
  onToggleFavorite,
}: Props) {
  const { theme } = useInsensThemeStore();
  const { colors } = theme;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        flex: 1,
        backgroundColor: colors.cardBg,
        borderRadius: 16,
        paddingHorizontal: 8,
        paddingTop: 16,
        paddingBottom: 8,
      }}
    >
      {/* Product image */}
      <Image
        source={image}
        style={{ width: '100%', height: 100, borderRadius: 8 }}
        resizeMode="contain"
      />

      {/* Favorite badge – top-right corner */}
      <TouchableOpacity
        onPress={onToggleFavorite}
        activeOpacity={0.8}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          backgroundColor: 'rgba(255,255,255,0.4)',
          borderRadius: 10,
          padding: 10,
        }}
        hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
      >
        {isFavorited ? <HeartFilled /> : <HeartOutline />}
      </TouchableOpacity>

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
    </TouchableOpacity>
  );
}
