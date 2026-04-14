import { useInsensThemeStore } from '@/src/shared/state/theme.store';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ONBOARDING_SLIDES } from '../config/onboarding.config';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useInsensThemeStore();  // ← Pull theme
  const { colors, spacing, radius, typography } = theme;

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const goToSlide = (nextIndex: number) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(slideAnim, {
        toValue: -nextIndex * width,
        useNativeDriver: true,
        tension: 60,
        friction: 10,
      }).start();
      setCurrentIndex(nextIndex);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleNext = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      goToSlide(currentIndex + 1);
    }
  };

  const handleGetStarted = () => {
    router.replace('/auth/login');
  };

  const current = ONBOARDING_SLIDES[currentIndex];

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.onboardingBg} />
      <View
        style={{
          flex: 1,
          backgroundColor: colors.onboardingBg,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        {/* IMAGE CAROUSEL */}
        <View
          style={{
            width,
            height: height * 0.58,
            borderBottomLeftRadius: radius.lg,
            borderBottomRightRadius: radius.lg,
            overflow: 'hidden',
          }}
        >
          <Animated.View
            style={{
              flexDirection: 'row',
              width: width * ONBOARDING_SLIDES.length,
              height: '100%',
              transform: [{ translateX: slideAnim }],
            }}
          >
            {ONBOARDING_SLIDES.map((slide) => (
              <Image
                key={slide.id}
                source={slide.image}
                style={{ width, height: '100%' }}
                resizeMode="cover"
              />
            ))}
          </Animated.View>
        </View>

        {/* BOTTOM CONTENT */}
        <View
          style={{
            flex: 1,
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.xl,
          }}
        >
          {/* Dots */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              gap: spacing.sm,
              marginBottom: spacing.xl,
            }}
          >
            {ONBOARDING_SLIDES.map((_, i) => (
              <View
                key={i}
                style={{
                  height: spacing.sm,
                  width: i === currentIndex ? spacing.xl - 4 : spacing.sm,
                  borderRadius: radius.sm / 2,
                  backgroundColor:
                    i === currentIndex ? colors.dotActive : colors.dotInactive,
                }}
              />
            ))}
          </View>

          {/* Title + Description — FADE */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              alignItems: 'center',
              marginBottom: spacing.xl,
            }}
          >
            <Text
              style={{
                fontSize: typography.displaySize,
                fontWeight: typography.displayWeight,
                color: colors.textPrimary,
                textAlign: 'center',
                marginBottom: spacing.md,
              }}
            >
              {current.title}
            </Text>
            <Text
              style={{
                fontSize: typography.bodySize,
                color: colors.textSecondary,
                textAlign: 'center',
                lineHeight: typography.bodyLineHeight,
              }}
            >
              {current.description}
            </Text>
          </Animated.View>

          {/* Button */}
          <TouchableOpacity
            onPress={current.isLast ? handleGetStarted : handleNext}
            style={{
              backgroundColor: colors.buttonBg,
              borderRadius: radius.md,
              paddingVertical: spacing.md + 2,
              alignItems: 'center',
            }}
            activeOpacity={0.85}
          >
            <Text
              style={{
                color: colors.buttonText,
                fontSize: typography.buttonSize,
                fontWeight: '600',
              }}
            >
              {current.isLast ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
