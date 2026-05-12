import { create } from 'zustand';
import type { Recipe, RecipeCategory, RecipeStep } from '../modules/cooking/types';

type RecipeLibraryState = {
  recipes: Recipe[];
  addRecipe: (payload: { name: string; category: RecipeCategory; durationMinutes?: number }) => void;
  editRecipe: (recipeId: string, payload: { name: string; category: RecipeCategory; durationMinutes?: number }) => void;
  deleteRecipe: (recipeId: string) => void;
  addRecipeStep: (recipeId: string, payload: Omit<RecipeStep, 'id'>) => void;
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

const createId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const useRecipeLibraryStore = create<RecipeLibraryState>((set) => ({
  recipes: initialRecipes,
  addRecipe: (payload) =>
    set((state) => ({
      recipes: [
        ...state.recipes,
        {
          id: createId('recipe'),
          name: payload.name,
          category: payload.category,
          durationMinutes: payload.durationMinutes,
          steps: [],
        },
      ],
    })),
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
              steps: [
                ...recipe.steps,
                { ...payload, id: createId('step') },
              ],
            }
          : recipe
      ),
    })),
}));
