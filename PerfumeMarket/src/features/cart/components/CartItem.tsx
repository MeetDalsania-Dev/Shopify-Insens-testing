import { useInsensThemeStore } from '@/src/shared/state/theme.store';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { CartItem as CartItemType } from '../types/cart.types';

function MinusIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path d="M4 8H12" stroke="#5A6E7F" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function PlusIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path d="M4 8H12" stroke="#5A6E7F" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M8 12V4" stroke="#5A6E7F" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

interface Props extends CartItemType {
  onIncrement: () => void;
  onDecrement: () => void;
}

export default function CartItem({
  brand,
  name,
  image,
  price,
  quantity,
  onIncrement,
  onDecrement,
}: Props) {
  const { theme } = useInsensThemeStore();
  const { colors } = theme;

  const formattedQty = quantity.toString().padStart(2, '0');

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 12,
      borderRadius: 12,
      backgroundColor: colors.cardBg,
    }}>
      {/* Product image */}
      <Image
        source={image}
        style={{ width: 87, height: 87, borderRadius: 8 }}
        resizeMode="contain"
      />

      {/* Content */}
      <View style={{ flex: 1, gap: 20 }}>
        {/* Brand + name */}
        <View style={{ gap: 4 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: colors.cardTitle }}>
            {brand}
          </Text>
          <Text style={{ fontSize: 12, color: colors.muted }} numberOfLines={1}>
            {name}
          </Text>
        </View>

        {/* Price + stepper */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.brandText }}>
            ${price.toFixed(2)}
          </Text>

          {/* Quantity stepper */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <TouchableOpacity
              onPress={onDecrement}
              activeOpacity={0.75}
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                backgroundColor: colors.homeBg,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <MinusIcon />
            </TouchableOpacity>

            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.brandText }}>
              {formattedQty}
            </Text>

            <TouchableOpacity
              onPress={onIncrement}
              activeOpacity={0.75}
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                backgroundColor: colors.homeBg,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <PlusIcon />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
