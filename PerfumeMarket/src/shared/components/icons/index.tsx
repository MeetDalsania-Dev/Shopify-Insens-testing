import * as React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const EmailIcon = ({ size = 20, color = '#4A5A68' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="4" width="20" height="16" rx="3" stroke={color} strokeWidth="1.5" />
    <Path d="M2 8l10 6 10-6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

export const LockIcon = ({ size = 20, color = '#4A5A68' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="5" y="11" width="14" height="11" rx="2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M8 11V7a4 4 0 018 0v4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="16" r="1.5" fill={color} />
  </Svg>
);

export const EyeOffIcon = ({ size = 20, color = '#6D7F8F' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 3l18 18M10.5 10.677A3 3 0 0013.323 13.5M6.362 6.368C4.153 7.78 2.5 9.91 2.5 12c0 1.5 1.5 4 4 5.5 1.3.782 2.78 1.3 4.5 1.43M9.5 4.62C10.29 4.38 11.13 4.25 12 4.25c5 0 9.5 5 9.5 7.75 0 1.18-.7 2.62-1.87 3.85" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

export const EyeIcon = ({ size = 20, color = '#6D7F8F' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M2.5 12C2.5 12 5.5 5.5 12 5.5S21.5 12 21.5 12 18.5 18.5 12 18.5 2.5 12 2.5 12z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" />
  </Svg>
);

export const GoogleIcon = ({ size = 22 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21.8 12.04c0-.638-.057-1.252-.163-1.84H12v3.48h5.518a4.71 4.71 0 01-2.045 3.09v2.568h3.312c1.937-1.784 3.055-4.41 3.055-7.298z" fill="#4285F4" />
    <Path d="M12 22c2.77 0 5.1-.918 6.785-2.488l-3.312-2.568c-.92.616-2.094.98-3.473.98-2.67 0-4.93-1.803-5.736-4.228H2.845v2.65A10 10 0 0012 22z" fill="#34A853" />
    <Path d="M6.264 13.696A6.013 6.013 0 016 12c0-.59.08-1.163.264-1.696V7.654H2.845A10.007 10.007 0 002 12c0 1.614.387 3.14 1.07 4.496l3.194-2.8z" fill="#FBBC05" />
    <Path d="M12 5.772c1.504 0 2.853.517 3.914 1.53l2.937-2.937C17.096 2.891 14.766 2 12 2A10 10 0 002.845 7.654l3.419 2.65C7.07 7.575 9.33 5.772 12 5.772z" fill="#EA4335" />
  </Svg>
);

export const AppleIcon = ({ size = 22, color = '#000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.37.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.39-1.32 2.76-2.53 3.99zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </Svg>
);
