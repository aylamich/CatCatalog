import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useMet } from '../contexts/MetContext';
import { CloudStatus } from '../hooks/useSyncedList';
import { AppScreenProps } from '../navigation/types';
import { colors, MIN_TOUCH_SIZE } from '../theme/colors';

type IconName = ComponentProps<typeof Ionicons>['name'];

interface CounterProps {
  icon: IconName;
  /** Text after the number, in singular and plural ("favorite kitty" / "favorite kitties"). */
  label: [string, string];
  count: number | null;
  onPress: () => void;
}

const CLOUD_MESSAGES: Record<CloudStatus, { icon: IconName; text: string }> = {
  synced: { icon: 'cloud-done-outline', text: 'Synced with the cloud' },
  syncing: { icon: 'cloud-upload-outline', text: 'Syncing with the cloud...' },
  offline: { icon: 'cloud-offline-outline', text: 'Cloud unavailable: saved on this device' },
  disabled: { icon: 'phone-portrait-outline', text: 'Saved on this device' },
};

/** Shows the "worst" status of the two lists, so a problem in either one is visible. */
function combineCloudStatus(a: CloudStatus, b: CloudStatus): CloudStatus {
  const order: CloudStatus[] = ['offline', 'syncing', 'disabled', 'synced'];
  return order.find((status) => status === a || status === b) ?? 'synced';
}

function Counter({ icon, label, count, onPress }: CounterProps) {
  const text = count === null ? `... ${label[1]}` : `${count} ${label[count === 1 ? 0 : 1]}`;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.counter, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${text}. Open list`}
    >
      <Ionicons name={icon} size={24} color={colors.heart} />
      <Text style={styles.counterText}>{text}</Text>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </Pressable>
  );
}

export function ProfileScreen({ navigation }: AppScreenProps<'Profile'>) {
  const { user, logout } = useAuth();
  const { favorites, isHydrating: loadingFavorites, cloudStatus: favoritesCloud } = useFavorites();
  const { metList, isHydrating: loadingMet, cloudStatus: metCloud } = useMet();

  if (!user) return null;

  const cloud = CLOUD_MESSAGES[combineCloudStatus(favoritesCloud, metCloud)];

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={44} color={colors.heart} />
        </View>
        <Text style={styles.name} accessibilityRole="header">
          {user.username}
        </Text>
        <Text style={styles.detail}>{user.email}</Text>
        <Text style={styles.detail}>Member since {memberSince}</Text>
      </View>

      <Counter
        icon="heart"
        label={['favorite kitty', 'favorite kitties']}
        count={loadingFavorites ? null : favorites.length}
        onPress={() => navigation.navigate('Favorites')}
      />
      <Counter
        icon="paw"
        label={['kitty met', 'kitties met']}
        count={loadingMet ? null : metList.length}
        onPress={() => navigation.navigate('Met')}
      />

      <View style={styles.cloud} accessible accessibilityLabel={cloud.text}>
        <Ionicons name={cloud.icon} size={22} color={colors.textMuted} />
        <Text style={styles.cloudText}>{cloud.text}</Text>
      </View>

      <PrimaryButton label="Log out" icon="log-out-outline" variant="outline" onPress={logout} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 12,
  },
  card: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.placeholder,
  },
  name: {
    marginTop: 10,
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
  },
  detail: {
    color: colors.textMuted,
    fontSize: 15,
  },
  counter: {
    minHeight: MIN_TOUCH_SIZE + 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.85,
  },
  cloud: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  cloudText: {
    flexShrink: 1,
    color: colors.textMuted,
    fontSize: 15,
  },
  counterText: {
    flex: 1,
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
});
