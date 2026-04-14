import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function EmailIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M14.1667 17.0834H5.83341C3.33341 17.0834 1.66675 15.8334 1.66675 12.9167V7.08335C1.66675 4.16669 3.33341 2.91669 5.83341 2.91669H14.1667C16.6667 2.91669 18.3334 4.16669 18.3334 7.08335V12.9167C18.3334 15.8334 16.6667 17.0834 14.1667 17.0834Z"
        stroke="#4A5A68" strokeWidth="1.25" strokeMiterlimit={10}
        strokeLinecap="round" strokeLinejoin="round"
      />
      <Path
        d="M14.1666 7.5L11.5582 9.58333C10.6999 10.2667 9.29158 10.2667 8.43325 9.58333L5.83325 7.5"
        stroke="#4A5A68" strokeWidth="1.25" strokeMiterlimit={10}
        strokeLinecap="round" strokeLinejoin="round"
      />
    </Svg>
  );
}
