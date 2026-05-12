import { StyleSheet, Text, View } from 'react-native';
import type { Recipe } from './types';
import { PrimaryButton } from '../../components/ui/PrimaryButton';

type CookingTaskPanelProps = {
  recipe?: Recipe;
  onComplete: () => void;
};

export const CookingTaskPanel = ({ recipe, onComplete }: CookingTaskPanelProps) => {
  if (!recipe) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Chưa gắn công thức</Text>
        <Text style={styles.text}>Hãy chọn recipeId trong chế độ chỉnh sửa.</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{`Đang nấu: ${recipe.name}`}</Text>
      <Text style={styles.text}>{`Thời gian dự kiến: ${recipe.cookingTime} phút`}</Text>
      <Text style={styles.text}>{`Nguyên liệu: ${recipe.ingredients.join(', ')}`}</Text>
      {recipe.steps.map((step, index) => (
        <Text key={`${recipe.id}-${index}`} style={styles.text}>{`Bước ${index + 1}: ${step}`}</Text>
      ))}
      <PrimaryButton label="Hoàn thành nấu ăn" onPress={onComplete} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    backgroundColor: '#f0fdf4',
    padding: 12,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#166534',
  },
  text: {
    fontSize: 13,
    color: '#15803d',
  },
});
