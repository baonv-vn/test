import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useCallback, useEffect, useMemo } from 'react';
import { useEnergyStore } from '../stores/energy.store';
import { useWorkoutStore } from '../stores/workout.store';
import { useSessionTimer } from '../hooks/useSessionTimer';
import { formatSeconds } from '../utils/format';
import { isEnergyAllowed } from '../utils/energy';
import { LoadingCard } from '../components/ui/LoadingCard';
import { EmptyStateCard } from '../components/ui/EmptyStateCard';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { WorkoutCard } from '../components/feature/WorkoutCard';
import type { WorkoutTemplate } from '../types/workout';

export const WorkoutScreen = () => {
  const energy = useEnergyStore((state) => state.energy);
  const status = useWorkoutStore((state) => state.status);
  const phase = useWorkoutStore((state) => state.phase);
  const workouts = useWorkoutStore((state) => state.workouts);
  const workoutId = useWorkoutStore((state) => state.workoutId);
  const exerciseIndex = useWorkoutStore((state) => state.exerciseIndex);
  const setIndex = useWorkoutStore((state) => state.setIndex);
  const restSessionId = useWorkoutStore((state) => state.restSessionId);
  const restDuration = useWorkoutStore((state) => state.restDuration ?? 0);
  const completedWorkoutId = useWorkoutStore((state) => state.completedWorkoutId);
  const savedSession = useWorkoutStore((state) => state.savedSession);
  const loadWorkouts = useWorkoutStore((state) => state.loadWorkouts);
  const startWorkout = useWorkoutStore((state) => state.startWorkout);
  const completeSet = useWorkoutStore((state) => state.completeSet);
  const finishRest = useWorkoutStore((state) => state.finishRest);
  const skipExercise = useWorkoutStore((state) => state.skipExercise);
  const endWorkout = useWorkoutStore((state) => state.endWorkout);
  const resume = useWorkoutStore((state) => state.resume);

  useEffect(() => {
    if (status === 'idle' && workouts.length === 0) {
      loadWorkouts();
    }
  }, [status, workouts.length, loadWorkouts]);

  const filteredWorkouts = useMemo(() => {
    if (!energy) {
      return [];
    }
    return workouts.filter((workout) => isEnergyAllowed(energy, workout.minEnergy));
  }, [energy, workouts]);

  const currentWorkout = workouts.find((item) => item.id === workoutId);
  const currentExercise = currentWorkout?.exercises[exerciseIndex];

  const { remainingSeconds } = useSessionTimer({
    sessionId: restSessionId,
    durationSeconds: restDuration,
    onComplete: finishRest,
  });

  const handleStartWorkout = useCallback(
    (workout: WorkoutTemplate) => {
      startWorkout(workout);
    },
    [startWorkout]
  );

  const renderWorkoutItem = useCallback(
    ({ item }: { item: WorkoutTemplate }) => (
      <WorkoutCard workout={item} onStart={handleStartWorkout} />
    ),
    [handleStartWorkout]
  );

  if (!energy) {
    return (
      <EmptyStateCard
        title="Select energy"
        message="Choose an energy state to see workouts."
      />
    );
  }

  if (status === 'loading') {
    return <LoadingCard message="Loading workouts" />;
  }

  if (status === 'active' && currentWorkout && currentExercise) {
    return (
      <View style={styles.session}>
        <Text style={styles.heading}>{currentWorkout.name}</Text>
        <Text style={styles.subheading}>
          {currentExercise.name} · Set {setIndex + 1} of {currentExercise.sets}
        </Text>
        {phase === 'RESTING' ? (
          <View style={styles.timerCard}>
            <Text style={styles.timerLabel}>Rest</Text>
            <Text style={styles.timerValue}>{formatSeconds(remainingSeconds)}</Text>
            <PrimaryButton label="Skip rest" onPress={finishRest} />
          </View>
        ) : (
          <PrimaryButton label="Complete set" onPress={completeSet} />
        )}
        <View style={styles.actionRow}>
          <PrimaryButton label="Skip exercise" onPress={skipExercise} variant="secondary" />
          <PrimaryButton label="End workout" onPress={endWorkout} variant="secondary" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      {savedSession ? <PrimaryButton label="Resume workout" onPress={resume} /> : null}
      {completedWorkoutId ? (
        <EmptyStateCard
          title="Workout complete"
          message="Nice work. Pick another workout when ready."
        />
      ) : null}
      {filteredWorkouts.length === 0 ? (
        <EmptyStateCard
          title="No workouts match"
          message="Try a different energy level or reset your energy state."
        />
      ) : (
        <FlatList
          data={filteredWorkouts}
          keyExtractor={(item) => item.id}
          renderItem={renderWorkoutItem}
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
  subheading: {
    fontSize: 14,
    color: '#4b5563',
  },
  timerCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#fef3c7',
    gap: 8,
  },
  timerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
  },
  timerValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#92400e',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
});
