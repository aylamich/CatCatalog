import { useMemo, useState } from 'react';
import { FlatList, Keyboard, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { ErrorView } from '../components/ErrorView';
import { FilterChip } from '../components/FilterChip';
import { LoadingView } from '../components/LoadingView';
import { PrimaryButton } from '../components/PrimaryButton';
import { useBreedCardRenderer } from '../hooks/useBreedCardRenderer';
import { useFetch } from '../hooks/useFetch';
import { searchBreeds } from '../services/catApi';
import { colors, MIN_TOUCH_SIZE } from '../theme/colors';
import { COAT_TYPES, CoatType, coatType } from '../utils/coatType';

type CoatFilter = CoatType | 'All';

const FILTERS: CoatFilter[] = ['All', ...COAT_TYPES];

export function SearchScreen() {
  const [term, setTerm] = useState('');
  // The API is called only when the user submits, never on each letter.
  const [submittedTerm, setSubmittedTerm] = useState<string | null>(null);
  const [filter, setFilter] = useState<CoatFilter>('All');
  const renderItem = useBreedCardRenderer();

  const fetcher = useMemo(
    () => (submittedTerm ? (signal: AbortSignal) => searchBreeds(submittedTerm, signal) : null),
    [submittedTerm],
  );
  const { data: results, isLoading, error, retry } = useFetch(fetcher);

  const handleSearch = () => {
    const cleanTerm = term.trim();
    if (!cleanTerm) return;
    Keyboard.dismiss();
    if (cleanTerm === submittedTerm) retry();
    else setSubmittedTerm(cleanTerm);
  };

  // The API has no coat filter, so it is applied to the results that arrived.
  const filtered = useMemo(
    () => (results ?? []).filter((breed) => filter === 'All' || coatType(breed.breed_group) === filter),
    [results, filter],
  );

  let content;
  if (!submittedTerm) {
    content = (
      <EmptyState
        icon="search"
        title="Find your kitty"
        message="Type a breed name in English (e.g. persian) and tap Search."
      />
    );
  } else if (isLoading) {
    content = <LoadingView message="Looking for kitties..." />;
  } else if (error) {
    content = <ErrorView message={error} onRetry={retry} />;
  } else {
    const noResults = (results ?? []).length === 0;
    content = (
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          noResults ? undefined : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
              {FILTERS.map((option) => (
                <FilterChip
                  key={option}
                  label={option}
                  selected={filter === option}
                  onPress={() => setFilter(option)}
                />
              ))}
            </ScrollView>
          )
        }
        ListEmptyComponent={
          noResults ? (
            <EmptyState icon="sad-outline" title={`No kitty found for "${submittedTerm}" 😿`} message="Try another breed name." />
          ) : (
            <EmptyState icon="filter-outline" title={`No "${filter}" kitties in these results`} />
          )
        }
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          value={term}
          onChangeText={setTerm}
          onSubmitEditing={handleSearch}
          placeholder="Search a breed (e.g. persian)"
          placeholderTextColor={colors.textMuted}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          accessibilityLabel="Breed name"
        />
        <PrimaryButton label="Search" icon="search" onPress={handleSearch} />
      </View>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 12,
  },
  input: {
    flexGrow: 1,
    flexBasis: 180,
    minHeight: MIN_TOUCH_SIZE + 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 16,
  },
  filters: {
    gap: 8,
    paddingHorizontal: 6,
    paddingBottom: 8,
  },
  list: {
    padding: 6,
    paddingBottom: 24,
  },
});
