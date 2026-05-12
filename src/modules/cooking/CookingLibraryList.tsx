import { StyleSheet, Text, View } from 'react-native';
import type { Recipe } from './types';

type CookingLibraryListProps = {
  recipes: Recipe[];
};

const mealLabel: Record<Recipe['mealType'], string> = {
  breakfast: 'Bữa sáng',
  lunch: 'Bữa trưa',
  dinner: 'Bữa tối',
};

export const CookingLibraryList = ({ recipes }: CookingLibraryListProps) => (
  <View style={styles.wrapper}>
    {recipes.map((recipe) => (
      <View key={recipe.id} style={styles.card}>
        <Text style={styles.title}>{recipe.name}</Text>
        <Text style={styles.sub}>{`${mealLabel[recipe.mealType]} • ${recipe.cookingTime} phút`}</Text>
        <Text style={styles.item}>{`Nguyên liệu: ${recipe.ingredients.join(', ')}`}</Text>
        {recipe.steps.map((step, index) => (
          <Text key={`step-${index}`} style={styles.item}>{`Bước ${index + 1}: ${step}`}</Text>
        ))}
        {recipe.tags?.length ? <Text style={styles.tag}>{`Tag: ${recipe.tags.join(', ')}`}</Text> : null}
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    gap: 10,
  },
  card: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  sub: {
    fontSize: 13,
    color: '#4b5563',
  },
  item: {
    fontSize: 13,
    color: '#374151',
  },
  tag: {
    fontSize: 12,
    color: '#0f766e',
    fontWeight: '600',
  },
});
