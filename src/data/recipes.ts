import type { RecipeTemplate } from '../types/cooking';

export const recipeTemplates: RecipeTemplate[] = [
  {
    id: 'recipe-power-bowl',
    name: 'Power Grain Bowl',
    minEnergy: 'HIGH',
    steps: [
      { id: 'prep-veg', description: 'Chop vegetables and herbs.' },
      { id: 'cook-grain', description: 'Simmer grains until tender.', durationSeconds: 300 },
      { id: 'combine', description: 'Combine grains, veg, and dressing.' },
    ],
  },
  {
    id: 'recipe-balanced',
    name: 'Balanced Stir Fry',
    minEnergy: 'NORMAL',
    steps: [
      { id: 'prep', description: 'Prep vegetables and protein.' },
      { id: 'stirfry', description: 'Stir fry on medium heat.', durationSeconds: 240 },
      { id: 'finish', description: 'Finish with sauce and serve.' },
    ],
  },
  {
    id: 'recipe-gentle',
    name: 'Gentle Soup',
    minEnergy: 'LOW',
    steps: [
      { id: 'simmer', description: 'Simmer soup base.', durationSeconds: 420 },
      { id: 'season', description: 'Season and serve.' },
    ],
  },
  {
    id: 'recipe-minimal',
    name: 'Minimal Snack Plate',
    minEnergy: 'EXHAUSTED',
    steps: [
      { id: 'plate', description: 'Assemble ready-to-eat items.' },
    ],
  },
];
