import type { Recipe } from './types';

export const defaultRecipes: Recipe[] = [
  {
    id: 'r-breakfast-1',
    name: 'Yến mạch trái cây',
    mealType: 'breakfast',
    ingredients: ['Yến mạch', 'Sữa', 'Chuối', 'Hạt chia'],
    steps: ['Đun yến mạch với sữa 5 phút', 'Thêm chuối và hạt chia'],
    cookingTime: 10,
    tags: ['standard'],
  },
  {
    id: 'r-lunch-1',
    name: 'Cơm gà áp chảo',
    mealType: 'lunch',
    ingredients: ['Ức gà', 'Cơm', 'Rau củ'],
    steps: ['Ướp gà 10 phút', 'Áp chảo gà', 'Trình bày với cơm và rau'],
    cookingTime: 25,
    tags: ['standard'],
  },
  {
    id: 'r-dinner-1',
    name: 'Salad cá ngừ',
    mealType: 'dinner',
    ingredients: ['Cá ngừ hộp', 'Xà lách', 'Cà chua', 'Dầu ô liu'],
    steps: ['Rửa rau', 'Trộn tất cả nguyên liệu', 'Nêm nếm và dùng ngay'],
    cookingTime: 12,
    tags: ['low energy'],
  },
];
