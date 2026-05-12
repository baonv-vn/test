export type RecipeCategory = 'breakfast' | 'lunch' | 'dinner';

export type RecipeStep = {
  id: string;
  text: string;
  durationSeconds?: number;
};

export type Recipe = {
  id: string;
  name: string;
  category: RecipeCategory;
  durationMinutes?: number;
  steps: RecipeStep[];
};
