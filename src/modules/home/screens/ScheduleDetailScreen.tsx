import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ScheduleItem } from '../types';

type ScheduleDetailScreenProps = {
  item: ScheduleItem;
  onBack: () => void;
};

export const ScheduleDetailScreen = ({ item, onBack }: ScheduleDetailScreenProps) => (
  <View style={styles.container}>
    <Pressable style={styles.linkBtn} onPress={onBack}>
      <Text style={styles.linkText}>← Back</Text>
    </Pressable>

    <View style={styles.card}>
      <Text style={styles.title}>Schedule item detail</Text>
      <Text style={styles.meta}>Title: {item.title}</Text>
      <Text style={styles.meta}>Type: {item.type}</Text>
      <Text style={styles.meta}>Period: {item.period}</Text>
      <Text style={styles.meta}>Time: {item.time}</Text>
      <Text style={styles.note}>No linked workout/recipe is assigned to this item.</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  linkBtn: {
    alignSelf: 'flex-start',
  },
  linkText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    color: '#0f172a',
  },
  meta: {
    color: '#334155',
  },
  note: {
    marginTop: 4,
    color: '#64748b',
  },
});
