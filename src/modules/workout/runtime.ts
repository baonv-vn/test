import type { WorkoutTemplate } from '../../types/workout';
import type { WorkoutDayPlan } from './types';

export const toRuntimeWorkoutTemplate = (plan: WorkoutDayPlan): WorkoutTemplate => ({
  id: plan.id,
  name: `${plan.label} ${plan.focus}`,
  minEnergy: 'NORMAL',
  exercises: plan.exercises.map((exercise) => ({
    id: exercise.id,
    name: `${exercise.name} (${exercise.reps})`,
    sets: exercise.sets,
    restSeconds: exercise.restSeconds,
  })),
});
