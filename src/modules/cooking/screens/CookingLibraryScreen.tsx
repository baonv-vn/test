import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import type { Recipe, RecipeCategory } from '../types';
import { useRecipeLibraryStore } from '../../../stores/recipeLibrary.store';
import { useEditModeStore } from '../../../stores/editMode.store';

type CookingLibraryScreenProps = {
  onOpenRecipe: (recipe: Recipe) => void;
};

const CATEGORIES: RecipeCategory[] = ['breakfast', 'lunch', 'dinner'];

export const CookingLibraryScreen = ({ onOpenRecipe }: CookingLibraryScreenProps) => {
  const isEditMode = useEditModeStore((state) => state.isEditMode);
  const recipes = useRecipeLibraryStore((state) => state.recipes);
  const addRecipe = useRecipeLibraryStore((state) => state.addRecipe);
  const editRecipe = useRecipeLibraryStore((state) => state.editRecipe);
  const deleteRecipe = useRecipeLibraryStore((state) => state.deleteRecipe);

  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState<RecipeCategory>('breakfast');
  const [editingId, setEditingId] = useState<string | null>(null);

  const submit = () => {
    if (!isEditMode || !name.trim()) {
      return;
    }
    const parsedDuration = duration.trim() ? Number(duration) : undefined;
    if (editingId) {
      editRecipe(editingId, {
        name: name.trim(),
        category,
        durationMinutes: parsedDuration,
      });
      setEditingId(null);
    } else {
      addRecipe({
        name: name.trim(),
        category,
        durationMinutes: parsedDuration,
      });
    }
    setName('');
    setDuration('');
    setCategory('breakfast');
  };

  return (
    <View style={styles.container}>
      {isEditMode ? (
        <View style={styles.form}>
          <Text style={styles.formTitle}>{editingId ? 'Edit recipe' : 'Add recipe'}</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Recipe name" />
          <TextInput
            style={styles.input}
            value={duration}
            onChangeText={setDuration}
            placeholder="Duration minutes (optional)"
            keyboardType="numeric"
          />
          <View style={styles.categoryRow}>
            {CATEGORIES.map((value) => (
              <Pressable
                key={value}
                style={[styles.categoryButton, category === value && styles.categoryButtonActive]}
                onPress={() => setCategory(value)}
              >
                <Text style={styles.categoryText}>{value}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.formActions}>
            <Pressable style={styles.actionButton} onPress={submit}>
              <Text style={styles.actionButtonText}>{editingId ? 'Save recipe' : 'Add recipe'}</Text>
            </Pressable>
            {editingId ? (
              <Pressable style={styles.secondaryButton} onPress={() => setEditingId(null)}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      ) : null}

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => onOpenRecipe(item)}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardMeta}>{item.category}</Text>
            {item.durationMinutes ? <Text style={styles.cardMeta}>{item.durationMinutes} min</Text> : null}
            {isEditMode ? (
              <View style={styles.cardActions}>
                <Pressable
                  style={styles.smallBtn}
                  onPress={() => {
                    setEditingId(item.id);
                    setName(item.name);
                    setDuration(item.durationMinutes ? String(item.durationMinutes) : '');
                    setCategory(item.category);
                  }}
                >
                  <Text style={styles.smallBtnText}>Edit</Text>
                </Pressable>
                <Pressable style={[styles.smallBtn, styles.danger]} onPress={() => deleteRecipe(item.id)}>
                  <Text style={styles.smallBtnText}>Delete</Text>
                </Pressable>
              </View>
            ) : null}
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    gap: 8,
  },
  formTitle: {
    fontWeight: '700',
    color: '#0f172a',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  categoryButtonActive: {
    backgroundColor: '#e2e8f0',
  },
  categoryText: {
    color: '#0f172a',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  formActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  secondaryButtonText: {
    color: '#0f172a',
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
  cardActions: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
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
  danger: {
    backgroundColor: '#b91c1c',
  },
});
