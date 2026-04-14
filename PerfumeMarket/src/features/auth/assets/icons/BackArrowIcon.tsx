import React from 'react';
import Svg, { Path } from 'react-native-svg';

// Used on Register (thin) + ForgotPassword (bold)
interface Props {
  strokeWidth?: number;
  color?: string;
}

export default function BackArrowIcon({ strokeWidth = 1.5, color = '#1C1C1E' }: Props) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 12H19"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5 12L9 16"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5 12L9 8"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
