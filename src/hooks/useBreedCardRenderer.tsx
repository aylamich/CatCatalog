import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { ListRenderItemInfo } from 'react-native';
import { BreedCard } from '../components/BreedCard';
import { useFavorites } from '../contexts/FavoritesContext';
import { AppStackParamList } from '../navigation/types';
import { Breed } from '../types';
import { toSavedBreed } from '../utils/toSavedBreed';

/** `renderItem` shared by the catalog and the search grids: opens the details and toggles the favorite. */
export function useBreedCardRenderer() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { isFavorite, toggleFavorite } = useFavorites();

  return useCallback(
    ({ item }: ListRenderItemInfo<Breed>) => (
      <BreedCard
        name={item.name}
        imageUrl={item.image?.url ?? null}
        isFavorite={isFavorite(item.id)}
        onPress={() => navigation.navigate('BreedDetail', { id: item.id })}
        onToggleFavorite={() => toggleFavorite(toSavedBreed(item))}
      />
    ),
    [isFavorite, toggleFavorite, navigation],
  );
}
