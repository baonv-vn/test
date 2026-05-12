import { create } from 'zustand';

type EditModeState = {
  isEditMode: boolean;
  toggleEditMode: () => void;
  setEditMode: (enabled: boolean) => void;
};

export const useEditModeStore = create<EditModeState>((set) => ({
  isEditMode: false,
  toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
  setEditMode: (enabled) => set({ isEditMode: enabled }),
}));
