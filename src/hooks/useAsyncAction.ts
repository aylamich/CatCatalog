import { useCallback, useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '../services/errorParser';

/** Loading + error state for a button action (used by the login and sign up forms). */
export function useAsyncAction() {
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const run = useCallback(async (action: () => Promise<unknown>) => {
    setIsRunning(true);
    setError(null);
    try {
      await action();
    } catch (actionError) {
      if (mountedRef.current) setError(getErrorMessage(actionError));
    } finally {
      // After a successful login the auth screens unmount, so no state update then.
      if (mountedRef.current) setIsRunning(false);
    }
  }, []);

  return { isRunning, error, setError, run };
}
