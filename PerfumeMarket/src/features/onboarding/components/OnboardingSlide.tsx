// src/features/onboarding/components/OnboardingSlide.tsx
import React from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
import { OnboardingSlide as SlideType } from '../config/onboarding.config';

const { width, height } = Dimensions.get('window');

interface Props {
  slide: SlideType;
  onNext: () => void;
  onGetStarted: () => void;
  currentIndex: number;
  total: number;
}

export default function OnboardingSlide({
  slide,
  onNext,
  onGetStarted,
  currentIndex,
  total,
}: Props) {
  return (
    <View style={{ width, flex: 1, backgroundColor: '#F0EEEC' }}>

      {/* Hero Image - top 60%, rounded bottom corners */}
      <View
        style={{
          width,
          height: height * 0.58,
          borderBottomLeftRadius: 32,
          
          overflow: 'hidden',
        }}
      >
        <Image
          source={slide.image}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </View>

      {/* Bottom content */}
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 28 }}>

        {/* Dots indicator */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          {Array.from({ length: total }).map((_, i) => (
            <View
              key={i}
              style={{
                height: 8,
                width: i === currentIndex ? 28 : 8,
                borderRadius: 4,
                backgroundColor: i === currentIndex ? '#5A6E7F' : '#C8CDD2',
              }}
            />
          ))}
        </View>

        {/* Title */}
        <Text
          style={{
            fontSize: 30,
            fontWeight: '800',
            color: '#1A1A1A',
            textAlign: 'center',
            marginBottom: 16,
          }}
        >
          {slide.title}
        </Text>

        {/* Description */}
        <Text
          style={{
            fontSize: 16,
            color: '#6B7280',
            textAlign: 'center',
            lineHeight: 24,
            marginBottom: 32,
          }}
        >
          {slide.description}
        </Text>

        {/* Button */}
        <TouchableOpacity
          onPress={slide.isLast ? onGetStarted : onNext}
          style={{
            backgroundColor: '#5A6E7F',
            borderRadius: 16,
            paddingVertical: 18,
            alignItems: 'center',
          }}
          activeOpacity={0.85}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
            {slide.isLast ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
