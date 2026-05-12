import { StyleSheet, Text, View } from 'react-native';
import type { Recipe } from '../cooking/types';
import { CookingTaskPanel } from '../cooking/CookingTaskPanel';
import type { ScheduleItem } from './types';
import type { WorkoutRoutine } from '../workout/types';
import { WorkoutTaskPanel } from '../workout/WorkoutTaskPanel';

type TimelineActivePanelProps = {
  item?: ScheduleItem;
  workout?: WorkoutRoutine;
  recipe?: Recipe;
  onComplete: (id: string) => void;
};

export const TimelineActivePanel = ({ item, workout, recipe, onComplete }: TimelineActivePanelProps) => {
  if (!item) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Hiện không có tác vụ nào đang hoạt động</Text>
        <Text style={styles.text}>Hệ thống sẽ tự kích hoạt theo khung giờ tiếp theo.</Text>
      </View>
    );
  }

  if (item.type === 'workout') {
    return <WorkoutTaskPanel routine={workout} onComplete={() => onComplete(item.id)} />;
  }

  if (item.type === 'cooking') {
    return <CookingTaskPanel recipe={recipe} onComplete={() => onComplete(item.id)} />;
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>{item.type === 'study' ? 'Chế độ học tập đang hoạt động.' : 'Chế độ nghỉ ngơi đang hoạt động.'}</Text>
      <Text style={styles.text}>{`${item.startTime} - ${item.endTime}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    padding: 12,
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  text: {
    fontSize: 13,
    color: '#4b5563',
  },
});
