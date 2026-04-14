import { useAuthStore } from '@/src/features/auth/state/auth.store';
import { useInsensThemeStore } from '@/src/shared/state/theme.store';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

// ── Icons ─────────────────────────────────────────────────────────────────────

function MenuIcon({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path d="M3 7H21" stroke="#1C1C1E" strokeWidth="1.5" strokeLinecap="round" />
        <Path d="M3 12H21" stroke="#1C1C1E" strokeWidth="1.5" strokeLinecap="round" />
        <Path d="M3 17H21" stroke="#1C1C1E" strokeWidth="1.5" strokeLinecap="round" />
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

function ChevronRight({ color = '#1C1C1E' }: { color?: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18L15 12L9 6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function EditIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16.04 3.02001L8.16 10.9C7.86 11.2 7.56 11.79 7.5 12.22L7.07 15.23C6.91 16.32 7.68 17.08 8.77 16.93L11.78 16.5C12.2 16.44 12.79 16.14 13.1 15.84L20.98 7.96001C22.34 6.60001 22.98 5.02001 20.98 3.02001C18.98 1.02001 17.4 1.66001 16.04 3.02001Z"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ── Drawer menu icons ─────────────────────────────────────────────────────────

function DrawerProfileIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
        stroke="#5A6E7F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22"
        stroke="#5A6E7F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function DrawerOrderIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"
        stroke="#5A6E7F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"
        stroke="#5A6E7F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M1 1H5L7.68 14.39C7.77 14.83 8.05 15.21 8.43 15.47C8.81 15.72 9.27 15.82 9.72 15.75L19.64 14.22C20.08 14.15 20.46 13.91 20.72 13.55C20.98 13.19 21.09 12.75 21.02 12.31L19.37 4H6"
        stroke="#5A6E7F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function DrawerHeartIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21.652C11.59 21.652 11.19 21.542 10.84 21.332C9.40001 20.452 6.18 18.372 4.04 15.602C2.25 13.282 1.82 10.652 2.85 8.34198C3.7 6.44198 5.48 5.13198 7.55 4.90198C9.33 4.70198 11.08 5.36198 12 6.54198C12.92 5.36198 14.67 4.69198 16.45 4.90198C18.52 5.13198 20.3 6.44198 21.15 8.34198C22.18 10.652 21.74 13.282 19.96 15.602C17.82 18.372 14.6 20.452 13.16 21.332C12.81 21.542 12.41 21.652 12 21.652Z"
        stroke="#5A6E7F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function DrawerSettingsIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
        stroke="#5A6E7F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2 12.88V11.12C2 10.08 2.85 9.22 3.9 9.22C5.71 9.22 6.45 7.94 5.54 6.37C5.02 5.47 5.33 4.3 6.24 3.78L7.97 2.79C8.76 2.32 9.78 2.6 10.25 3.39L10.36 3.58C11.26 5.15 12.74 5.15 13.65 3.58L13.76 3.39C14.23 2.6 15.25 2.32 16.04 2.79L17.77 3.78C18.68 4.3 18.99 5.47 18.47 6.37C17.56 7.94 18.3 9.22 20.11 9.22C21.15 9.22 22.01 10.07 22.01 11.12V12.88C22.01 13.92 21.16 14.78 20.11 14.78C18.3 14.78 17.56 16.06 18.47 17.63C18.99 18.54 18.68 19.7 17.77 20.22L16.04 21.21C15.25 21.68 14.23 21.4 13.76 20.61L13.65 20.42C12.75 18.85 11.27 18.85 10.36 20.42L10.25 20.61C9.78 21.4 8.76 21.68 7.97 21.21L6.24 20.22C5.33 19.7 5.02 18.53 5.54 17.63C6.45 16.06 5.71 14.78 3.9 14.78C2.85 14.78 2 13.92 2 12.88Z"
        stroke="#5A6E7F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function DrawerLogoutIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8.90002 7.55999C9.21002 3.95999 11.06 2.48999 15.11 2.48999H15.24C19.71 2.48999 21.5 4.27999 21.5 8.74999V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.24002 20.08 8.91002 16.54"
        stroke="#FF4747"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15 12H3.62"
        stroke="#FF4747"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5.85 8.6499L2.5 11.9999L5.85 15.3499"
        stroke="#FF4747"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ── Profile Row Item ──────────────────────────────────────────────────────────

function ProfileRow({
  icon,
  label,
  value,
  onPress,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
}) {
  const { theme } = useInsensThemeStore();
  const { colors } = theme;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: colors.cardBg,
        borderRadius: 12,
      }}
    >
      <View style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: colors.homeBg,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: danger ? '#FF4747' : colors.cardTitle }}>
          {label}
        </Text>
        {value ? (
          <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>{value}</Text>
        ) : null}
      </View>
      <ChevronRight color={danger ? '#FF4747' : colors.muted} />
    </TouchableOpacity>
  );
}

// ── Side Drawer ───────────────────────────────────────────────────────────────

