import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useCallback, useEffect, useMemo } from 'react';
import { useEnergyStore } from '../stores/energy.store';
import { useCookingStore } from '../stores/cooking.store';
import { useSessionTimer } from '../hooks/useSessionTimer';
import { formatSeconds } from '../utils/format';
import { isEnergyAllowed } from '../utils/energy';
import { LoadingCard } from '../components/ui/LoadingCard';
import { EmptyStateCard } from '../components/ui/EmptyStateCard';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { RecipeCard } from '../components/feature/RecipeCard';
import type { RecipeTemplate } from '../types/cooking';

export const CookingScreen = () => {
  const energy = useEnergyStore((state) => state.energy);
  const status = useCookingStore((state) => state.status);
  const phase = useCookingStore((state) => state.phase);
  const recipes = useCookingStore((state) => state.recipes);
  const recipeId = useCookingStore((state) => state.recipeId);
  const stepIndex = useCookingStore((state) => state.stepIndex);
  const stepSessionId = useCookingStore((state) => state.stepSessionId);
  const stepDuration = useCookingStore((state) => state.stepDuration ?? 0);
  const completedRecipeId = useCookingStore((state) => state.completedRecipeId);
  const savedSession = useCookingStore((state) => state.savedSession);
  const loadRecipes = useCookingStore((state) => state.loadRecipes);
  const startCooking = useCookingStore((state) => state.startCooking);
  const beginStep = useCookingStore((state) => state.beginStep);
  const completeStep = useCookingStore((state) => state.completeStep);
  const startNextStep = useCookingStore((state) => state.startNextStep);
  const endCooking = useCookingStore((state) => state.endCooking);
  const resume = useCookingStore((state) => state.resume);

  useEffect(() => {
    if (status === 'idle' && recipes.length === 0) {
      loadRecipes();
    }
  }, [status, recipes.length, loadRecipes]);

  const filteredRecipes = useMemo(() => {
    if (!energy) {
      return [];
    }
    return recipes.filter((recipe) => isEnergyAllowed(energy, recipe.minEnergy));
  }, [energy, recipes]);

  const currentRecipe = recipes.find((item) => item.id === recipeId);
  const currentStep = currentRecipe?.steps[stepIndex];

  const { remainingSeconds } = useSessionTimer({
    sessionId: stepSessionId,
    durationSeconds: stepDuration,
    onComplete: completeStep,
  });

  const handleStartCooking = useCallback(
    (recipe: RecipeTemplate) => {
      startCooking(recipe);
    },
    [startCooking]
  );

  const renderRecipeItem = useCallback(
    ({ item }: { item: RecipeTemplate }) => (
      <RecipeCard recipe={item} onStart={handleStartCooking} />
    ),
    [handleStartCooking]
  );

  if (!energy) {
    return (
      <EmptyStateCard
        title="Select energy"
        message="Choose an energy state to see cooking plans."
      />
    );
  }

  if (status === 'loading') {
    return <LoadingCard message="Loading recipes" />;
  }

  if (status === 'active' && currentRecipe) {
    return (
      <View style={styles.session}>
        <Text style={styles.heading}>{currentRecipe.name}</Text>
        {phase === 'ACTIVE' ? (
          <View style={styles.stepCard}>
            <Text style={styles.stepLabel}>Ready to begin</Text>
            <PrimaryButton label="Start step" onPress={beginStep} />
          </View>
        ) : null}
        {phase === 'STEP' && currentStep ? (
          <View style={styles.stepCard}>
            <Text style={styles.stepLabel}>Step {stepIndex + 1}</Text>
            <Text style={styles.stepText}>{currentStep.description}</Text>
            {currentStep.durationSeconds ? (
              <View style={styles.timerRow}>
                <Text style={styles.timerValue}>
                  {formatSeconds(remainingSeconds)}
                </Text>
                <PrimaryButton label="Skip timer" onPress={completeStep} />
              </View>
            ) : (
              <PrimaryButton label="Complete step" onPress={completeStep} />
            )}
          </View>
        ) : null}
        {phase === 'NEXT' ? (
          <View style={styles.stepCard}>
            <Text style={styles.stepLabel}>Step complete</Text>
            <PrimaryButton label="Start next step" onPress={startNextStep} />
          </View>
        ) : null}
        <PrimaryButton label="End cooking" onPress={endCooking} variant="secondary" />
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      {savedSession ? <PrimaryButton label="Resume cooking" onPress={resume} /> : null}
      {completedRecipeId ? (
        <EmptyStateCard
          title="Recipe complete"
          message="Meal finished. Choose another recipe when ready."
        />
      ) : null}
      {filteredRecipes.length === 0 ? (
        <EmptyStateCard
          title="No recipes match"
          message="Try a different energy level or reset your energy state."
        />
      ) : (
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id}
          renderItem={renderRecipeItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    gap: 12,
  },
  list: {
    gap: 12,
    paddingBottom: 24,
  },
  session: {
    flex: 1,
    gap: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  stepCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#ecfeff',
    gap: 8,
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f766e',
  },
  stepText: {
    fontSize: 15,
    color: '#0f172a',
  },
  timerRow: {
    gap: 8,
  },
  timerValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f766e',
  },
});
