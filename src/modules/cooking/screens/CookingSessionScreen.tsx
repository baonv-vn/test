import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useMemo } from 'react';
import { useCookingStore } from '../../../stores/cooking.store';
import { TimerText } from '../../../components/ui/TimerText';

type CookingSessionScreenProps = {
  onBackToLibrary: () => void;
};

export const CookingSessionScreen = ({ onBackToLibrary }: CookingSessionScreenProps) => {
  const status = useCookingStore((state) => state.status);
  const phase = useCookingStore((state) => state.phase);
  const recipeId = useCookingStore((state) => state.recipeId);
  const recipes = useCookingStore((state) => state.recipes);
  const stepIndex = useCookingStore((state) => state.stepIndex);
  const stepEndsAt = useCookingStore((state) => state.stepEndsAt);
  const beginStep = useCookingStore((state) => state.beginStep);
  const completeStep = useCookingStore((state) => state.completeStep);
  const startNextStep = useCookingStore((state) => state.startNextStep);
  const endCooking = useCookingStore((state) => state.endCooking);

  const recipe = useMemo(() => recipes.find((item) => item.id === recipeId), [recipeId, recipes]);
  const step = recipe?.steps[stepIndex];

  if (status !== 'active' || !recipe) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyTitle}>No active cooking session</Text>
        <Pressable style={styles.primaryBtn} onPress={onBackToLibrary}>
          <Text style={styles.primaryText}>Back to cooking library</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{recipe.name}</Text>

      {phase === 'ACTIVE' ? (
        <Pressable style={styles.primaryBtn} onPress={beginStep}>
          <Text style={styles.primaryText}>Start step 1</Text>
        </Pressable>
      ) : null}

      {phase === 'STEP' && step ? (
        <View style={styles.stepCard}>
          <Text style={styles.stepLabel}>Step {stepIndex + 1}</Text>
          <Text style={styles.stepText}>{step.description}</Text>
          {step.durationSeconds ? <TimerText endsAt={stepEndsAt} style={styles.timerValue} /> : null}
          <Pressable style={styles.primaryBtn} onPress={completeStep}>
            <Text style={styles.primaryText}>{step.durationSeconds ? 'Skip timer' : 'Complete step'}</Text>
          </Pressable>
        </View>
      ) : null}

      {phase === 'NEXT' ? (
        <Pressable style={styles.primaryBtn} onPress={startNextStep}>
          <Text style={styles.primaryText}>Start next step</Text>
        </Pressable>
      ) : null}

      <View style={styles.row}>
        <Pressable style={styles.secondaryBtn} onPress={endCooking}>
          <Text style={styles.secondaryText}>Finish cooking</Text>
        </Pressable>
        <Pressable style={styles.secondaryBtn} onPress={onBackToLibrary}>
          <Text style={styles.secondaryText}>Back to library</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  stepCard: {
    backgroundColor: '#ecfeff',
    borderColor: '#a5f3fc',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  stepLabel: {
    color: '#0f766e',
    fontWeight: '700',
  },
  stepText: {
    color: '#0f172a',
  },
  timerValue: {
    fontSize: 30,
    fontWeight: '700',
    color: '#0f766e',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  primaryBtn: {
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: '#ffffff',
    fontWeight: '700',
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
  emptyWrap: {
    gap: 10,
  },
  emptyTitle: {
    color: '#475569',
    fontWeight: '600',
  },
});
