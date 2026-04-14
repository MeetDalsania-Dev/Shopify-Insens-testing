import { useInsensThemeStore } from '@/src/shared/state/theme.store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

import { useCartStore } from '@/src/features/cart/state/cart.store';
import { DISCOVER_PRODUCTS } from '@/src/features/discover/config/discover.config';
import { getProductDetail } from '../config/products.config';
import AccordionSection from '../components/AccordionSection';
import NoteChip from '../components/NoteChip';
import SizeSelector from '../components/SizeSelector';
import { UsageTag } from '../types/product.types';

// ── Inline Icons ──────────────────────────────────────────────────────────────

function BackArrow({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
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

function StarIcon() {
  return (
    <Svg width={17} height={16} viewBox="0 0 17 16" fill="none">
      <Path
        d="M9.45964 1.15534L10.8791 3.9943C11.0727 4.3895 11.5889 4.76856 12.0244 4.84115L14.5972 5.2686C16.2425 5.54282 16.6296 6.73647 15.444 7.914L13.4439 9.91417C13.1051 10.2529 12.9196 10.9062 13.0245 11.374L13.5971 13.85C14.0488 15.8098 13.0083 16.568 11.2743 15.5437L8.86281 14.1162C8.42729 13.8581 7.70949 13.8581 7.2659 14.1162L4.8544 15.5437C3.12844 16.568 2.07997 15.8018 2.53162 13.85L3.10425 11.374C3.2091 10.9062 3.0236 10.2529 2.68486 9.91417L0.684683 7.914C-0.492839 6.73647 -0.113774 5.54282 1.53153 5.2686L4.10434 4.84115C4.53179 4.76856 5.04797 4.3895 5.24153 3.9943L6.66101 1.15534C7.43527 -0.385114 8.69345 -0.385114 9.45964 1.15534Z"
        fill="#FFC179"
      />
    </Svg>
  );
}

function LocationIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10 1.875C5.97921 1.875 2.70837 5.14583 2.70837 9.16667C2.70837 13.4317 6.62253 16.0166 9.21253 17.7275L9.65337 18.02C9.75837 18.09 9.87921 18.125 10 18.125C10.1209 18.125 10.2417 18.09 10.3467 18.02L10.7875 17.7275C13.3775 16.0166 17.2917 13.4317 17.2917 9.16667C17.2917 5.14583 14.0209 1.875 10 1.875ZM10.0992 16.6842L10 16.7501L9.90087 16.6842C7.39254 15.0275 3.95837 12.7592 3.95837 9.16667C3.95837 5.835 6.66837 3.125 10 3.125C13.3317 3.125 16.0417 5.835 16.0417 9.16667C16.0417 12.7592 12.6067 15.0283 10.0992 16.6842ZM10 6.45833C8.50671 6.45833 7.29171 7.67333 7.29171 9.16667C7.29171 10.66 8.50671 11.875 10 11.875C11.4934 11.875 12.7084 10.66 12.7084 9.16667C12.7084 7.67333 11.4934 6.45833 10 6.45833ZM10 10.625C9.19587 10.625 8.54171 9.97083 8.54171 9.16667C8.54171 8.3625 9.19587 7.70833 10 7.70833C10.8042 7.70833 11.4584 8.3625 11.4584 9.16667C11.4584 9.97083 10.8042 10.625 10 10.625Z"
        fill="#4A5A68"
      />
    </Svg>
  );
}

// ── Usage chip icons ──────────────────────────────────────────────────────────