function SideDrawer({
  visible,
  onClose,
  user,
}: {
  visible: boolean;
  onClose: () => void;
  user: { fullName?: string | null; username?: string; email?: string } | null;
}) {
  const { theme } = useInsensThemeStore();
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const displayName = user?.fullName ?? user?.username ?? 'User';
  const email = user?.email ?? '';

  const drawerItems = [
    { label: 'My Profile', icon: <DrawerProfileIcon />, route: '/edit-profile' },
    { label: 'My Orders', icon: <DrawerOrderIcon />, route: null },
    { label: 'Liked Perfumes', icon: <DrawerHeartIcon />, route: '/liked' },
    { label: 'Settings', icon: <DrawerSettingsIcon />, route: null },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {/* Drawer panel */}
        <View style={{
          width: 245,
          backgroundColor: colors.cardBg,
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: 20,
          shadowColor: '#000',
          shadowOffset: { width: 8, height: 0 },
          shadowOpacity: 0.12,
          shadowRadius: 24,
          elevation: 24,
        }}>

          {/* Avatar + info */}
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <Image
              source={require('@/assets/images/onboarding/slide1.jpg')}
              style={{
                width: 90,
                height: 90,
                borderRadius: 45,
                borderWidth: 3,
                borderColor: colors.slateBlue,
              }}
            />
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.cardTitle, marginTop: 12 }}>
              {displayName}
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
              {email}
            </Text>
          </View>

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: colors.homeBg, marginBottom: 24 }} />

          {/* Menu items */}
          <View style={{ gap: 4 }}>
            {drawerItems.map((item) => (
              <TouchableOpacity
                key={item.label}
                onPress={() => {
                  onClose();
                  if (item.route) router.push(item.route as any);
                }}
                activeOpacity={0.75}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                  paddingVertical: 14,
                  paddingHorizontal: 12,
                  borderRadius: 10,
                }}
              >
                {item.icon}
                <Text style={{ fontSize: 14, fontWeight: '500', color: colors.cardTitle }}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout at bottom */}
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <View style={{ height: 1, backgroundColor: colors.homeBg, marginBottom: 16 }} />
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.75}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                paddingVertical: 14,
                paddingHorizontal: 12,
                borderRadius: 10,
              }}
            >
              <DrawerLogoutIcon />
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#FF4747' }}>
                Log Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Backdrop */}
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' }}
          onPress={onClose}
        />
      </View>
    </Modal>
  );
}

// ── ProfileScreen ─────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme } = useInsensThemeStore();
  const { colors, spacing } = theme;
  const { user } = useAuthStore();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const displayName = user?.fullName ?? user?.username ?? 'User';
  const email = user?.email ?? '';

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
            <MenuIcon onPress={() => setDrawerOpen(true)} />
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.cardTitle }}>
              My Profile
            </Text>
            <TouchableOpacity>
              <BellIcon />
            </TouchableOpacity>
          </View>

          {/* ── Avatar Card ── */}
          <View style={{
            alignItems: 'center',
            paddingVertical: 32,
            marginHorizontal: spacing.lg,
            backgroundColor: colors.cardBg,
            borderRadius: 20,
            marginBottom: 24,
          }}>
            <View style={{ position: 'relative' }}>
              <Image
                source={require('@/assets/images/onboarding/slide1.jpg')}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 45,
                  borderWidth: 3,
                  borderColor: colors.slateBlue,
                }}
              />
              {/* Edit badge */}
              <TouchableOpacity
                onPress={() => router.push('/edit-profile')}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: colors.slateBlue,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: colors.cardBg,
                }}
              >
                <EditIcon />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.cardTitle, marginTop: 16 }}>
              {displayName}
            </Text>
            <Text style={{ fontSize: 13, color: colors.muted, marginTop: 4 }}>
              {email}
            </Text>

            {/* Stats row */}
            <View style={{
              flexDirection: 'row',
              gap: 32,
              marginTop: 24,
              paddingTop: 20,
              borderTopWidth: 1,
              borderTopColor: colors.homeBg,
              width: '80%',
              justifyContent: 'center',
            }}>
              {[
                { label: 'Orders', value: '12' },
                { label: 'Liked', value: '8' },
                { label: 'Reviews', value: '5' },
              ].map((stat) => (
                <View key={stat.label} style={{ alignItems: 'center', gap: 4 }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: colors.cardTitle }}>
                    {stat.value}
                  </Text>
                  <Text style={{ fontSize: 11, color: colors.muted }}>
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* ── Menu Rows ── */}
          <View style={{ paddingHorizontal: spacing.lg, gap: 10 }}>

            <ProfileRow
              icon={<DrawerProfileIcon />}
              label="Edit Profile"
              value="Update your info"
              onPress={() => router.push('/edit-profile')}
            />

            <ProfileRow
              icon={<DrawerOrderIcon />}
              label="My Orders"
              value="Track your purchases"
            />

            <ProfileRow
              icon={<DrawerHeartIcon />}
              label="Liked Perfumes"
              value="Your favourites"
              onPress={() => router.push('/liked')}
            />

            <ProfileRow
              icon={<DrawerSettingsIcon />}
              label="Settings"
              value="Preferences & notifications"
            />

            <ProfileRow
              icon={<DrawerLogoutIcon />}
              label="Log Out"
              danger
            />

          </View>

        </ScrollView>
      </View>

      {/* ── Side Drawer ── */}
      <SideDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={user}
      />
    </>
  );
}
