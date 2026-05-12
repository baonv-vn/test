import { create } from 'zustand';
import type { WorkoutDayPlan, WorkoutExercise } from '../modules/workout/types';

type WorkoutLibraryState = {
  plans: WorkoutDayPlan[];
  addExercise: (dayId: string, payload: Omit<WorkoutExercise, 'id'>) => void;
  editExercise: (dayId: string, exerciseId: string, payload: Omit<WorkoutExercise, 'id'>) => void;
  deleteExercise: (dayId: string, exerciseId: string) => void;
  reorderExercise: (dayId: string, exerciseId: string, direction: 'up' | 'down') => void;
};

const initialPlans: WorkoutDayPlan[] = [
  {
    id: 'mon-pull',
    label: 'Monday',
    focus: 'Pull',
    warmUp: '5 min row + shoulder mobility',
    exercises: [
      { id: 'm1', name: 'Pull Up', sets: 4, reps: '6-8', restSeconds: 120 },
      { id: 'm2', name: 'Barbell Row', sets: 4, reps: '8-10', restSeconds: 90 },
    ],
  },
  {
    id: 'tue-legs-hypertrophy',
    label: 'Tuesday',
    focus: 'Legs Hypertrophy',
    warmUp: 'Dynamic hips + light squats',
    exercises: [
      { id: 't1', name: 'Back Squat', sets: 4, reps: '8-10', restSeconds: 120 },
      { id: 't2', name: 'Leg Press', sets: 3, reps: '10-12', restSeconds: 90 },
    ],
  },
  {
    id: 'wed-push',
    label: 'Wednesday',
    focus: 'Push',
    warmUp: 'Band activation + push-up prep',
    exercises: [
      { id: 'w1', name: 'Bench Press', sets: 4, reps: '6-8', restSeconds: 120 },
      { id: 'w2', name: 'Overhead Press', sets: 3, reps: '8-10', restSeconds: 90 },
    ],
  },
  {
    id: 'thu-legs-power',
    label: 'Thursday',
    focus: 'Legs Power',
    warmUp: 'Jumps + hip openers',
    exercises: [
      { id: 'th1', name: 'Front Squat', sets: 5, reps: '3-5', restSeconds: 150 },
      { id: 'th2', name: 'Romanian Deadlift', sets: 4, reps: '5-6', restSeconds: 120 },
    ],
  },
  {
    id: 'fri-pull-core',
    label: 'Friday',
    focus: 'Pull + Core',
    warmUp: 'Rowing + core activation',
    exercises: [
      { id: 'f1', name: 'Seated Cable Row', sets: 4, reps: '8-10', restSeconds: 90 },
      { id: 'f2', name: 'Hanging Leg Raise', sets: 3, reps: '10-12', restSeconds: 60 },
    ],
  },
  {
    id: 'sat-strength-foundation',
    label: 'Saturday',
    focus: 'Strength Foundation',
    warmUp: 'Full body mobility + ramp-up sets',
    exercises: [
      { id: 's1', name: 'Deadlift', sets: 5, reps: '3-5', restSeconds: 180 },
      { id: 's2', name: 'Farmer Carry', sets: 4, reps: '40m', restSeconds: 90 },
    ],
  },
];

const createId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const useWorkoutLibraryStore = create<WorkoutLibraryState>((set) => ({
  plans: initialPlans,
  addExercise: (dayId, payload) =>
    set((state) => ({
      plans: state.plans.map((plan) =>
        plan.id === dayId
          ? {
              ...plan,
              exercises: [
                ...plan.exercises,
                { ...payload, id: createId(dayId) },
              ],
            }
          : plan
      ),
    })),
  editExercise: (dayId, exerciseId, payload) =>
    set((state) => ({
      plans: state.plans.map((plan) =>
        plan.id === dayId
          ? {
              ...plan,
              exercises: plan.exercises.map((exercise) =>
                exercise.id === exerciseId ? { ...exercise, ...payload } : exercise
              ),
            }
          : plan
      ),
    })),
  deleteExercise: (dayId, exerciseId) =>
    set((state) => ({
      plans: state.plans.map((plan) =>
        plan.id === dayId
          ? {
              ...plan,
              exercises: plan.exercises.filter((exercise) => exercise.id !== exerciseId),
            }
          : plan
      ),
    })),
  reorderExercise: (dayId, exerciseId, direction) =>
    set((state) => ({
      plans: state.plans.map((plan) => {
        if (plan.id !== dayId) {
          return plan;
        }
        const currentIndex = plan.exercises.findIndex((exercise) => exercise.id === exerciseId);
        if (currentIndex < 0) {
          return plan;
        }
        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (targetIndex < 0 || targetIndex >= plan.exercises.length) {
          return plan;
        }
        const next = [...plan.exercises];
        const [moved] = next.splice(currentIndex, 1);
        next.splice(targetIndex, 0, moved);
        return { ...plan, exercises: next };
      }),
    })),
}));
