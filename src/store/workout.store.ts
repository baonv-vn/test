import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { defaultWorkoutRoutines } from '../modules/workout/defaultData';
import type { WorkoutCategory, WorkoutExercise, WorkoutRoutine } from '../modules/workout/types';
import { appStorage } from './storage';

type WorkoutInput = {
  name: string;
  category: WorkoutCategory;
  exercises: WorkoutExercise[];
};

type WorkoutState = {
  routines: WorkoutRoutine[];
  addRoutine: (payload: WorkoutInput) => void;
  updateRoutine: (id: string, payload: WorkoutInput) => void;
  deleteRoutine: (id: string) => void;
};

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set) => ({
      routines: defaultWorkoutRoutines,
      addRoutine: (payload) =>
        set((state) => ({
          routines: [
            ...state.routines,
            {
              id: `w-${Date.now()}`,
              name: payload.name,
              category: payload.category,
              exercises: payload.exercises.map((exercise, index) => ({
                ...exercise,
                id: exercise.id || `e-${Date.now()}-${index}`,
              })),
            },
          ],
        })),
      updateRoutine: (id, payload) =>
        set((state) => ({
          routines: state.routines.map((routine) =>
            routine.id === id
              ? {
                  ...routine,
                  name: payload.name,
                  category: payload.category,
                  exercises: payload.exercises.map((exercise, index) => ({
                    ...exercise,
                    id: exercise.id || `e-${id}-${index}`,
                  })),
                }
              : routine
          ),
        })),
      deleteRoutine: (id) =>
        set((state) => ({
          routines: state.routines.filter((routine) => routine.id !== id),
        })),
    }),
    {
      name: 'daily-workout-store',
      storage: appStorage,
    }
  )
);
