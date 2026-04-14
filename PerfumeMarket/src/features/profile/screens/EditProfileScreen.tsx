import { useAuthStore } from '@/src/features/auth/state/auth.store';
import { useInsensThemeStore } from '@/src/shared/state/theme.store';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

// ── Icons ─────────────────────────────────────────────────────────────────────

function BackArrow({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
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

function BellIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 17.8476C17.6392 17.8476 20.2481 17.1242 20.5 14.2205C20.5 11.3188 18.6812 11.5054 18.6812 7.94511C18.6812 5.16414 16.0452 2 12 2C7.95477 2 5.31885 5.16414 5.31885 7.94511C5.31885 11.5054 3.5 11.3188 3.5 14.2205C3.75295 17.1352 6.36177 17.8476 12 17.8476Z"
        stroke="#1C1C1E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14.3889 20.8572C13.0247 22.3719 10.8967 22.3899 9.51953 20.8572"
        stroke="#1C1C1E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CameraIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PersonIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
        stroke="#6D7F8F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22"
        stroke="#6D7F8F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function EnvelopeIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 20.5H7C4 20.5 2 19 2 15.5V8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5Z"
        stroke="#6D7F8F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17 9L13.87 11.5C12.84 12.32 11.15 12.32 10.12 11.5L7 9"
        stroke="#6D7F8F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function LockIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 10V8C6 4.69 7 2 12 2C17 2 18 4.69 18 8V10"
        stroke="#6D7F8F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17 22H7C3 22 2 21 2 17V15C2 11 3 10 7 10H17C21 10 22 11 22 15V17C22 21 21 22 17 22Z"
        stroke="#6D7F8F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.9965 16H16.0054"
        stroke="#6D7F8F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11.9945 16H12.0035"
        stroke="#6D7F8F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7.99451 16H8.00349"
        stroke="#6D7F8F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function EyeOffIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14.53 9.47L9.47 14.53C8.82 13.88 8.42 12.99 8.42 12C8.42 10.02 10.02 8.42 12 8.42C12.99 8.42 13.88 8.82 14.53 9.47Z"
        stroke="#6D7F8F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17.82 5.77C16.07 4.45 14.07 3.73 12 3.73C8.47 3.73 5.18 5.81 2.89 9.41C1.99 10.82 1.99 13.19 2.89 14.6C3.68 15.84 4.6 16.91 5.6 17.77"
        stroke="#6D7F8F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.42 19.53C9.56 20.01 10.77 20.27 12 20.27C15.53 20.27 18.82 18.19 21.11 14.59C22.01 13.18 22.01 10.81 21.11 9.4C20.78 8.88 20.42 8.39 20.05 7.94"
        stroke="#6D7F8F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.51 12.7C15.25 14.11 14.1 15.26 12.69 15.52"
        stroke="#6D7F8F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.47 14.53L2 22"
        stroke="#6D7F8F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 2L14.53 9.47"
        stroke="#6D7F8F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ── EditProfileScreen ─────────────────────────────────────────────────────────

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useInsensThemeStore();
  const { colors, spacing } = theme;
  const { user } = useAuthStore();

  const [name, setName] = useState(user?.fullName ?? user?.username ?? '');
  const [email, setEmail] = useState(user?.email ?? '');

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.homeBg} />
      <View style={{ flex: 1, backgroundColor: colors.homeBg }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >

          {/* ── Header ── */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
          }}>
            <BackArrow onPress={() => router.back()} />
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.cardTitle }}>
              Edit Profile
            </Text>
            <TouchableOpacity>
              <BellIcon />
            </TouchableOpacity>
          </View>

          {/* ── Avatar ── */}
          <View style={{ alignItems: 'center', marginTop: 16, marginBottom: 40 }}>
            <View style={{ position: 'relative' }}>
              <Image
                source={require('@/assets/images/onboarding/slide1.jpg')}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  borderWidth: 4,
                  borderColor: colors.cardBg,
                }}
              />
              {/* Camera overlay */}
              <View style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 36,
                backgroundColor: 'rgba(0,0,0,0.45)',
                borderBottomLeftRadius: 50,
                borderBottomRightRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <CameraIcon />
              </View>
            </View>
          </View>

          {/* ── Form Fields ── */}
          <View style={{ paddingHorizontal: spacing.lg, gap: 20 }}>

            {/* Full Name */}
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.cardTitle }}>
                Full Name
              </Text>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                height: 52,
                backgroundColor: '#F8F9FA',
                borderRadius: 12,
                paddingHorizontal: 16,
              }}>
                <PersonIcon />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Your full name"
                  placeholderTextColor={colors.lightGray}
                  style={{ flex: 1, fontSize: 14, color: colors.cardTitle }}
                />
              </View>
            </View>

            {/* Email */}
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.cardTitle }}>
                Email Address
              </Text>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                height: 52,
                backgroundColor: colors.cardBg,
                borderRadius: 12,
                paddingHorizontal: 16,
                borderWidth: 1.5,
                borderColor: colors.slateBlue,
              }}>
                <EnvelopeIcon />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Your email"
                  placeholderTextColor={colors.lightGray}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{ flex: 1, fontSize: 14, color: colors.cardTitle }}
                />
              </View>
            </View>

            {/* Password */}
            <View style={{ gap: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.cardTitle }}>
                  Password
                </Text>
                <TouchableOpacity>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: colors.slateBlue }}>
                    Change
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                height: 52,
                backgroundColor: colors.cardBg,
                borderRadius: 12,
                paddingHorizontal: 16,
              }}>
                <LockIcon />
                {/* Password dots */}
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  {Array.from({ length: 7 }).map((_, i) => (
                    <View
                      key={i}
                      style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.cardTitle }}
                    />
                  ))}
                </View>
                <TouchableOpacity>
                  <EyeOffIcon />
                </TouchableOpacity>
              </View>
            </View>

          </View>

          {/* ── Save Changes ── */}
          <View style={{ paddingHorizontal: spacing.lg, marginTop: 40 }}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={{
                height: 56,
                borderRadius: 16,
                backgroundColor: colors.slateBlue,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: colors.slateBlue,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF' }}>
                Save Changes
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </View>
    </>
  );
}
