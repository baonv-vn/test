export type RecipeMealType = 'breakfast' | 'lunch' | 'dinner';

export type RecipeTag = 'low energy' | 'standard';

export type Recipe = {
  id: string;
  name: string;
  mealType: RecipeMealType;
  ingredients: string[];
  steps: string[];
  cookingTime: number;
  tags?: RecipeTag[];
};
