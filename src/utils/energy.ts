import type { EnergyLevel } from '../types/energy';

const energyRank: Record<EnergyLevel, number> = {
  HIGH: 3,
  NORMAL: 2,
  LOW: 1,
  EXHAUSTED: 0,
};

export const isEnergyAllowed = (
  selected: EnergyLevel,
  minimum: EnergyLevel
): boolean => energyRank[selected] >= energyRank[minimum];
