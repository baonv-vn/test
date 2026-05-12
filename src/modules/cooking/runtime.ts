import type { RecipeTemplate } from '../../types/cooking';
import type { Recipe } from './types';

export const toRuntimeRecipeTemplate = (recipe: Recipe): RecipeTemplate => ({
  id: recipe.id,
  name: recipe.name,
  minEnergy: 'NORMAL',
  steps: recipe.steps.map((step) => ({
    id: step.id,
    description: step.text,
    durationSeconds: step.durationSeconds,
  })),
});
