import { useInsensThemeStore } from '@/src/shared/state/theme.store';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

interface Props {
  onPress?: () => void;
}

export default function QuizBanner({ onPress }: Props) {
  const { theme } = useInsensThemeStore();
  const { colors, radius } = theme;

  return (
    <View style={{
      shadowColor: 'rgba(0,122,255,0.08)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 12,
      elevation: 4,
    }}>
      <View style={{
        backgroundColor: colors.slateBlue,
        borderRadius: radius.md,
        padding: 24,
        overflow: 'hidden',
        gap: 20,
      }}>

        {/* Decorative circles — absolute, bottom-right */}
        <View style={{ position: 'absolute', bottom: -48, right: -24, opacity: 0.12 }}>
          <Svg width={172} height={148} viewBox="0 0 172 148" fill="none">
            <Ellipse cx="132.5" cy={125} rx="132.5" ry={132} fill="white" />
          </Svg>
        </View>
        <View style={{ position: 'absolute', bottom: -32, right: -8, opacity: 0.1 }}>
          <Svg width={143} height={129} viewBox="0 0 143 129" fill="none">
            <Ellipse cx={111} cy={112} rx={111} ry={112} fill="white" />
          </Svg>
        </View>
        <View style={{ position: 'absolute', bottom: -16, right: 8, opacity: 0.08 }}>
          <Svg width={113} height={102} viewBox="0 0 113 102" fill="none">
            <Circle cx={96} cy={96} r={96} fill="white" />
          </Svg>
        </View>
        <View style={{ position: 'absolute', bottom: 0, right: 24, opacity: 0.06 }}>
          <Svg width={82} height={76} viewBox="0 0 82 76" fill="none">
            <Ellipse cx={77} cy="76.5" rx={77} ry="76.5" fill="white" />
          </Svg>
        </View>

        {/* Title */}
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF', lineHeight: 24 }}>
            {'Your Scent, Your Style\nCreate Your Own Perfume'}
          </Text>
        </View>

        {/* Take Quiz Button */}
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.85}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            alignSelf: 'flex-start',
            backgroundColor: '#FFFFFF',
            borderRadius: 8,
            paddingHorizontal: 16,
            paddingVertical: 10,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: '500', color: colors.cardTitle }}>
            Take Quiz
          </Text>
          <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
            <Path
              d="M7.33331 7.33333L3.99998 10.6667M3.99998 10.6667L7.33331 14M3.99998 10.6667H9.20204C9.94732 10.6667 10.3205 10.6667 10.6054 10.5215C10.8563 10.3937 11.0602 10.1893 11.188 9.93839C11.3333 9.65318 11.3333 9.28007 11.3333 8.53333V2"
              stroke="#1C1C1E"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>

      </View>
    </View>
  );
}
