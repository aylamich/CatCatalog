import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { CatImage } from '../components/CatImage';
import { EmptyState } from '../components/EmptyState';
import { LoadingView } from '../components/LoadingView';
import { PawRating } from '../components/PawRating';
import { useMet } from '../contexts/MetContext';
import { AppScreenProps } from '../navigation/types';
import { colors } from '../theme/colors';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** The app's "consumed items": every breed the user met, with its 1-5 paw rating. */
export function MetScreen({ navigation }: AppScreenProps<'Met'>) {
  const { metList, isHydrating } = useMet();

  if (isHydrating) return <LoadingView message="Loading the kitties you met..." />;

  return (
    <FlatList
      data={metList}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => navigation.navigate('BreedDetail', { id: item.id })}
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={`${item.name}, rated ${item.rating} of 5 paws, met on ${formatDate(item.metAt)}. Open details`}
        >
          <CatImage uri={item.imageUrl} accessibilityLabel={`Photo of a ${item.name} cat`} style={styles.photo} iconSize={28} />
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <PawRating rating={item.rating} size={20} />
            <Text style={styles.date}>Met on {formatDate(item.metAt)}</Text>
          </View>
        </Pressable>
      )}
      ListEmptyComponent={
        <EmptyState
          icon="paw-outline"
          title="You haven't met any kitty yet"
          message={'Open a kitty and tap "I\'ve met this kitty!" to rate it.'}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 12,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.85,
  },
  photo: {
    width: 76,
    height: 76,
    borderRadius: 16,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  date: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
