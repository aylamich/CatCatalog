import { FlatList, StyleSheet } from 'react-native';
import { BreedCard } from '../components/BreedCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingView } from '../components/LoadingView';
import { useFavorites } from '../contexts/FavoritesContext';
import { AppScreenProps } from '../navigation/types';

export function FavoritesScreen({ navigation }: AppScreenProps<'Favorites'>) {
  // Comes from the Context, so removing a favorite updates this list right away.
  const { favorites, isHydrating, toggleFavorite } = useFavorites();

  if (isHydrating) return <LoadingView message="Loading your favorites..." />;

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <BreedCard
          name={item.name}
          imageUrl={item.imageUrl}
          isFavorite
          onPress={() => navigation.navigate('BreedDetail', { id: item.id })}
          onToggleFavorite={() => toggleFavorite(item)}
        />
      )}
      ListEmptyComponent={
        <EmptyState
          icon="heart-outline"
          title="No favorite kitties yet"
          message="Tap the heart on a kitty to keep it here."
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 6,
    paddingBottom: 24,
  },
});
