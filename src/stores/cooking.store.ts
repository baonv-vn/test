import { create } from 'zustand';
import type { RecipeTemplate } from '../types/cooking';
import { recipeTemplates } from '../data/recipes';
import { createAsyncLock } from './asyncLock';
import { createSessionId, createTimerSnapshot } from './sessionUtils';
import { createTimerWatcher } from './timerWatcher';

export type CookingPhase = 'IDLE' | 'ACTIVE' | 'STEP' | 'NEXT' | 'DONE';

type CookingSessionSnapshot = {
  sessionId: string;
  recipeId: string;
  stepIndex: number;
  phase: CookingPhase;
  stepSessionId?: string;
  stepDurationSeconds?: number;
  stepStartedAt?: number;
  stepEndsAt?: number;
};

type CookingState = {
  status: 'idle' | 'loading' | 'active' | 'error';
  phase: CookingPhase;
  recipes: RecipeTemplate[];
  sessionId?: string;
  recipeId?: string;
  stepIndex: number;
  stepSessionId?: string;
  stepDurationSeconds?: number;
  stepStartedAt?: number;
  stepEndsAt?: number;
  savedSession?: CookingSessionSnapshot;
  completedRecipeId?: string;
  error?: string;
  loadRecipes: () => Promise<void>;
  startCooking: (recipe: RecipeTemplate) => Promise<void>;
  beginStep: () => void;
  completeStep: () => void;
  startNextStep: () => void;
  endCooking: () => void;
  resume: () => void;
};

const withLock = createAsyncLock();

const saveSession = (state: CookingState): CookingSessionSnapshot | undefined => {
  if (!state.sessionId || !state.recipeId) {
    return undefined;
  }
  return {
    sessionId: state.sessionId,
    recipeId: state.recipeId,
    stepIndex: state.stepIndex,
    phase: state.phase,
    stepSessionId: state.stepSessionId,
    stepDurationSeconds: state.stepDurationSeconds,
    stepStartedAt: state.stepStartedAt,
    stepEndsAt: state.stepEndsAt,
  };
};

export const useCookingStore = create<CookingState>((set, get) => {
  const stepWatcher = createTimerWatcher({
    getEndsAt: () => get().stepEndsAt,
    onExpire: () => get().completeStep(),
  });

  return {
    status: 'idle',
    phase: 'IDLE',
    recipes: [],
    stepIndex: 0,
    loadRecipes: async () =>
      withLock('load', async () => {
        set({ status: 'loading', error: undefined });
        await new Promise((resolve) => setTimeout(resolve, 300));
        set({ recipes: recipeTemplates, status: 'idle' });
      }),
    startCooking: async (recipe) =>
      withLock('start', async () => {
        stepWatcher.stop();
        const sessionId = createSessionId('cook');
        set({
          status: 'active',
          phase: 'ACTIVE',
          sessionId,
          recipeId: recipe.id,
          stepIndex: 0,
          stepSessionId: undefined,
          stepDurationSeconds: undefined,
          stepStartedAt: undefined,
          stepEndsAt: undefined,
          completedRecipeId: undefined,
        });
        set((state) => ({ savedSession: saveSession(state) }));
      }),
    beginStep: () => {
      const state = get();
      if (!state.recipeId) {
        return;
      }
      const recipe = state.recipes.find((item) => item.id === state.recipeId);
      const step = recipe?.steps[state.stepIndex];
      if (!step) {
        return;
      }
      const duration = step.durationSeconds;
      if (duration) {
        const stepTimer = createTimerSnapshot(duration);
        set({
          phase: 'STEP',
          stepSessionId: createSessionId('step'),
          stepDurationSeconds: stepTimer.durationSeconds,
          stepStartedAt: stepTimer.startedAt,
          stepEndsAt: stepTimer.endsAt,
        });
        set((current) => ({ savedSession: saveSession(current) }));
        stepWatcher.start();
        return;
      }
      stepWatcher.stop();
      set({
        phase: 'STEP',
        stepSessionId: undefined,
        stepDurationSeconds: undefined,
        stepStartedAt: undefined,
        stepEndsAt: undefined,
      });
      set((current) => ({ savedSession: saveSession(current) }));
    },
    completeStep: () => {
      const state = get();
      if (!state.recipeId || state.phase !== 'STEP') {
        return;
      }
      const recipe = state.recipes.find((item) => item.id === state.recipeId);
      if (!recipe) {
        return;
      }
      const isLastStep = state.stepIndex >= recipe.steps.length - 1;
      if (isLastStep) {
        stepWatcher.stop();
        set({
          status: 'idle',
          phase: 'DONE',
          sessionId: undefined,
          recipeId: undefined,
          stepIndex: 0,
          stepSessionId: undefined,
          stepDurationSeconds: undefined,
          stepStartedAt: undefined,
          stepEndsAt: undefined,
          completedRecipeId: state.recipeId,
        });
        set((current) => ({ savedSession: saveSession(current) }));
        return;
      }
      stepWatcher.stop();
      set({
        phase: 'NEXT',
        stepSessionId: undefined,
        stepDurationSeconds: undefined,
        stepStartedAt: undefined,
        stepEndsAt: undefined,
      });
      set((current) => ({ savedSession: saveSession(current) }));
    },
    startNextStep: () => {
      const state = get();
      if (!state.recipeId) {
        return;
      }
      const recipe = state.recipes.find((item) => item.id === state.recipeId);
      if (!recipe) {
        return;
      }
      const nextIndex = Math.min(state.stepIndex + 1, recipe.steps.length - 1);
      const step = recipe.steps[nextIndex];
      const duration = step?.durationSeconds;
      if (duration) {
        const stepTimer = createTimerSnapshot(duration);
        set({
          stepIndex: nextIndex,
          phase: 'STEP',
          stepSessionId: createSessionId('step'),
          stepDurationSeconds: stepTimer.durationSeconds,
          stepStartedAt: stepTimer.startedAt,
          stepEndsAt: stepTimer.endsAt,
        });
        set((current) => ({ savedSession: saveSession(current) }));
        stepWatcher.start();
        return;
      }
      stepWatcher.stop();
      set({
        stepIndex: nextIndex,
        phase: 'STEP',
        stepSessionId: undefined,
        stepDurationSeconds: undefined,
        stepStartedAt: undefined,
        stepEndsAt: undefined,
      });
      set((current) => ({ savedSession: saveSession(current) }));
    },
    endCooking: () => {
      const state = get();
      stepWatcher.stop();
      set({
        status: 'idle',
        phase: 'DONE',
        sessionId: undefined,
        recipeId: undefined,
        stepIndex: 0,
        stepSessionId: undefined,
        stepDurationSeconds: undefined,
        stepStartedAt: undefined,
        stepEndsAt: undefined,
        completedRecipeId: state.recipeId,
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
        recipeId: saved.recipeId,
        stepIndex: saved.stepIndex,
        stepSessionId: saved.stepSessionId,
        stepDurationSeconds: saved.stepDurationSeconds,
        stepStartedAt: saved.stepStartedAt,
        stepEndsAt: saved.stepEndsAt,
      });
      if (saved.phase === 'STEP') {
        if (saved.stepEndsAt && Date.now() >= saved.stepEndsAt) {
          get().completeStep();
          return;
        }
        if (saved.stepEndsAt) {
          stepWatcher.start();
        }
      }
    },
  };
});
