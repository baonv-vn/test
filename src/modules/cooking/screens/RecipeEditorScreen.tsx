import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { RecipeCategory } from '../types';
import { useRecipeLibraryStore } from '../../../stores/recipeLibrary.store';

type RecipeEditorScreenProps = {
  recipeId?: string;
  onBack: () => void;
};

const CATEGORIES: RecipeCategory[] = ['breakfast', 'lunch', 'dinner'];

export const RecipeEditorScreen = ({ recipeId, onBack }: RecipeEditorScreenProps) => {
  const recipes = useRecipeLibraryStore((state) => state.recipes);
  const addRecipe = useRecipeLibraryStore((state) => state.addRecipe);
  const editRecipe = useRecipeLibraryStore((state) => state.editRecipe);
  const deleteRecipe = useRecipeLibraryStore((state) => state.deleteRecipe);
  const addRecipeStep = useRecipeLibraryStore((state) => state.addRecipeStep);
  const editRecipeStep = useRecipeLibraryStore((state) => state.editRecipeStep);
  const deleteRecipeStep = useRecipeLibraryStore((state) => state.deleteRecipeStep);
  const reorderRecipeStep = useRecipeLibraryStore((state) => state.reorderRecipeStep);

  const recipe = useMemo(() => recipes.find((item) => item.id === recipeId), [recipeId, recipes]);

  const [name, setName] = useState(recipe?.name ?? '');
  const [duration, setDuration] = useState(recipe?.durationMinutes ? String(recipe.durationMinutes) : '');
  const [category, setCategory] = useState<RecipeCategory>(recipe?.category ?? 'breakfast');

  const [stepText, setStepText] = useState('');
  const [stepDuration, setStepDuration] = useState('');
  const [editingStepId, setEditingStepId] = useState<string | null>(null);

  const currentRecipeId = recipe?.id;

  const saveRecipe = () => {
    if (!name.trim()) {
      return;
    }
    const payload = {
      name: name.trim(),
      category,
      durationMinutes: duration.trim() ? Number(duration) : undefined,
    };
    if (currentRecipeId) {
      editRecipe(currentRecipeId, payload);
      return;
    }
    addRecipe(payload);
    onBack();
  };

  const resetStepForm = () => {
    setStepText('');
    setStepDuration('');
    setEditingStepId(null);
  };

  const saveStep = () => {
    if (!currentRecipeId || !stepText.trim()) {
      return;
    }
    const payload = {
      text: stepText.trim(),
      durationSeconds: stepDuration.trim() ? Number(stepDuration) : undefined,
    };
    if (editingStepId) {
      editRecipeStep(currentRecipeId, editingStepId, payload);
    } else {
      addRecipeStep(currentRecipeId, payload);
    }
    resetStepForm();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable style={styles.linkBtn} onPress={onBack}>
        <Text style={styles.linkText}>← Back</Text>
      </Pressable>

      <View style={styles.card}>
        <Text style={styles.title}>{currentRecipeId ? 'Edit recipe' : 'Create recipe'}</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Recipe name" />
        <TextInput
          style={styles.input}
          value={duration}
          onChangeText={setDuration}
          placeholder="Duration minutes (optional)"
          keyboardType="numeric"
        />
        <View style={styles.row}>
          {CATEGORIES.map((value) => (
            <Pressable
              key={value}
              style={[styles.categoryBtn, category === value && styles.categoryBtnActive]}
              onPress={() => setCategory(value)}
            >
              <Text style={styles.categoryText}>{value}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.row}>
          <Pressable style={styles.primaryBtn} onPress={saveRecipe}>
            <Text style={styles.primaryText}>Save recipe</Text>
          </Pressable>
          {currentRecipeId ? (
            <Pressable
              style={styles.dangerBtn}
              onPress={() => {
                deleteRecipe(currentRecipeId);
                onBack();
              }}
            >
              <Text style={styles.primaryText}>Delete recipe</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      {currentRecipeId ? (
        <View style={styles.card}>
          <Text style={styles.title}>{editingStepId ? 'Edit step' : 'Add step'}</Text>
          <TextInput style={styles.input} value={stepText} onChangeText={setStepText} placeholder="Step" />
          <TextInput
            style={styles.input}
            value={stepDuration}
            onChangeText={setStepDuration}
            placeholder="Duration seconds (optional)"
            keyboardType="numeric"
          />
          <View style={styles.row}>
            <Pressable style={styles.primaryBtn} onPress={saveStep}>
              <Text style={styles.primaryText}>Save step</Text>
            </Pressable>
            {editingStepId ? (
              <Pressable style={styles.secondaryBtn} onPress={resetStepForm}>
                <Text style={styles.secondaryText}>Cancel</Text>
              </Pressable>
            ) : null}
          </View>

          {recipe?.steps.map((step) => (
            <View key={step.id} style={styles.itemCard}>
              <View style={styles.itemMain}>
                <Text style={styles.itemTitle}>{step.text}</Text>
                <Text style={styles.itemMeta}>{step.durationSeconds ? `${step.durationSeconds}s` : 'No timer'}</Text>
              </View>
              <View style={styles.row}>
                <Pressable
                  style={styles.smallBtn}
                  onPress={() => {
                    setEditingStepId(step.id);
                    setStepText(step.text);
                    setStepDuration(step.durationSeconds ? String(step.durationSeconds) : '');
                  }}
                >
                  <Text style={styles.smallBtnText}>Edit</Text>
                </Pressable>
                <Pressable style={styles.smallBtn} onPress={() => reorderRecipeStep(currentRecipeId, step.id, 'up')}>
                  <Text style={styles.smallBtnText}>↑</Text>
                </Pressable>
                <Pressable style={styles.smallBtn} onPress={() => reorderRecipeStep(currentRecipeId, step.id, 'down')}>
                  <Text style={styles.smallBtnText}>↓</Text>
                </Pressable>
                <Pressable
                  style={[styles.smallBtn, styles.smallDanger]}
                  onPress={() => deleteRecipeStep(currentRecipeId, step.id)}
                >
                  <Text style={styles.smallBtnText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    color: '#0f172a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  categoryBtn: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  categoryBtnActive: {
    backgroundColor: '#e2e8f0',
  },
  categoryText: {
    textTransform: 'capitalize',
    color: '#0f172a',
    fontWeight: '600',
  },
  primaryBtn: {
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  dangerBtn: {
    backgroundColor: '#b91c1c',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  secondaryBtn: {
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  secondaryText: {
    color: '#0f172a',
    fontWeight: '700',
  },
  primaryText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  linkBtn: {
    alignSelf: 'flex-start',
  },
  linkText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  itemCard: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    padding: 10,
    gap: 8,
  },
  itemMain: {
    gap: 2,
  },
  itemTitle: {
    color: '#0f172a',
    fontWeight: '700',
  },
  itemMeta: {
    color: '#475569',
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
  smallDanger: {
    backgroundColor: '#b91c1c',
  },
});
