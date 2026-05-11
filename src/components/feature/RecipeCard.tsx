import { StyleSheet, Text, View } from 'react-native';
import type { RecipeTemplate } from '../../types/cooking';
import { PrimaryButton } from '../ui/PrimaryButton';

type RecipeCardProps = {
  recipe: RecipeTemplate;
  onStart: (recipe: RecipeTemplate) => void;
};

export const RecipeCard = ({ recipe, onStart }: RecipeCardProps) => (
  <View style={styles.card}>
    <Text style={styles.title}>{recipe.name}</Text>
    <Text style={styles.subtitle}>
      {recipe.steps.length} steps · Min energy {recipe.minEnergy}
    </Text>
    <PrimaryButton label="Start cooking" onPress={() => onStart(recipe)} />
  </View>
);

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 13,
    color: '#4b5563',
  },
});
