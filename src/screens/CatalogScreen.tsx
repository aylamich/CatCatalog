import { ReactElement, useLayoutEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { ErrorView } from '../components/ErrorView';
import { HeaderIconButton } from '../components/HeaderIconButton';
import { LoadingView } from '../components/LoadingView';
import { useBreedCardRenderer } from '../hooks/useBreedCardRenderer';
import { useBreedCatalog } from '../hooks/useBreedCatalog';
import { AppScreenProps } from '../navigation/types';
import { colors } from '../theme/colors';

export function CatalogScreen({ navigation }: AppScreenProps<'Catalog'>) {
  const {
    breeds,
    hasMore,
    isLoading,
    isRefreshing,
    isLoadingMore,
    error,
    loadMoreError,
    loadMore,
    retryLoadMore,
    refresh,
    retry,
  } = useBreedCatalog();
  const renderItem = useBreedCardRenderer();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <HeaderIconButton icon="search" label="Search breeds" onPress={() => navigation.navigate('Search')} />
          <HeaderIconButton icon="heart" label="Favorite kitties" onPress={() => navigation.navigate('Favorites')} />
          <HeaderIconButton
            icon="person-circle-outline"
            label="My profile"
            onPress={() => navigation.navigate('Profile')}
          />
        </View>
      ),
    });
  }, [navigation]);

  if (isLoading && breeds.length === 0) return <LoadingView message="Loading the catalog..." />;
  if (error && breeds.length === 0) return <ErrorView message={error} onRetry={retry} />;

  let footer: ReactElement | undefined;
  if (isLoadingMore) {
    footer = <LoadingView compact message="Loading more kitties..." />;
  } else if (loadMoreError) {
    // The next page failed: keep the list and offer a retry at the bottom.
    footer = <ErrorView compact message={loadMoreError} onRetry={retryLoadMore} />;
  } else if (!hasMore && breeds.length > 0) {
    footer = <Text style={styles.endText}>That's every breed in the catalog 🐾</Text>;
  }

  return (
    <FlatList
      data={breeds}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      numColumns={2}
      contentContainerStyle={styles.list}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      refreshing={isRefreshing}
      onRefresh={refresh}
      // A failed refresh keeps the old list and shows the error on top.
      ListHeaderComponent={error ? <ErrorView compact message={error} onRetry={retry} /> : undefined}
      ListFooterComponent={footer}
      ListEmptyComponent={<EmptyState icon="paw-outline" title="No kitties here yet 🐾" />}
    />
  );
}

const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: 'row',
  },
  list: {
    padding: 6,
    paddingBottom: 24,
  },
  endText: {
    paddingVertical: 20,
    color: colors.textMuted,
    fontSize: 15,
    textAlign: 'center',
  },
});
