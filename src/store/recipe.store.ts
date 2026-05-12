import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { defaultRecipes } from '../modules/cooking/defaultData';
import type { Recipe, RecipeMealType, RecipeTag } from '../modules/cooking/types';
import { appStorage } from './storage';

type RecipeInput = {
  name: string;
  mealType: RecipeMealType;
  ingredients: string[];
  steps: string[];
  cookingTime: number;
  tags?: RecipeTag[];
};

type RecipeState = {
  recipes: Recipe[];
  addRecipe: (payload: RecipeInput) => void;
  updateRecipe: (id: string, payload: RecipeInput) => void;
  deleteRecipe: (id: string) => void;
};

export const useRecipeStore = create<RecipeState>()(
  persist(
    (set) => ({
      recipes: defaultRecipes,
      addRecipe: (payload) =>
        set((state) => ({
          recipes: [...state.recipes, { id: `r-${Date.now()}`, ...payload }],
        })),
      updateRecipe: (id, payload) =>
        set((state) => ({
          recipes: state.recipes.map((recipe) =>
            recipe.id === id
              ? {
                  ...recipe,
                  ...payload,
                }
              : recipe
          ),
        })),
      deleteRecipe: (id) =>
        set((state) => ({
          recipes: state.recipes.filter((recipe) => recipe.id !== id),
        })),
    }),
    {
      name: 'daily-recipe-store',
      storage: appStorage,
    }
  )
);
