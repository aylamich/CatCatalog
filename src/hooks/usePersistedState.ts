import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { reportError } from '../utils/reportError';

interface PersistedState<T> {
  value: T;
  setValue: Dispatch<SetStateAction<T>>;
  /** True until the value for the current key was read from the device. */
  isHydrating: boolean;
  /** False when nothing was saved yet under this key (e.g. first use on this device). */
  hasSavedValue: boolean;
}

/**
 * State saved in AsyncStorage under `storageKey` (one key per user).
 * - Loads the saved value inside useEffect.
 * - `isHydrating` lets screens show a loader instead of an empty list.
 * - Only saves after loading, so an empty initial value never overwrites saved data.
 * - If reading fails, nothing is written for that key, so data we could not read is not erased.
 * `initialValue` must be a constant (defined outside the component).
 */
export function usePersistedState<T>(storageKey: string | null, initialValue: T): PersistedState<T> {
  const [value, setValue] = useState<T>(initialValue);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [hasSavedValue, setHasSavedValue] = useState(false);
  const readFailedRef = useRef(false);

  useEffect(() => {
    let active = true;
    readFailedRef.current = false;
    if (!storageKey) {
      setValue(initialValue);
      setHasSavedValue(false);
      setLoadedKey(null);
      return;
    }
    AsyncStorage.getItem(storageKey)
      .then((raw) => {
        if (raw === null) return { saved: false, loaded: initialValue };
        try {
          return { saved: true, loaded: JSON.parse(raw) as T };
        } catch (error) {
          // Corrupted data cannot be used, so it may be replaced by new saves.
          reportError(`storage: corrupted ${storageKey}`, error);
          return { saved: false, loaded: initialValue };
        }
      })
      .catch((error: unknown) => {
        reportError(`storage: read ${storageKey}`, error);
        readFailedRef.current = true;
        return { saved: false, loaded: initialValue };
      })
      .then(({ saved, loaded }) => {
        if (!active) return;
        setValue(loaded);
        setHasSavedValue(saved);
        setLoadedKey(storageKey);
      });
    return () => {
      active = false;
    };
  }, [storageKey, initialValue]);

  useEffect(() => {
    if (!storageKey || loadedKey !== storageKey || readFailedRef.current) return;
    // A failed write keeps the value in memory; it is saved again on the next change.
    AsyncStorage.setItem(storageKey, JSON.stringify(value)).catch((error: unknown) =>
      reportError(`storage: write ${storageKey}`, error),
    );
  }, [value, storageKey, loadedKey]);

  return {
    value,
    setValue,
    isHydrating: storageKey !== null && loadedKey !== storageKey,
    hasSavedValue,
  };
}
