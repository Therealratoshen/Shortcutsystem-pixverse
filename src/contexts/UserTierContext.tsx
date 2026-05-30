import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { UserTier, UserProfile, UserStats } from '../types';

interface UserTierContextType {
  user: UserProfile;
  setUserTier: (tier: UserTier) => void;
  incrementVideosGenerated: () => void;
  decrementVideosRemaining: () => void;
  updateStats: (stats: Partial<UserStats>) => void;
}

const defaultStats: UserStats = {
  videosGenerated: 0,
  videosThisMonth: 0,
  clipsGenerated: 0,
  storageUsed: 0,
};

const defaultUser: UserProfile = {
  tier: 'new',
  name: 'Fashion Seller',
  stats: defaultStats,
  videosRemaining: 5,
  joinedAt: Date.now(),
};

const UserTierContext = createContext<UserTierContextType | undefined>(undefined);

export function UserTierProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(defaultUser);

  const setUserTier = useCallback((tier: UserTier) => {
    setUser((prev) => ({
      ...prev,
      tier,
      videosRemaining: tier === 'pro' ? Infinity : 5,
    }));
  }, []);

  const incrementVideosGenerated = useCallback(() => {
    setUser((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        videosGenerated: prev.stats.videosGenerated + 1,
        videosThisMonth: prev.stats.videosThisMonth + 1,
      },
    }));
  }, []);

  const decrementVideosRemaining = useCallback(() => {
    setUser((prev) => ({
      ...prev,
      videosRemaining: prev.videosRemaining > 0 ? prev.videosRemaining - 1 : 0,
    }));
  }, []);

  const updateStats = useCallback((stats: Partial<UserStats>) => {
    setUser((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        ...stats,
      },
    }));
  }, []);

  return (
    <UserTierContext.Provider
      value={{
        user,
        setUserTier,
        incrementVideosGenerated,
        decrementVideosRemaining,
        updateStats,
      }}
    >
      {children}
    </UserTierContext.Provider>
  );
}

export function useUserTier() {
  const context = useContext(UserTierContext);
  if (context === undefined) {
    throw new Error('useUserTier must be used within a UserTierProvider');
  }
  return context;
}
