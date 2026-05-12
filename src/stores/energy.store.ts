import { create } from 'zustand';
import type { EnergyLevel } from '../types/energy';

type EnergyState = {
  energy: EnergyLevel | null;
  setEnergy: (energy: EnergyLevel) => void;
  clearEnergy: () => void;
};

export const useEnergyStore = create<EnergyState>((set) => ({
  energy: null,
  setEnergy: (energy) => set({ energy }),
  clearEnergy: () => set({ energy: null }),
}));
