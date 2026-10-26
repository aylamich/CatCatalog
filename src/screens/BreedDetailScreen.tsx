import { useCallback, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CatImage } from '../components/CatImage';
import { ErrorView } from '../components/ErrorView';
import { LoadingView } from '../components/LoadingView';
import { PawRating } from '../components/PawRating';
import { PhotoGallery } from '../components/PhotoGallery';
import { ToggleButton } from '../components/ToggleButton';
import { TraitChip } from '../components/TraitChip';
import { useFavorites } from '../contexts/FavoritesContext';
import { useMet } from '../contexts/MetContext';
import { useFetch } from '../hooks/useFetch';
import { AppScreenProps } from '../navigation/types';
import { fetchBreed } from '../services/catApi';
import { colors } from '../theme/colors';
import { stripHtml } from '../utils/stripHtml';
import { toSavedBreed } from '../utils/toSavedBreed';

const DEFAULT_RATING = 3;

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fact} accessible accessibilityLabel={`${label}: ${value}`}>
      <Text style={styles.factValue}>{value}</Text>
      <Text style={styles.factLabel}>{label}</Text>
    </View>
  );
}

function Section({ title, text }: { title: string; text: string }) {
  if (!text) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.body}>{text}</Text>
    </View>
  );
}

export function BreedDetailScreen({ route, navigation }: AppScreenProps<'BreedDetail'>) {
  const { id } = route.params;
  // Second request: full data of the breed, by id.
  const fetcher = useCallback((signal: AbortSignal) => fetchBreed(id, signal), [id]);
  const { data: breed, isLoading, error, retry } = useFetch(fetcher);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { getMet, rateKitty, removeMet } = useMet();

  useEffect(() => {
    if (breed) navigation.setOptions({ title: breed.name });
  }, [breed, navigation]);

  if (isLoading) return <LoadingView message="Calling the kitty..." />;
  if (error || !breed) return <ErrorView message={error ?? 'Kitty not found.'} onRetry={retry} />;

  const saved = toSavedBreed(breed);
  const favorite = isFavorite(breed.id);
  const met = getMet(breed.id);
  const traits = stripHtml(breed.temperament)
    .split(',')
    .map((trait) => trait.trim())
    .filter(Boolean);
  const altNames = stripHtml(breed.alt_names);
  const origin = stripHtml(breed.origin);
  const group = stripHtml(breed.breed_group);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <CatImage uri={breed.image?.url} accessibilityLabel={`Photo of a ${breed.name} cat`} style={styles.photo} iconSize={72} />

      <Text style={styles.name} accessibilityRole="header">
        {breed.name}
      </Text>
      {altNames ? <Text style={styles.subtitle}>Also known as {altNames}</Text> : null}
      <View style={styles.tags}>
        {origin ? <Text style={styles.tag}>📍 {origin}</Text> : null}
        {group ? <Text style={styles.tag}>🧶 {group}</Text> : null}
      </View>

      {traits.length > 0 ? (
        <View style={styles.traits} accessible accessibilityLabel={`Personality: ${traits.join(', ')}`}>
          {traits.map((trait, index) => (
            <TraitChip key={trait} label={trait} index={index} />
          ))}
        </View>
      ) : null}

      <View style={styles.facts}>
        <Fact label="Weight (kg)" value={stripHtml(breed.weight.metric)} />
        <Fact label="Height (cm)" value={stripHtml(breed.height.metric)} />
        <Fact label="Life span (years)" value={stripHtml(breed.life_span)} />
      </View>

      <View style={styles.actions}>
        <ToggleButton
          selected={favorite}
          onPress={() => toggleFavorite(saved)}
          label="Favorite"
          selectedLabel="Favorited"
          icon="heart-outline"
          selectedIcon="heart"
          accessibilityLabel={favorite ? `Remove ${breed.name} from favorites` : `Add ${breed.name} to favorites`}
        />
        <ToggleButton
          selected={Boolean(met)}
          onPress={() => (met ? removeMet(breed.id) : rateKitty(saved, DEFAULT_RATING))}
          label="I've met this kitty!"
          selectedLabel="Kitty met!"
          icon="paw-outline"
          selectedIcon="paw"
          accessibilityLabel={met ? `You met ${breed.name}. Tap to unmark` : `Mark ${breed.name} as a kitty I've met`}
        />
      </View>

      {met ? (
        <View style={styles.rating}>
          <Text style={styles.ratingLabel}>How much did you love this kitty?</Text>
          <PawRating rating={met.rating} onRate={(rating) => rateKitty(saved, rating)} size={32} />
        </View>
      ) : null}

      <Section title="About" text={stripHtml(breed.description)} />
      <Section title="History" text={stripHtml(breed.history)} />

      <PhotoGallery breedId={breed.id} breedName={breed.name} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  photo: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 24,
  },
  name: {
    marginTop: 16,
    color: colors.text,
    fontSize: 30,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 2,
    color: colors.textMuted,
    fontSize: 15,
    fontStyle: 'italic',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  tag: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  traits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  facts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 20,
  },
  fact: {
    flexGrow: 1,
    flexBasis: 90,
    minHeight: 72,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  factValue: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  factLabel: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 20,
  },
  rating: {
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    borderRadius: 18,
    backgroundColor: colors.surface,
  },
  ratingLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    marginBottom: 6,
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  body: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
});
