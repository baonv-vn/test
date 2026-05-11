import { StyleSheet, Text, View } from 'react-native';
import type { WorkoutTemplate } from '../../types/workout';
import { PrimaryButton } from '../ui/PrimaryButton';

type WorkoutCardProps = {
  workout: WorkoutTemplate;
  onStart: (workout: WorkoutTemplate) => void;
};

export const WorkoutCard = ({ workout, onStart }: WorkoutCardProps) => (
  <View style={styles.card}>
    <Text style={styles.title}>{workout.name}</Text>
    <Text style={styles.subtitle}>
      {workout.exercises.length} exercises · Min energy {workout.minEnergy}
    </Text>
    <PrimaryButton label="Start workout" onPress={() => onStart(workout)} />
  </View>
);

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 13,
    color: '#4b5563',
  },
});
