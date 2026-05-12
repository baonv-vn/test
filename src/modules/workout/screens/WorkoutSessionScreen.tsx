import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useMemo } from 'react';
import { useWorkoutStore } from '../../../stores/workout.store';
import { TimerText } from '../../../components/ui/TimerText';

type WorkoutSessionScreenProps = {
  onBackToLibrary: () => void;
};

export const WorkoutSessionScreen = ({ onBackToLibrary }: WorkoutSessionScreenProps) => {
  const status = useWorkoutStore((state) => state.status);
  const phase = useWorkoutStore((state) => state.phase);
  const workoutId = useWorkoutStore((state) => state.workoutId);
  const workouts = useWorkoutStore((state) => state.workouts);
  const exerciseIndex = useWorkoutStore((state) => state.exerciseIndex);
  const setIndex = useWorkoutStore((state) => state.setIndex);
  const restEndsAt = useWorkoutStore((state) => state.restEndsAt);
  const completeSet = useWorkoutStore((state) => state.completeSet);
  const finishRest = useWorkoutStore((state) => state.finishRest);
  const skipExercise = useWorkoutStore((state) => state.skipExercise);
  const endWorkout = useWorkoutStore((state) => state.endWorkout);

  const workout = useMemo(
    () => workouts.find((item) => item.id === workoutId),
    [workoutId, workouts]
  );
  const exercise = workout?.exercises[exerciseIndex];

  if (status !== 'active' || !workout || !exercise) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyTitle}>No active workout session</Text>
        <Pressable style={styles.primaryBtn} onPress={onBackToLibrary}>
          <Text style={styles.primaryText}>Back to workout library</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{workout.name}</Text>
      <Text style={styles.subtitle}>
        {exercise.name} • Set {setIndex + 1}/{exercise.sets}
      </Text>

      {phase === 'RESTING' ? (
        <View style={styles.timerCard}>
          <Text style={styles.timerLabel}>Rest timer</Text>
          <TimerText endsAt={restEndsAt} style={styles.timerValue} />
          <Pressable style={styles.primaryBtn} onPress={finishRest}>
            <Text style={styles.primaryText}>Skip rest</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable style={styles.primaryBtn} onPress={completeSet}>
          <Text style={styles.primaryText}>Complete set</Text>
        </Pressable>
      )}

      <View style={styles.row}>
        <Pressable style={styles.secondaryBtn} onPress={skipExercise}>
          <Text style={styles.secondaryText}>Skip exercise</Text>
        </Pressable>
        <Pressable style={styles.secondaryBtn} onPress={endWorkout}>
          <Text style={styles.secondaryText}>Finish workout</Text>
        </Pressable>
      </View>

      <Pressable style={styles.linkBtn} onPress={onBackToLibrary}>
        <Text style={styles.linkText}>Back to library</Text>
      </Pressable>
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
  subtitle: {
    color: '#475569',
    fontWeight: '600',
  },
  timerCard: {
    backgroundColor: '#fff7ed',
    borderColor: '#fed7aa',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  timerLabel: {
    color: '#9a3412',
    fontWeight: '700',
  },
  timerValue: {
    fontSize: 30,
    fontWeight: '700',
    color: '#9a3412',
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
  linkBtn: {
    alignSelf: 'flex-start',
  },
  linkText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  emptyWrap: {
    gap: 10,
  },
  emptyTitle: {
    color: '#475569',
    fontWeight: '600',
  },
});
