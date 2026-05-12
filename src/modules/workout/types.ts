export type WorkoutExercise = {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restSeconds: number;
};

export type WorkoutDayPlan = {
  id: string;
  label: string;
  focus: string;
  warmUp: string;
  exercises: WorkoutExercise[];
};
