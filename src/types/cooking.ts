import type { EnergyLevel } from './energy';

export type CookingStep = {
  id: string;
  description: string;
  durationSeconds?: number;
};

export type RecipeTemplate = {
  id: string;
  name: string;
  minEnergy: EnergyLevel;
  steps: CookingStep[];
};
