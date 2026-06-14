import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppUser } from '../lib/types';

interface AppStore {
  user: AppUser | null;
  theme: 'dark' | 'light';
  login: (name: string) => void;
  logout: () => void;
  toggleTheme: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      user: null,
      theme: 'dark',

      login: (name) => set({ user: { name } }),
      logout: () => set({ user: null }),
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
    }),
    {
      name: 'sat-app-store',
    }
  )
);
