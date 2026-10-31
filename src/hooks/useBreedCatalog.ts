import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchBreeds } from '../services/catApi';
import { getErrorMessage } from '../services/errorParser';
import { Breed } from '../types';

type LoadMode = 'initial' | 'refresh' | 'more';

/**
 * Catalog with real server-side pagination:
 * every page is requested to the API and appended to the list.
 */
export function useBreedCatalog() {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  // Error of the first page or of a refresh.
  const [error, setError] = useState<string | null>(null);
  // Error of a next page: the list already loaded is kept.
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);

  // Current request and next page as refs (not state): they change at once, so an onEndReached
  // that fires before the screen re-renders never starts a second request for the same page.
  const requestRef = useRef<AbortController | null>(null);
  const nextPageRef = useRef(0);

  const loadPage = useCallback(async (page: number, mode: LoadMode) => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;

    // Only one request runs at a time, so only its loading flag is on.
    setIsLoading(mode === 'initial');
    setIsRefreshing(mode === 'refresh');
    setIsLoadingMore(mode === 'more');
    if (mode === 'more') setLoadMoreError(null);
    else setError(null);

    try {
      const result = await fetchBreeds(page, controller.signal);
      if (controller.signal.aborted) return; // replaced by a newer request
      nextPageRef.current = page + 1;
      setBreeds((previous) => {
        if (page === 0) return result.breeds;
        const loadedIds = new Set(previous.map((breed) => breed.id));
        return [...previous, ...result.breeds.filter((breed) => !loadedIds.has(breed.id))];
      });
      setHasMore(result.hasMore);
      if (page === 0) setLoadMoreError(null);
    } catch (requestError) {
      if (controller.signal.aborted) return;
      const message = getErrorMessage(requestError);
      if (mode === 'more') setLoadMoreError(message);
      else setError(message);
    } finally {
      // An aborted request was replaced by a newer one, which owns the loading flags now.
      if (requestRef.current === controller) {
        requestRef.current = null;
        setIsLoading(false);
        setIsRefreshing(false);
        setIsLoadingMore(false);
      }
    }
  }, []);

  useEffect(() => {
    loadPage(0, 'initial');
    return () => requestRef.current?.abort();
  }, [loadPage]);

  const loadMore = useCallback(() => {
    if (requestRef.current || !hasMore || error || loadMoreError) return;
    loadPage(nextPageRef.current, 'more');
  }, [hasMore, error, loadMoreError, loadPage]);

  const retryLoadMore = useCallback(() => {
    if (!requestRef.current) loadPage(nextPageRef.current, 'more');
  }, [loadPage]);

  const refresh = useCallback(() => loadPage(0, 'refresh'), [loadPage]);

  const retry = useCallback(
    () => loadPage(0, breeds.length > 0 ? 'refresh' : 'initial'),
    [breeds.length, loadPage],
  );

  return {
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
  };
}
