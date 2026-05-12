import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRecipeLibraryStore } from '../../../stores/recipeLibrary.store';
import { useEditModeStore } from '../../../stores/editMode.store';

type RecipeDetailScreenProps = {
  recipeId: string;
  onBack: () => void;
};

export const RecipeDetailScreen = ({ recipeId, onBack }: RecipeDetailScreenProps) => {
  const isEditMode = useEditModeStore((state) => state.isEditMode);
  const recipes = useRecipeLibraryStore((state) => state.recipes);
  const addRecipeStep = useRecipeLibraryStore((state) => state.addRecipeStep);

  const recipe = useMemo(() => recipes.find((item) => item.id === recipeId), [recipeId, recipes]);

  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [remainingMap, setRemainingMap] = useState<Record<string, number>>({});
  const [stepText, setStepText] = useState('');
  const [stepDuration, setStepDuration] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingMap((prev) => {
        const next: Record<string, number> = {};
        let changed = false;
        Object.entries(prev).forEach(([key, value]) => {
          const countdown = Math.max(0, value - 1);
          next[key] = countdown;
          if (countdown !== value) {
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!recipe) {
    return (
      <View>
        <Text>Recipe not found.</Text>
        <Pressable style={styles.button} onPress={onBack}>
          <Text style={styles.buttonText}>Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable style={styles.backBtn} onPress={onBack}>
        <Text style={styles.backBtnText}>← Back to cooking library</Text>
      </Pressable>

      <View style={styles.headerCard}>
        <Text style={styles.title}>{recipe.name}</Text>
        <Text style={styles.meta}>Category: {recipe.category}</Text>
        {recipe.durationMinutes ? <Text style={styles.meta}>Duration: {recipe.durationMinutes} min</Text> : null}
      </View>

      <View style={styles.stepsCard}>
        <Text style={styles.stepsTitle}>Step-by-step instructions</Text>
        {recipe.steps.length === 0 ? <Text style={styles.empty}>No steps yet.</Text> : null}

        {recipe.steps.map((step, index) => {
          const remaining = remainingMap[step.id];
          return (
            <View key={step.id} style={styles.stepItem}>
              <Pressable
                style={[styles.checkCircle, checkedMap[step.id] && styles.checkCircleActive]}
                onPress={() => setCheckedMap((prev) => ({ ...prev, [step.id]: !prev[step.id] }))}
              >
                <Text style={styles.checkText}>{checkedMap[step.id] ? '✓' : ''}</Text>
              </Pressable>
              <View style={styles.stepContent}>
                <Text style={styles.stepIndex}>Step {index + 1}</Text>
                <Text style={styles.stepText}>{step.text}</Text>
                {step.durationSeconds ? (
                  <View style={styles.timerRow}>
                    <Text style={styles.timerText}>
                      {remaining !== undefined ? `${remaining}s` : `${step.durationSeconds}s`}
                    </Text>
                    <Pressable
                      style={styles.smallButton}
                      onPress={() => setRemainingMap((prev) => ({ ...prev, [step.id]: step.durationSeconds ?? 0 }))}
                    >
                      <Text style={styles.smallButtonText}>Start timer</Text>
                    </Pressable>
                  </View>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>

      {isEditMode ? (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Add step</Text>
          <TextInput style={styles.input} value={stepText} onChangeText={setStepText} placeholder="Step instruction" />
          <TextInput
            style={styles.input}
            value={stepDuration}
            onChangeText={setStepDuration}
            placeholder="Timer seconds (optional)"
            keyboardType="numeric"
          />
          <Pressable
            style={styles.button}
            onPress={() => {
              if (!stepText.trim()) {
                return;
              }
              addRecipeStep(recipeId, {
                text: stepText.trim(),
                durationSeconds: stepDuration.trim() ? Number(stepDuration) : undefined,
              });
              setStepText('');
              setStepDuration('');
            }}
          >
            <Text style={styles.buttonText}>Add step</Text>
          </Pressable>
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
  backBtn: {
    alignSelf: 'flex-start',
  },
  backBtnText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  headerCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  meta: {
    color: '#475569',
    textTransform: 'capitalize',
  },
  stepsCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  stepsTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: '#0f172a',
  },
  empty: {
    color: '#64748b',
  },
  stepItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  checkCircleActive: {
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8',
  },
  checkText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  stepContent: {
    flex: 1,
    gap: 2,
  },
  stepIndex: {
    fontWeight: '700',
    color: '#1d4ed8',
  },
  stepText: {
    color: '#0f172a',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  timerText: {
    fontWeight: '700',
    color: '#047857',
  },
  smallButton: {
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  smallButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  formTitle: {
    fontWeight: '700',
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
  button: {
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
