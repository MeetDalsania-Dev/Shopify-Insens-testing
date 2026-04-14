import { useAuthStore } from '@/src/features/auth/state/auth.store';
import { Slot } from 'expo-router';
import { useEffect } from 'react';

export default function RootLayout() {
  const { hydrate, isHydrated, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, []);

  if (!isHydrated) return null; // or <SplashScreen />

  return <Slot />;
}
