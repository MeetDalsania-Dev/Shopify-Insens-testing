import { useInsensThemeStore } from '@/src/shared/state/theme.store';
import { Text, View } from 'react-native';

export default function CommunityTab() {
  const { theme } = useInsensThemeStore();
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.homeBg, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: theme.colors.cardTitle, fontSize: 18, fontWeight: '600' }}>Community</Text>
    </View>
  );
}
