import { StyleSheet, Text, View } from 'react-native';
import type { ScheduleItem } from '../../modules/timeline/types';
import { PrimaryButton } from '../ui/PrimaryButton';

type TimelineItemCardProps = {
  item: ScheduleItem;
  isActive: boolean;
  onStart: (id: string) => void;
  onDone: (id: string) => void;
};

const typeLabel: Record<ScheduleItem['type'], string> = {
  workout: 'Tập luyện',
  cooking: 'Nấu ăn',
  study: 'Học tập',
  rest: 'Nghỉ ngơi',
};

const statusLabel: Record<ScheduleItem['status'], string> = {
  pending: 'Chờ',
  active: 'Đang diễn ra',
  done: 'Hoàn thành',
};

export const TimelineItemCard = ({ item, isActive, onStart, onDone }: TimelineItemCardProps) => (
  <View style={[styles.card, isActive ? styles.activeCard : null]}>
    <View style={styles.header}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.badge}>{statusLabel[item.status]}</Text>
    </View>
    <Text style={styles.meta}>{`${item.startTime} - ${item.endTime} • ${typeLabel[item.type]}`}</Text>
    <View style={styles.actions}>
      {item.status !== 'done' ? (
        <PrimaryButton label="Bắt đầu" variant="secondary" onPress={() => onStart(item.id)} style={styles.flex} />
      ) : null}
      {item.status !== 'done' ? (
        <PrimaryButton label="Đánh dấu xong" onPress={() => onDone(item.id)} style={styles.flex} />
      ) : null}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    padding: 12,
    gap: 8,
  },
  activeCard: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  badge: {
    fontSize: 12,
    color: '#1d4ed8',
    fontWeight: '600',
  },
  meta: {
    fontSize: 13,
    color: '#4b5563',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  flex: {
    flex: 1,
  },
});
