import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Recipe } from '../types';
import { useRecipeLibraryStore } from '../../../stores/recipeLibrary.store';
import { useEditModeStore } from '../../../stores/editMode.store';

type CookingLibraryScreenProps = {
  onStartRecipe: (recipe: Recipe) => void;
  onOpenEditor: (recipeId?: string) => void;
};

export const CookingLibraryScreen = ({ onStartRecipe, onOpenEditor }: CookingLibraryScreenProps) => {
  const isEditMode = useEditModeStore((state) => state.isEditMode);
  const recipes = useRecipeLibraryStore((state) => state.recipes);

  return (
    <View style={styles.container}>
      {isEditMode ? (
        <Pressable style={styles.editBtn} onPress={() => onOpenEditor()}>
          <Text style={styles.editBtnText}>Add Recipe</Text>
        </Pressable>
      ) : null}

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => onStartRecipe(item)}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardMeta}>{item.category}</Text>
            {item.durationMinutes ? <Text style={styles.cardMeta}>{item.durationMinutes} min</Text> : null}
            <View style={styles.footerRow}>
              <Text style={styles.link}>Start cooking</Text>
              {isEditMode ? (
                <Pressable style={styles.smallBtn} onPress={() => onOpenEditor(item.id)}>
                  <Text style={styles.smallBtnText}>Edit</Text>
                </Pressable>
              ) : null}
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
  },
  editBtn: {
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  grid: {
    gap: 10,
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
    gap: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 10,
    gap: 4,
  },
  cardTitle: {
    fontWeight: '700',
    color: '#0f172a',
  },
  cardMeta: {
    color: '#475569',
    textTransform: 'capitalize',
  },
  footerRow: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  link: {
    color: '#2563eb',
    fontWeight: '600',
  },
  smallBtn: {
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  smallBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
  },
});
