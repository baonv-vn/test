import type { EnergyLevel } from './energy';

export type WorkoutExercise = {
  id: string;
  name: string;
  sets: number;
  restSeconds: number;
};

export type WorkoutTemplate = {
  id: string;
  name: string;
  minEnergy: EnergyLevel;
  exercises: WorkoutExercise[];
};
