import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { WorkoutDayPlan } from '../types';
import { useEditModeStore } from '../../../stores/editMode.store';
import { useWorkoutLibraryStore } from '../../../stores/workoutLibrary.store';

type WorkoutLibraryScreenProps = {
  onStartDay: (day: WorkoutDayPlan) => void;
  onOpenEditor: (dayId?: string) => void;
};

export const WorkoutLibraryScreen = ({ onStartDay, onOpenEditor }: WorkoutLibraryScreenProps) => {
  const plans = useWorkoutLibraryStore((state) => state.plans);
  const isEditMode = useEditModeStore((state) => state.isEditMode);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isEditMode ? (
        <Pressable style={styles.editBtn} onPress={() => onOpenEditor()}>
          <Text style={styles.editBtnText}>Add Workout</Text>
        </Pressable>
      ) : null}

      {plans.map((plan) => (
        <Pressable key={plan.id} style={styles.card} onPress={() => onStartDay(plan)}>
          <Text style={styles.day}>{plan.label}</Text>
          <Text style={styles.focus}>{plan.focus}</Text>
          <Text style={styles.meta}>Warm-up: {plan.warmUp}</Text>
          <Text style={styles.meta}>Exercises: {plan.exercises.length}</Text>
          <View style={styles.footerRow}>
            <Text style={styles.link}>Start workout</Text>
            {isEditMode ? (
              <Pressable style={styles.smallBtn} onPress={() => onOpenEditor(plan.id)}>
                <Text style={styles.smallBtnText}>Edit</Text>
              </Pressable>
            ) : null}
          </View>
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
    color: '#2563eb',
    fontWeight: '600',
  },
  footerRow: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  smallBtn: {
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  smallBtnText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
