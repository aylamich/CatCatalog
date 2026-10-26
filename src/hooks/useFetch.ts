import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../services/errorParser';

type Fetcher<T> = (signal: AbortSignal) => Promise<T>;

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Generic loading / error / data state for one request.
 * `fetcher` must be memoized (useCallback/useMemo); pass `null` to stay idle.
 * The request is aborted when the screen unmounts or the fetcher changes.
 */
export function useFetch<T>(fetcher: Fetcher<T> | null) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: fetcher !== null,
    error: null,
  });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!fetcher) {
      setState({ data: null, isLoading: false, error: null });
      return;
    }
    const controller = new AbortController();
    setState({ data: null, isLoading: true, error: null });
    fetcher(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ data, isLoading: false, error: null });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setState({ data: null, isLoading: false, error: getErrorMessage(error) });
        }
      });
    return () => controller.abort();
  }, [fetcher, attempt]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  return { ...state, retry };
}
