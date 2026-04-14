import { useInsensThemeStore } from '@/src/shared/state/theme.store';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { useCartStore } from '../state/cart.store';
import CartItemCard from '../components/CartItem';

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
        d="M14.3889 20.8572C13.0247 22.3719 10.8967 22.3899 9.51953 20.8572"
        stroke="#1C1C1E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ── CartScreen ────────────────────────────────────────────────────────────────

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useInsensThemeStore();
  const { colors, spacing } = theme;

  const { items, increment, decrement, totalAmount } = useCartStore();

  const total = totalAmount();
  // Format total: show "k" if over 999
  const formattedTotal =
    total >= 1000
      ? `$${(total / 1000).toFixed(2)}k`
      : `$${total.toFixed(2)}`;

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.homeBg} />
      <View style={{ flex: 1, backgroundColor: colors.homeBg }}>

        {/* Scrollable content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 120 }}
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
              Cart
            </Text>
            <TouchableOpacity>
              <BellIcon />
            </TouchableOpacity>
          </View>

          {/* ── Cart Items ── */}
          <View style={{ paddingHorizontal: spacing.lg, paddingVertical: 12, gap: 16 }}>
            {items.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 48 }}>
                <Text style={{ fontSize: 16, color: colors.muted }}>Your cart is empty</Text>
              </View>
            ) : (
              items.map((item) => (
                <CartItemCard
                  key={item.id}
                  {...item}
                  onIncrement={() => increment(item.id)}
                  onDecrement={() => decrement(item.id)}
                />
              ))
            )}
          </View>

        </ScrollView>

        {/* ── Sticky Footer ── */}
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: spacing.lg,
          paddingTop: 16,
          paddingBottom: insets.bottom + 16,
          backgroundColor: colors.cardBg,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -16 },
          shadowOpacity: 0.05,
          shadowRadius: 16,
          elevation: 16,
        }}>
          {/* Total */}
          <View style={{ gap: 2 }}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#353535' }}>
              {formattedTotal}
            </Text>
            <Text style={{ fontSize: 12, color: '#868686' }}>Payment with Tax</Text>
          </View>

          {/* CTA */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={{
              height: 56,
              paddingHorizontal: 32,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.slateBlue,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF' }}>
              Proceed to pay
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </>
  );
}
