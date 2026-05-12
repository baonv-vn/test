import type { WorkoutTemplate } from '../types/workout';

export const workoutTemplates: WorkoutTemplate[] = [
  {
    id: 'workout-strength',
    name: 'Strength Primer',
    minEnergy: 'HIGH',
    exercises: [
      { id: 'pushups', name: 'Push Ups', sets: 3, restSeconds: 45 },
      { id: 'squats', name: 'Bodyweight Squats', sets: 3, restSeconds: 60 },
      { id: 'plank', name: 'Plank Hold', sets: 2, restSeconds: 60 },
    ],
  },
  {
    id: 'workout-balance',
    name: 'Balanced Circuit',
    minEnergy: 'NORMAL',
    exercises: [
      { id: 'lunges', name: 'Alternating Lunges', sets: 2, restSeconds: 45 },
      { id: 'rows', name: 'Resistance Rows', sets: 2, restSeconds: 45 },
      { id: 'core', name: 'Core Twists', sets: 2, restSeconds: 45 },
    ],
  },
  {
    id: 'workout-recovery',
    name: 'Recovery Flow',
    minEnergy: 'LOW',
    exercises: [
      { id: 'stretch', name: 'Full Body Stretch', sets: 2, restSeconds: 30 },
      { id: 'breathing', name: 'Box Breathing', sets: 2, restSeconds: 30 },
    ],
  },
];
