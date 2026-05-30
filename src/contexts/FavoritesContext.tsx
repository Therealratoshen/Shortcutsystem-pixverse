import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { FavoriteVideo } from '../types';

interface FavoritesContextType {
  favorites: FavoriteVideo[];
  addFavorite: (video: FavoriteVideo) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (videoId: string) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteVideo[]>([]);

  const addFavorite = useCallback((video: FavoriteVideo) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.videoId === video.videoId)) {
        return prev;
      }
      return [video, ...prev];
    });
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const isFavorite = useCallback(
    (videoId: string) => {
      return favorites.some((f) => f.videoId === videoId);
    },
    [favorites]
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
