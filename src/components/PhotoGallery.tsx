import { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useFetch } from '../hooks/useFetch';
import { fetchBreedPhotos } from '../services/catApi';
import { colors } from '../theme/colors';
import { CatImage } from './CatImage';
import { LoadingView } from './LoadingView';

interface PhotoGalleryProps {
  breedId: string;
  breedName: string;
}

/**
 * Extra photos of the breed (its own request).
 * While loading it shows a small spinner; on error or with no photos the section is hidden,
 * so a failure here never breaks the rest of the details screen.
 */
export function PhotoGallery({ breedId, breedName }: PhotoGalleryProps) {
  const fetcher = useCallback((signal: AbortSignal) => fetchBreedPhotos(breedId, signal), [breedId]);
  const { data: photos, isLoading, error } = useFetch(fetcher);

  if (isLoading) return <LoadingView compact message="Loading photos..." />;
  if (error || !photos || photos.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.title} accessibilityRole="header">
        More photos
      </Text>
      <FlatList
        horizontal
        data={photos}
        keyExtractor={(photo) => photo.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <CatImage
            uri={item.url}
            style={styles.photo}
            accessibilityLabel={`Photo ${index + 1} of ${photos.length} of ${breedName}`}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 24,
  },
  title: {
    marginBottom: 10,
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  list: {
    gap: 10,
  },
  photo: {
    width: 180,
    height: 140,
    borderRadius: 16,
  },
});
