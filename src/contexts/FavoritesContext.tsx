import { createContext, ReactNode, useCallback, useContext, useMemo } from 'react';
import { CloudStatus, useSyncedList } from '../hooks/useSyncedList';
import { favoritesTable } from '../services/cloudSync';
import { SavedBreed } from '../types';
import { useAuth } from './AuthContext';

interface FavoritesContextValue {
  favorites: SavedBreed[];
  /** True while the saved favorites are being read from the device. */
  isHydrating: boolean;
  cloudStatus: CloudStatus;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (breed: SavedBreed) => void;
}

const NO_FAVORITES: SavedBreed[] = [];

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  // One key per user, so each account has its own favorites.
  const storageKey = user ? `@catbreeds:favorites:${user.id}` : null;
  const {
    items: favorites,
    setItems: setFavorites,
    isHydrating,
    cloudStatus,
    saveToCloud,
    removeFromCloud,
  } = useSyncedList(storageKey, user?.email ?? null, favoritesTable, NO_FAVORITES);

  const favoriteIds = useMemo(() => new Set(favorites.map((item) => item.id)), [favorites]);

  const isFavorite = useCallback((id: string) => favoriteIds.has(id), [favoriteIds]);

  const toggleFavorite = useCallback(
    (breed: SavedBreed) => {
      if (favoriteIds.has(breed.id)) {
        setFavorites((current) => current.filter((item) => item.id !== breed.id));
        removeFromCloud(breed.id);
      } else {
        // Checked again here, so a quick double tap never adds the same breed twice.
        setFavorites((current) => (current.some((item) => item.id === breed.id) ? current : [...current, breed]));
        saveToCloud(breed);
      }
    },
    [favoriteIds, setFavorites, saveToCloud, removeFromCloud],
  );

  const value = useMemo(
    () => ({ favorites, isHydrating, cloudStatus, isFavorite, toggleFavorite }),
    [favorites, isHydrating, cloudStatus, isFavorite, toggleFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used inside <FavoritesProvider>');
  return context;
}
