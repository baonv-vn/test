import { StyleSheet, Text, View } from 'react-native';
import type { WorkoutRoutine } from './types';

type WorkoutLibraryListProps = {
  routines: WorkoutRoutine[];
};

const categoryLabel: Record<WorkoutRoutine['category'], string> = {
  push: 'Push',
  pull: 'Pull',
  legs: 'Legs',
  core: 'Core',
};

export const WorkoutLibraryList = ({ routines }: WorkoutLibraryListProps) => (
  <View style={styles.wrapper}>
    {routines.map((routine) => (
      <View key={routine.id} style={styles.card}>
        <Text style={styles.title}>{routine.name}</Text>
        <Text style={styles.sub}>{`Nhóm: ${categoryLabel[routine.category]}`}</Text>
        {routine.exercises.map((exercise) => (
          <Text key={exercise.id} style={styles.item}>
            {`• ${exercise.name} — ${exercise.sets} hiệp x ${exercise.reps} reps, nghỉ ${exercise.restSeconds}s`}
          </Text>
        ))}
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    gap: 10,
  },
  card: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  sub: {
    fontSize: 13,
    color: '#4b5563',
  },
  item: {
    fontSize: 13,
    color: '#374151',
  },
});
