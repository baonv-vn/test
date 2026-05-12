import { StyleSheet, Text, View } from 'react-native';
import type { WorkoutRoutine } from './types';
import { PrimaryButton } from '../../components/ui/PrimaryButton';

type WorkoutTaskPanelProps = {
  routine?: WorkoutRoutine;
  onComplete: () => void;
};

export const WorkoutTaskPanel = ({ routine, onComplete }: WorkoutTaskPanelProps) => {
  if (!routine) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Chưa gắn bài tập</Text>
        <Text style={styles.text}>Hãy chọn workoutId trong chế độ chỉnh sửa.</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{`Đang tập: ${routine.name}`}</Text>
      {routine.exercises.map((exercise) => (
        <Text key={exercise.id} style={styles.text}>
          {`• ${exercise.name}: ${exercise.sets} hiệp x ${exercise.reps} reps (nghỉ ${exercise.restSeconds}s)`}
        </Text>
      ))}
      <PrimaryButton label="Hoàn thành buổi tập" onPress={onComplete} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    backgroundColor: '#eff6ff',
    padding: 12,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e3a8a',
  },
  text: {
    fontSize: 13,
    color: '#1e40af',
  },
});
