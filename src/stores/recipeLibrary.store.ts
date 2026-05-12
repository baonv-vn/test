import { create } from 'zustand';
import type { Recipe, RecipeCategory, RecipeStep } from '../modules/cooking/types';
import { createId } from '../utils/id';

type RecipeLibraryState = {
  recipes: Recipe[];
  addRecipe: (payload: { name: string; category: RecipeCategory; durationMinutes?: number }) => string;
  editRecipe: (recipeId: string, payload: { name: string; category: RecipeCategory; durationMinutes?: number }) => void;
  deleteRecipe: (recipeId: string) => void;
  addRecipeStep: (recipeId: string, payload: Omit<RecipeStep, 'id'>) => void;
  editRecipeStep: (recipeId: string, stepId: string, payload: Omit<RecipeStep, 'id'>) => void;
  deleteRecipeStep: (recipeId: string, stepId: string) => void;
  reorderRecipeStep: (recipeId: string, stepId: string, direction: 'up' | 'down') => void;
};

const initialRecipes: Recipe[] = [
  {
    id: 'r1',
    name: 'Overnight Oats Bowl',
    category: 'breakfast',
    durationMinutes: 10,
    steps: [
      { id: 'r1s1', text: 'Mix oats, milk, and chia seeds.' },
      { id: 'r1s2', text: 'Chill and top with fruits.', durationSeconds: 60 },
    ],
  },
  {
    id: 'r2',
    name: 'Chicken Rice Plate',
    category: 'lunch',
    durationMinutes: 35,
    steps: [
      { id: 'r2s1', text: 'Season and sear chicken breast.' },
      { id: 'r2s2', text: 'Cook rice and steam vegetables.', durationSeconds: 900 },
      { id: 'r2s3', text: 'Plate and serve.' },
    ],
  },
  {
    id: 'r3',
    name: 'Salmon Veggie Tray',
    category: 'dinner',
    durationMinutes: 25,
    steps: [
      { id: 'r3s1', text: 'Season salmon and vegetables.' },
      { id: 'r3s2', text: 'Bake until done.', durationSeconds: 1200 },
    ],
  },
];

export const useRecipeLibraryStore = create<RecipeLibraryState>((set) => ({
  recipes: initialRecipes,
  addRecipe: (payload) => {
    const id = createId('recipe');
    set((state) => ({
      recipes: [
        ...state.recipes,
        {
          id,
          name: payload.name,
          category: payload.category,
          durationMinutes: payload.durationMinutes,
          steps: [],
        },
      ],
    }));
    return id;
  },
  editRecipe: (recipeId, payload) =>
    set((state) => ({
      recipes: state.recipes.map((recipe) =>
        recipe.id === recipeId ? { ...recipe, ...payload } : recipe
      ),
    })),
  deleteRecipe: (recipeId) =>
    set((state) => ({ recipes: state.recipes.filter((recipe) => recipe.id !== recipeId) })),
  addRecipeStep: (recipeId, payload) =>
    set((state) => ({
      recipes: state.recipes.map((recipe) =>
        recipe.id === recipeId
          ? {
              ...recipe,
              steps: [...recipe.steps, { ...payload, id: createId('step') }],
            }
          : recipe
      ),
    })),
  editRecipeStep: (recipeId, stepId, payload) =>
    set((state) => ({
      recipes: state.recipes.map((recipe) =>
        recipe.id === recipeId
          ? {
              ...recipe,
              steps: recipe.steps.map((step) =>
                step.id === stepId ? { ...step, ...payload } : step
              ),
            }
          : recipe
      ),
    })),
  deleteRecipeStep: (recipeId, stepId) =>
    set((state) => ({
      recipes: state.recipes.map((recipe) =>
        recipe.id === recipeId
          ? {
              ...recipe,
              steps: recipe.steps.filter((step) => step.id !== stepId),
            }
          : recipe
      ),
    })),
  reorderRecipeStep: (recipeId, stepId, direction) =>
    set((state) => ({
      recipes: state.recipes.map((recipe) => {
        if (recipe.id !== recipeId) {
          return recipe;
        }
        const currentIndex = recipe.steps.findIndex((step) => step.id === stepId);
        if (currentIndex < 0) {
          return recipe;
        }
        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (targetIndex < 0 || targetIndex >= recipe.steps.length) {
          return recipe;
        }
        const next = [...recipe.steps];
        const [moved] = next.splice(currentIndex, 1);
        next.splice(targetIndex, 0, moved);
        return { ...recipe, steps: next };
      }),
    })),
}));
