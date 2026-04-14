import { useInsensThemeStore } from '@/src/shared/state/theme.store';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Ellipse } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function IntroScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useInsensThemeStore();  // ← Pull theme
  const { colors, spacing, radius, typography } = theme;

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 2500);  // 2.5s splash
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.oudBrown} />
      <View
        style={{
          flex: 1,
          backgroundColor: colors.oudBrown,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        {/* SVG Circles - exact match to design */}
        <Svg
          width={width}
          height={height}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          {/* Large ellipse - top right, partially off screen */}
          <Ellipse
            cx={width * 0.25}
            cy={height * 0.34}
            rx={width * 0.62}
            ry={height * 0.38}
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={1}
            fill="none"
          />
          {/* Medium ellipse - center left, overlapping */}
          <Ellipse
            cx={width * 0.62}
            cy={height * 0.75}
            rx={width * 0.56}
            ry={height * 0.40}
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={1}
            fill="none"
          />
        </Svg>

        {/* INSENS - centered, bold white */}
        <View
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            alignItems: 'center',
            transform: [{ translateY: -28 }],
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 52,
              fontWeight: '700',
              letterSpacing: 1.5,
            }}
          >
            INSENS
          </Text>
        </View>

        
      </View>
    </>
  );
}
