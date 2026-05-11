import { create } from 'zustand';
import type { WorkoutTemplate } from '../types/workout';
import { workoutTemplates } from '../data/workouts';
import { createAsyncLock } from './asyncLock';

export type WorkoutPhase = 'IDLE' | 'ACTIVE' | 'RESTING' | 'DONE';

type WorkoutSessionSnapshot = {
  sessionId: string;
  workoutId: string;
  exerciseIndex: number;
  setIndex: number;
  phase: WorkoutPhase;
  restSessionId?: string;
  restDuration?: number;
  pendingExerciseIndex?: number;
  pendingSetIndex?: number;
};

type WorkoutState = {
  status: 'idle' | 'loading' | 'active' | 'error';
  phase: WorkoutPhase;
  workouts: WorkoutTemplate[];
  sessionId?: string;
  workoutId?: string;
  exerciseIndex: number;
  setIndex: number;
  restSessionId?: string;
  restDuration?: number;
  pendingExerciseIndex?: number;
  pendingSetIndex?: number;
  savedSession?: WorkoutSessionSnapshot;
  completedWorkoutId?: string;
  error?: string;
  loadWorkouts: () => Promise<void>;
  startWorkout: (workout: WorkoutTemplate) => Promise<void>;
  completeSet: () => void;
  finishRest: () => void;
  skipExercise: () => void;
  endWorkout: () => void;
  resume: () => void;
};

const withLock = createAsyncLock();

const saveSession = (state: WorkoutState): WorkoutSessionSnapshot | undefined => {
  if (!state.sessionId || !state.workoutId) {
    return undefined;
  }
  return {
    sessionId: state.sessionId,
    workoutId: state.workoutId,
    exerciseIndex: state.exerciseIndex,
    setIndex: state.setIndex,
    phase: state.phase,
    restSessionId: state.restSessionId,
    restDuration: state.restDuration,
    pendingExerciseIndex: state.pendingExerciseIndex,
    pendingSetIndex: state.pendingSetIndex,
  };
};

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  status: 'idle',
  phase: 'IDLE',
  workouts: [],
  exerciseIndex: 0,
  setIndex: 0,
  loadWorkouts: async () =>
    withLock('load', async () => {
      set({ status: 'loading', error: undefined });
      await new Promise((resolve) => setTimeout(resolve, 300));
      set({ workouts: workoutTemplates, status: 'idle' });
    }),
  startWorkout: async (workout) =>
    withLock('start', async () => {
      const sessionId = `workout-${Date.now()}`;
      set({
        status: 'active',
        phase: 'ACTIVE',
        sessionId,
        workoutId: workout.id,
        exerciseIndex: 0,
        setIndex: 0,
        restSessionId: undefined,
        restDuration: undefined,
        pendingExerciseIndex: undefined,
        pendingSetIndex: undefined,
        completedWorkoutId: undefined,
      });
      set((state) => ({ savedSession: saveSession(state) }));
    }),
  completeSet: () => {
    const state = get();
    if (state.phase !== 'ACTIVE' || !state.workoutId) {
      return;
    }
    const workout = state.workouts.find((item) => item.id === state.workoutId);
    if (!workout) {
      return;
    }
    const exercise = workout.exercises[state.exerciseIndex];
    if (!exercise) {
      return;
    }
    const isLastSet = state.setIndex >= exercise.sets - 1;
    const isLastExercise = state.exerciseIndex >= workout.exercises.length - 1;

    if (isLastSet && isLastExercise) {
      set({
        status: 'idle',
        phase: 'DONE',
        sessionId: undefined,
        restSessionId: undefined,
        restDuration: undefined,
        pendingExerciseIndex: undefined,
        pendingSetIndex: undefined,
        completedWorkoutId: state.workoutId,
      });
      set((current) => ({ savedSession: saveSession(current) }));
      return;
    }

    const nextExerciseIndex = isLastSet
      ? state.exerciseIndex + 1
      : state.exerciseIndex;
    const nextSetIndex = isLastSet ? 0 : state.setIndex + 1;

    set({
      phase: 'RESTING',
      restDuration: exercise.restSeconds,
      restSessionId: `rest-${Date.now()}`,
      pendingExerciseIndex: nextExerciseIndex,
      pendingSetIndex: nextSetIndex,
    });
    set((current) => ({ savedSession: saveSession(current) }));
  },
  finishRest: () => {
    const state = get();
    if (state.phase !== 'RESTING') {
      return;
    }
    const nextExerciseIndex = state.pendingExerciseIndex ?? state.exerciseIndex;
    const nextSetIndex = state.pendingSetIndex ?? state.setIndex;
    set({
      phase: 'ACTIVE',
      exerciseIndex: nextExerciseIndex,
      setIndex: nextSetIndex,
      restSessionId: undefined,
      restDuration: undefined,
      pendingExerciseIndex: undefined,
      pendingSetIndex: undefined,
    });
    set((current) => ({ savedSession: saveSession(current) }));
  },
  skipExercise: () => {
    const state = get();
    if (!state.workoutId) {
      return;
    }
    const workout = state.workouts.find((item) => item.id === state.workoutId);
    if (!workout) {
      return;
    }
    const nextExerciseIndex = state.exerciseIndex + 1;
    if (nextExerciseIndex >= workout.exercises.length) {
      set({
        status: 'idle',
        phase: 'DONE',
        sessionId: undefined,
        restSessionId: undefined,
        restDuration: undefined,
        pendingExerciseIndex: undefined,
        pendingSetIndex: undefined,
        completedWorkoutId: state.workoutId,
      });
      set((current) => ({ savedSession: saveSession(current) }));
      return;
    }
    set({
      phase: 'ACTIVE',
      exerciseIndex: nextExerciseIndex,
      setIndex: 0,
      restSessionId: undefined,
      restDuration: undefined,
      pendingExerciseIndex: undefined,
      pendingSetIndex: undefined,
    });
    set((current) => ({ savedSession: saveSession(current) }));
  },
  endWorkout: () => {
    const state = get();
    set({
      status: 'idle',
      phase: 'DONE',
      sessionId: undefined,
      restSessionId: undefined,
      restDuration: undefined,
      pendingExerciseIndex: undefined,
      pendingSetIndex: undefined,
      completedWorkoutId: state.workoutId,
    });
    set((current) => ({ savedSession: saveSession(current) }));
  },
  resume: () => {
    const state = get();
    if (!state.savedSession) {
      return;
    }
    const saved = state.savedSession;
    set({
      status: 'active',
      phase: saved.phase,
      sessionId: saved.sessionId,
      workoutId: saved.workoutId,
      exerciseIndex: saved.exerciseIndex,
      setIndex: saved.setIndex,
      restSessionId: saved.restSessionId,
      restDuration: saved.restDuration,
      pendingExerciseIndex: saved.pendingExerciseIndex,
      pendingSetIndex: saved.pendingSetIndex,
    });
  },
}));
