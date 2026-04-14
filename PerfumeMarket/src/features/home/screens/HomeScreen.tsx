import { useAuthStore } from '@/src/features/auth/state/auth.store';
import { useInsensThemeStore } from '@/src/shared/state/theme.store';
import React from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

import { DAILY_SUGGESTIONS, NEW_ARRIVALS } from '../config/home.config';
import NewArrivalCard from '../components/NewArrivalCard';
import ProductCard from '../components/ProductCard';
import QuizBanner from '../components/QuizBanner';
import SectionHeader from '../components/SectionHeader';

// ── Inline Icons ─────────────────────────────────────────────────────────────

function BellIcon() {
  return (
    <Svg width={44} height={44} viewBox="0 0 44 44" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22 27.8476C27.6392 27.8476 30.2481 27.1242 30.5 24.2205C30.5 21.3188 28.6812 21.5054 28.6812 17.9451C28.6812 15.1641 26.0452 12 22 12C17.9548 12 15.3188 15.1641 15.3188 17.9451C15.3188 21.5054 13.5 21.3188 13.5 24.2205C13.753 27.1352 16.3618 27.8476 22 27.8476Z"
        stroke="#1C1C1E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M24.3888 30.8572C23.0247 32.3719 20.8967 32.3899 19.5195 30.8572"
        stroke="#1C1C1E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={29} cy={15} r={4.75} fill="#FF4747" stroke="white" strokeWidth="1.5" />
    </Svg>
  );
}

function SearchIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Circle
        cx="9.8055"
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

// ── HomeScreen ────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useInsensThemeStore();
  const { colors, spacing } = theme;
  const { user } = useAuthStore();

  const firstName = user?.fullName?.split(' ')[0] ?? user?.username ?? 'User';

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.homeBg} />
      <View style={{ flex: 1, backgroundColor: colors.homeBg }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingTop: insets.top, paddingBottom: spacing.xl }}
          showsVerticalScrollIndicator={false}
        >

          {/* ── Header ── */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
            paddingVertical: 12,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Image
                source={require('@/assets/images/icon.png')}
                style={{ width: 48, height: 48, borderRadius: 12 }}
                resizeMode="cover"
              />
              <View style={{ gap: 2 }}>
                <Text style={{ fontSize: 12, color: colors.muted }}>
                  Hey {firstName}
                </Text>
                <Text style={{ fontSize: 18, fontWeight: '600', color: colors.cardTitle }}>
                  Welcome Back
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={{
                width: 48,
                height: 48,
                backgroundColor: colors.cardBg,
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
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
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 4,
            }}>
              <FilterIcon />
            </View>
          </View>

          {/* ── Daily Suggestions ── */}
          <View style={{ gap: 16, paddingVertical: 12 }}>
            <View style={{ paddingHorizontal: spacing.lg }}>
              <SectionHeader title="View daily suggestions" />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: 12 }}
            >
              {DAILY_SUGGESTIONS.map((item) => (
                <ProductCard key={item.id} {...item} />
              ))}
            </ScrollView>
          </View>

          {/* ── New Arrivals ── */}
          <View style={{ gap: 16, paddingHorizontal: spacing.lg, paddingVertical: 12 }}>
            <SectionHeader title="Discover new arrivals" />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {NEW_ARRIVALS.map((item) => (
                <NewArrivalCard key={item.id} {...item} />
              ))}
            </View>
          </View>

          {/* ── Quiz Banner ── */}
          <View style={{ paddingHorizontal: spacing.lg, paddingVertical: 12 }}>
            <QuizBanner />
          </View>

        </ScrollView>
      </View>
    </>
  );
}
