import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { appStorage } from './storage';

type SettingsState = {
  isEditMode: boolean;
  setEditMode: (value: boolean) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      isEditMode: false,
      setEditMode: (value) => set({ isEditMode: value }),
    }),
    {
      name: 'daily-settings-store',
      storage: appStorage,
    }
  )
);
