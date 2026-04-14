import { useInsensThemeStore } from '@/src/shared/state/theme.store';
import React from 'react';
import { Image, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { DailySuggestion } from '../types/home.types';

export default function ProductCard({ brand, name, image, gender, year }: DailySuggestion) {
  const { theme } = useInsensThemeStore();
  const { colors } = theme;

  return (
    <View style={{
      width: 228,
      backgroundColor: colors.cardBg,
      borderRadius: 20,
      padding: 8,
    }}>

      {/* Product Image + Badge */}
      <View>
        <Image
          source={image}
          style={{ width: '100%', height: 158, borderRadius: 14 }}
          resizeMode="cover"
        />
        {/* Fragrance badge */}
        <View style={{
          position: 'absolute',
          top: 8,
          left: 8,
          backgroundColor: 'rgba(255,255,255,0.4)',
          borderRadius: 10,
          padding: 10,
        }}>
          <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
            <Path
              d="M13.1066 8.3335H2.60663V10.8335L4.10663 12.8335L7.10663 14.8335L10.1066 13.8335L13.1066 12.3335V8.3335Z"
              fill="#B3BDC4"
            />
            <Path
              d="M8.4067 1.4735C8.1667 1.28683 7.83338 1.28683 7.59338 1.4735C6.32672 2.44016 2.58671 5.5935 2.60671 9.26683C2.60671 12.2402 5.02671 14.6668 8.00671 14.6668C10.9867 14.6668 13.4067 12.2468 13.4067 9.2735C13.4134 5.6535 9.6667 2.44683 8.4067 1.4735Z"
              stroke="#6D7F8F"
              strokeMiterlimit={10}
            />
          </Svg>
        </View>
      </View>

      {/* Card Content */}
      <View style={{ padding: 8, gap: 12 }}>

        {/* Brand + Name */}
        <View style={{ gap: 4 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: colors.brandText }}>
            {brand}
          </Text>
          <Text style={{ fontSize: 12, color: colors.muted }} numberOfLines={1}>
            {name}
          </Text>
        </View>

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: colors.homeBg }} />

        {/* Gender + Year */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            {/* Currency/gender icon */}
            <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
              <Path
                d="M13 5.99994C13 5.03235 12.7192 4.08556 12.1918 3.27438C11.6643 2.4632 10.9128 1.82248 10.0284 1.42994C9.14406 1.03741 8.16477 0.909907 7.20936 1.06291C6.25395 1.21591 5.36345 1.64284 4.64588 2.29192C3.9283 2.94101 3.41447 3.78435 3.1667 4.71968C2.91894 5.655 2.94788 6.64213 3.25003 7.56133C3.55217 8.48053 4.11453 9.29232 4.86891 9.89824C5.62328 10.5042 6.53726 10.8782 7.5 10.9749V12.4999H5.5C5.36739 12.4999 5.24022 12.5526 5.14645 12.6464C5.05268 12.7402 5 12.8673 5 12.9999C5 13.1325 5.05268 13.2597 5.14645 13.3535C5.24022 13.4473 5.36739 13.4999 5.5 13.4999H7.5V14.9999C7.5 15.1326 7.55268 15.2597 7.64645 15.3535C7.74021 15.4473 7.86739 15.4999 8 15.4999C8.13261 15.4999 8.25979 15.4473 8.35355 15.3535C8.44732 15.2597 8.5 15.1326 8.5 14.9999V13.4999H10.5C10.6326 13.4999 10.7598 13.4473 10.8536 13.3535C10.9473 13.2597 11 13.1325 11 12.9999C11 12.8673 10.9473 12.7402 10.8536 12.6464C10.7598 12.5526 10.6326 12.4999 10.5 12.4999H8.5V10.9749C9.73272 10.8495 10.8751 10.2714 11.7063 9.35248C12.5375 8.43354 12.9985 7.23903 13 5.99994ZM4 5.99994C4 5.20882 4.2346 4.43546 4.67412 3.77766C5.11365 3.11986 5.73836 2.60717 6.46927 2.30442C7.20017 2.00167 8.00444 1.92246 8.78036 2.0768C9.55629 2.23114 10.269 2.6121 10.8284 3.17151C11.3878 3.73092 11.7688 4.44366 11.9231 5.21958C12.0775 5.9955 11.9983 6.79977 11.6955 7.53067C11.3928 8.26158 10.8801 8.88629 10.2223 9.32582C9.56448 9.76534 8.79113 9.99994 8 9.99994C6.93949 9.99878 5.92275 9.57698 5.17285 8.82709C4.42296 8.07719 4.00116 7.06045 4 5.99994Z"
                fill="#6D7F8F"
              />
            </Svg>
            <Text style={{ fontSize: 12, color: colors.muted }}>{gender}</Text>
          </View>
          <Text style={{ fontSize: 12, color: colors.muted }}>{year}</Text>
        </View>

      </View>
    </View>
  );
}
