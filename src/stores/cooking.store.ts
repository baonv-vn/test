import { create } from 'zustand';
import type { RecipeTemplate } from '../types/cooking';
import { recipeTemplates } from '../data/recipes';
import { createAsyncLock } from './asyncLock';

export type CookingPhase = 'IDLE' | 'ACTIVE' | 'STEP' | 'NEXT' | 'DONE';

type CookingSessionSnapshot = {
  sessionId: string;
  recipeId: string;
  stepIndex: number;
  phase: CookingPhase;
  stepSessionId?: string;
  stepDuration?: number;
};

type CookingState = {
  status: 'idle' | 'loading' | 'active' | 'error';
  phase: CookingPhase;
  recipes: RecipeTemplate[];
  sessionId?: string;
  recipeId?: string;
  stepIndex: number;
  stepSessionId?: string;
  stepDuration?: number;
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
    stepDuration: state.stepDuration,
  };
};

export const useCookingStore = create<CookingState>((set, get) => ({
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
      const sessionId = `cook-${Date.now()}`;
      set({
        status: 'active',
        phase: 'ACTIVE',
        sessionId,
        recipeId: recipe.id,
        stepIndex: 0,
        stepSessionId: undefined,
        stepDuration: undefined,
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
    set({
      phase: 'STEP',
      stepSessionId: duration ? `step-${Date.now()}` : undefined,
      stepDuration: duration,
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
      set({
        status: 'idle',
        phase: 'DONE',
        sessionId: undefined,
        stepSessionId: undefined,
        stepDuration: undefined,
        completedRecipeId: state.recipeId,
      });
      set((current) => ({ savedSession: saveSession(current) }));
      return;
    }
    set({
      phase: 'NEXT',
      stepSessionId: undefined,
      stepDuration: undefined,
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
    set({
      stepIndex: nextIndex,
      phase: 'STEP',
      stepSessionId: duration ? `step-${Date.now()}` : undefined,
      stepDuration: duration,
    });
    set((current) => ({ savedSession: saveSession(current) }));
  },
  endCooking: () => {
    const state = get();
    set({
      status: 'idle',
      phase: 'DONE',
      sessionId: undefined,
      stepSessionId: undefined,
      stepDuration: undefined,
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
      stepDuration: saved.stepDuration,
    });
  },
}));
