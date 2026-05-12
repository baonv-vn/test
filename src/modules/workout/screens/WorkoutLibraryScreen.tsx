import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { WorkoutDayPlan } from '../types';
import { useWorkoutLibraryStore } from '../../../stores/workoutLibrary.store';

type WorkoutLibraryScreenProps = {
  onOpenDay: (day: WorkoutDayPlan) => void;
};

export const WorkoutLibraryScreen = ({ onOpenDay }: WorkoutLibraryScreenProps) => {
  const plans = useWorkoutLibraryStore((state) => state.plans);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {plans.map((plan) => (
        <Pressable key={plan.id} style={styles.card} onPress={() => onOpenDay(plan)}>
          <Text style={styles.day}>{plan.label}</Text>
          <Text style={styles.focus}>{plan.focus}</Text>
          <Text style={styles.meta}>Warm-up: {plan.warmUp}</Text>
          <Text style={styles.meta}>Exercises: {plan.exercises.length}</Text>
          <Text style={styles.link}>Open detail</Text>
        </Pressable>
      ))}
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
    borderRadius: 14,
    padding: 12,
    gap: 6,
  },
  day: {
    fontWeight: '700',
    fontSize: 16,
    color: '#0f172a',
  },
  focus: {
    fontWeight: '600',
    color: '#1d4ed8',
  },
  meta: {
    color: '#475569',
  },
  link: {
    marginTop: 4,
    color: '#2563eb',
    fontWeight: '600',
  },
});
