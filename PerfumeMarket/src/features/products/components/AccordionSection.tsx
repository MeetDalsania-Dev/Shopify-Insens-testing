import { useInsensThemeStore } from '@/src/shared/state/theme.store';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

function MinusIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M6 12H18" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function PlusIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M6 12H18" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 18V6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

interface Props {
  title: string;
  subtitle?: string;
  initiallyOpen?: boolean;
  children?: React.ReactNode;
}

export default function AccordionSection({
  title,
  subtitle,
  initiallyOpen = false,
  children,
}: Props) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const { theme } = useInsensThemeStore();
  const { colors } = theme;

  return (
    <View style={{
      backgroundColor: colors.cardBg,
      borderRadius: 12,
      padding: 16,
      gap: 16,
    }}>
      <View style={{ gap: 4 }}>
        <TouchableOpacity
          onPress={() => setIsOpen(!isOpen)}
          activeOpacity={0.7}
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.cardTitle }}>
            {title}
          </Text>
          {isOpen
            ? <MinusIcon color={colors.slateBlue} />
            : <PlusIcon color={colors.slateBlue} />}
        </TouchableOpacity>
        {isOpen && subtitle ? (
          <Text style={{ fontSize: 12, color: colors.muted, textAlign: 'center' }}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {isOpen && children ? (
        <View>{children}</View>
      ) : null}
    </View>
  );
}