function UsageChip({ tag }: { tag: UsageTag }) {
  const { theme } = useInsensThemeStore();
  const { colors } = theme;

  const icon = (() => {
    switch (tag.icon) {
      case 'cold':
        return (
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M12 8.5V3" stroke="#4A5A68" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M12 21V15.5" stroke="#4A5A68" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M10 3H14" stroke="#4A5A68" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M10 21H14" stroke="#4A5A68" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M8.96996 10.25L4.20996 7.5" stroke="#4A5A68" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M19.79 16.5L15.03 13.75" stroke="#4A5A68" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M3.20996 9.23001L5.20996 5.77002" stroke="#4A5A68" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M18.79 18.23L20.79 14.77" stroke="#4A5A68" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M15.5 12C15.5 12.64 15.33 13.23 15.03 13.75C14.42 14.8 13.29 15.5 12 15.5C10.71 15.5 9.58 14.8 8.97 13.75C8.67 13.23 8.5 12.64 8.5 12C8.5 11.36 8.67 10.77 8.97 10.25C9.58 9.2 10.71 8.5 12 8.5C13.29 8.5 14.42 9.2 15.03 10.25C15.33 10.77 15.5 11.36 15.5 12Z" stroke="#4A5A68" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M19.79 7.5L15.03 10.25" stroke="#4A5A68" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M8.96996 13.75L4.20996 16.5" stroke="#4A5A68" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M20.79 9.23001L18.79 5.77002" stroke="#4A5A68" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M5.20996 18.23L3.20996 14.77" stroke="#4A5A68" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        );
      case 'office':
        return (
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M7.99995 22H15.9999C20.0199 22 20.7399 20.39 20.9499 18.43L21.6999 10.43C21.9699 7.99 21.2699 6 16.9999 6H6.99995C2.72995 6 2.02995 7.99 2.29995 10.43L3.04995 18.43C3.25995 20.39 3.97995 22 7.99995 22Z" stroke="#4A5A68" strokeWidth="1.5" strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M8 6V5.2C8 3.43 8 2 11.2 2H12.8C16 2 16 3.43 16 5.2V6" stroke="#4A5A68" strokeWidth="1.5" strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M14 13V14C14 14.01 14 14.01 14 14.02C14 15.11 13.99 16 12 16C10.02 16 10 15.12 10 14.03V13C10 12 10 12 11 12H13C14 12 14 12 14 13Z" stroke="#4A5A68" strokeWidth="1.5" strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M21.65 11C19.34 12.68 16.7 13.68 14 14.02" stroke="#4A5A68" strokeWidth="1.5" strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M2.62 11.27C4.87 12.81 7.41 13.74 10 14.03" stroke="#4A5A68" strokeWidth="1.5" strokeMiterlimit={10} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        );
      default:
        return (
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#4A5A68" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26003 15 3.41003 18.13 3.41003 22" stroke="#4A5A68" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        );
    }
  })();

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 100,
      borderWidth: 1,
      borderColor: colors.homeBg,
    }}>
      {icon}
      <Text style={{ fontSize: 12, fontWeight: '500', color: colors.brandText }}>
        {tag.label}
      </Text>
    </View>
  );
}

