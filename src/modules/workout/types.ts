export type WorkoutCategory = 'push' | 'pull' | 'legs' | 'core';

export type WorkoutExercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  restSeconds: number;
};

export type WorkoutRoutine = {
  id: string;
  name: string;
  category: WorkoutCategory;
  exercises: WorkoutExercise[];
};
