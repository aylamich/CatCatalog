import { createContext, ReactNode, useCallback, useContext, useMemo } from 'react';
import { CloudStatus, useSyncedList } from '../hooks/useSyncedList';
import { metTable } from '../services/cloudSync';
import { MetItem, SavedBreed } from '../types';
import { useAuth } from './AuthContext';

// "Kitties I've met" are the app's "consumed" items: breeds the user met, with a 1-5 rating.
interface MetContextValue {
  metList: MetItem[];
  isHydrating: boolean;
  cloudStatus: CloudStatus;
  getMet: (id: string) => MetItem | undefined;
  /** Marks the breed as met (or updates its rating if it already was). */
  rateKitty: (breed: SavedBreed, rating: number) => void;
  removeMet: (id: string) => void;
}

const NO_KITTIES: MetItem[] = [];

const MetContext = createContext<MetContextValue | undefined>(undefined);

export function MetProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const storageKey = user ? `@catbreeds:met:${user.id}` : null;
  const {
    items: metList,
    setItems: setMetList,
    isHydrating,
    cloudStatus,
    saveToCloud,
    removeFromCloud,
  } = useSyncedList(storageKey, user?.email ?? null, metTable, NO_KITTIES);

  const metById = useMemo(() => new Map(metList.map((item) => [item.id, item])), [metList]);

  const getMet = useCallback((id: string) => metById.get(id), [metById]);

  const rateKitty = useCallback(
    (breed: SavedBreed, rating: number) => {
      const existing = metById.get(breed.id);
      const item: MetItem = existing
        ? { ...existing, rating }
        : { ...breed, rating, metAt: new Date().toISOString() };
      // Checked again on the current list, so a quick double tap never duplicates the kitty.
      setMetList((current) =>
        current.some((met) => met.id === item.id)
          ? current.map((met) => (met.id === item.id ? item : met))
          : [item, ...current],
      );
      saveToCloud(item);
    },
    [metById, setMetList, saveToCloud],
  );

  const removeMet = useCallback(
    (id: string) => {
      setMetList((current) => current.filter((item) => item.id !== id));
      removeFromCloud(id);
    },
    [setMetList, removeFromCloud],
  );

  const value = useMemo(
    () => ({ metList, isHydrating, cloudStatus, getMet, rateKitty, removeMet }),
    [metList, isHydrating, cloudStatus, getMet, rateKitty, removeMet],
  );

  return <MetContext.Provider value={value}>{children}</MetContext.Provider>;
}

export function useMet(): MetContextValue {
  const context = useContext(MetContext);
  if (!context) throw new Error('useMet must be used inside <MetProvider>');
  return context;
}