// ── ProductDetailScreen ───────────────────────────────────────────────────────

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useInsensThemeStore();
  const { colors, spacing } = theme;

  const product = getProductDetail(id);

  // Fallback to discover product if no full detail exists
  const discoverProduct = DISCOVER_PRODUCTS.find((p) => p.id === id);

  const brand = product?.brand ?? discoverProduct?.brand ?? 'Unknown Brand';
  const heroImage = product?.heroImage ?? discoverProduct?.image ?? require('@/assets/images/onboarding/slide1.jpg');
  const sizes = product?.sizes ?? ['30ml', '50ml', '100ml'];

  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem({
      id: `${id}-${selectedSize}`,
      brand,
      name: product?.name ?? discoverProduct?.name ?? brand,
      image: heroImage,
      price: 120.99, // Replace with actual price from API
    });
    router.push('/cart');
  };

  const description = product?.description ?? 'No description available.';

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <View style={{ flex: 1, backgroundColor: colors.homeBg }}>

        {/* Scrollable content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
          showsVerticalScrollIndicator={false}
        >

          {/* ── Hero image ── */}
          <View style={{ position: 'relative' }}>
            <Image
              source={heroImage}
              style={{ width: '100%', height: 375 }}
              resizeMode="cover"
            />
            <View style={{
              position: 'absolute',
              top: insets.top + 12,
              left: 24,
            }}>
              <BackArrow onPress={() => router.back()} />
            </View>
          </View>

          {/* ── Info section ── */}
          <View style={{ paddingHorizontal: spacing.lg, paddingTop: 24, paddingBottom: 12, gap: 16 }}>

            {/* Brand name */}
            <Text style={{ fontSize: 32, fontWeight: '700', color: colors.cardTitle }}>
              {brand}
            </Text>

            {/* Rating + Location row */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <StarIcon />
                <Text style={{ fontSize: 14 }}>
                  <Text style={{ fontWeight: '700', color: colors.brandText }}>
                    {product?.rating ?? '4.50'}{' '}
                  </Text>
                  <Text style={{ color: colors.muted }}>
                    ({product?.reviewCount ?? 0} reviews)
                  </Text>
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <LocationIcon />
                <Text style={{ fontSize: 14, fontWeight: '700', color: colors.brandText }}>
                  {product?.location ?? 'Global'}
                </Text>
              </View>
            </View>

            {/* Description */}
            <Text style={{ fontSize: 12, color: colors.muted, lineHeight: 18 }}>
              {showFullDesc ? description : description.slice(0, 140)}
              {'  '}
              <Text
                onPress={() => setShowFullDesc(!showFullDesc)}
                style={{ fontSize: 12, fontWeight: '700', color: colors.cardTitle }}
              >
                {showFullDesc ? 'Show Less' : 'Read More...'}
              </Text>
            </Text>
          </View>

          {/* ── Size Selector ── */}
          <View style={{ paddingHorizontal: spacing.lg, paddingVertical: 12 }}>
            <SizeSelector
              sizes={sizes}
              selected={selectedSize}
              onSelect={setSelectedSize}
            />
          </View>

          {/* ── Accordion sections ── */}
          <View style={{ paddingHorizontal: spacing.lg, paddingVertical: 12, gap: 16 }}>

            {/* Top Notes */}
            <AccordionSection
              title="Top Notes"
              subtitle="Lasts: 15–30 minutes"
              initiallyOpen
            >
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12 }}
              >
                {(product?.topNotes ?? []).map((note) => (
                  <NoteChip key={note.id} {...note} />
                ))}
              </ScrollView>
            </AccordionSection>

            {/* Heart Notes */}
            <AccordionSection title="Heart Notes" subtitle="Lasts: 2–4 hours">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12 }}
              >
                {(product?.heartNotes ?? []).map((note) => (
                  <NoteChip key={note.id} {...note} />
                ))}
              </ScrollView>
            </AccordionSection>

            {/* Base Notes */}
            <AccordionSection title="Base Notes" subtitle="Lasts: 6–12 hours">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12 }}
              >
                {(product?.baseNotes ?? []).map((note) => (
                  <NoteChip key={note.id} {...note} />
                ))}
              </ScrollView>
            </AccordionSection>

            {/* Usage */}
            <AccordionSection title="Usage" initiallyOpen>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {(product?.usageTags ?? []).map((tag) => (
                  <UsageChip key={tag.id} tag={tag} />
                ))}
              </View>
            </AccordionSection>

            {/* Story */}
            <AccordionSection title="Story">
              <Text style={{ fontSize: 12, color: colors.muted, lineHeight: 18 }}>
                {product?.story ?? ''}
              </Text>
            </AccordionSection>

          </View>
        </ScrollView>

        {/* ── Sticky footer – Add to Cart / Buy Now ── */}
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          flexDirection: 'row',
          gap: 12,
          paddingHorizontal: spacing.lg,
          paddingTop: 16,
          paddingBottom: insets.bottom + 16,
          backgroundColor: colors.cardBg,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 16,
          elevation: 16,
        }}>
          <TouchableOpacity
            onPress={handleAddToCart}
            activeOpacity={0.85}
            style={{
              flex: 1,
              height: 52,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1.5,
              borderColor: colors.slateBlue,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.slateBlue }}>
              Add to Cart
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/cart')}
            activeOpacity={0.85}
            style={{
              flex: 1,
              height: 52,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.slateBlue,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF' }}>
              Buy Now
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </>
  );
}
