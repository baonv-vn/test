import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useEditModeStore } from '../../../stores/editMode.store';
import { useScheduleStore } from '../../../stores/schedule.store';
import type { DayPeriod, ScheduleItem } from '../types';

const PERIODS: DayPeriod[] = ['Morning', 'Noon', 'Evening'];

export const HomeScreen = () => {
  const isEditMode = useEditModeStore((state) => state.isEditMode);
  const items = useScheduleStore((state) => state.items);
  const addItem = useScheduleStore((state) => state.addItem);
  const editItem = useScheduleStore((state) => state.editItem);
  const deleteItem = useScheduleStore((state) => state.deleteItem);

  const [formPeriod, setFormPeriod] = useState<DayPeriod>('Morning');
  const [formType, setFormType] = useState<'workout' | 'cooking'>('workout');
  const [formTime, setFormTime] = useState('08:00');
  const [formTitle, setFormTitle] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);

  const grouped = useMemo(() => {
    return PERIODS.map((period) => ({
      period,
      items: items.filter((item) => item.period === period),
    }));
  }, [items]);

  const resetForm = () => {
    setFormPeriod('Morning');
    setFormType('workout');
    setFormTime('08:00');
    setFormTitle('');
  };

  const submitNewItem = () => {
    if (!isEditMode || !formTitle.trim()) {
      return;
    }
    addItem({
      period: formPeriod,
      type: formType,
      time: formTime,
      title: formTitle.trim(),
    });
    resetForm();
  };

  const submitEdit = (item: ScheduleItem) => {
    if (!isEditMode || !formTitle.trim()) {
      return;
    }
    editItem(item.id, {
      period: formPeriod,
      type: formType,
      time: formTime,
      title: formTitle.trim(),
    });
    setEditingId(null);
    resetForm();
  };

  const startEdit = (item: ScheduleItem) => {
    setEditingId(item.id);
    setFormPeriod(item.period);
    setFormType(item.type);
    setFormTime(item.time);
    setFormTitle(item.title);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.description}>Today timeline tracker (read-only by default)</Text>

      {grouped.map((group) => (
        <View key={group.period} style={styles.block}>
          <Text style={styles.blockTitle}>{group.period}</Text>
          {group.items.length === 0 ? <Text style={styles.empty}>No scheduled items</Text> : null}
          {group.items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemMain}>
                <Text style={styles.itemTime}>{item.time}</Text>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemType}>{item.type === 'workout' ? 'Workout block' : 'Cooking block'}</Text>
              </View>
              {isEditMode ? (
                <View style={styles.inlineActions}>
                  <Pressable style={styles.smallBtn} onPress={() => startEdit(item)}>
                    <Text style={styles.smallBtnText}>Edit</Text>
                  </Pressable>
                  <Pressable style={[styles.smallBtn, styles.danger]} onPress={() => deleteItem(item.id)}>
                    <Text style={styles.smallBtnText}>Delete</Text>
                  </Pressable>
                </View>
              ) : null}
            </View>
          ))}
        </View>
      ))}

      {isEditMode ? (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>{editingId ? 'Edit schedule item' : 'Add schedule item'}</Text>
          <TextInput style={styles.input} value={formTitle} onChangeText={setFormTitle} placeholder="Title" />
          <TextInput style={styles.input} value={formTime} onChangeText={setFormTime} placeholder="Time (HH:mm)" />

          <View style={styles.segmentRow}>
            {PERIODS.map((period) => (
              <Pressable
                key={period}
                style={[styles.segment, formPeriod === period && styles.segmentActive]}
                onPress={() => setFormPeriod(period)}
              >
                <Text style={styles.segmentText}>{period}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.segmentRow}>
            {(['workout', 'cooking'] as const).map((type) => (
              <Pressable
                key={type}
                style={[styles.segment, formType === type && styles.segmentActive]}
                onPress={() => setFormType(type)}
              >
                <Text style={styles.segmentText}>{type}</Text>
              </Pressable>
            ))}
          </View>

          {editingId ? (
            <View style={styles.formActions}>
              <Pressable
                style={styles.actionBtn}
                onPress={() => {
                  const current = items.find((item) => item.id === editingId);
                  if (current) {
                    submitEdit(current);
                  }
                }}
              >
                <Text style={styles.actionBtnText}>Save</Text>
              </Pressable>
              <Pressable style={styles.actionBtnSecondary} onPress={() => setEditingId(null)}>
                <Text style={styles.actionBtnTextSecondary}>Cancel</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.actionBtn} onPress={submitNewItem}>
              <Text style={styles.actionBtnText}>Add schedule item</Text>
            </Pressable>
          )}
        </View>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 14,
    paddingBottom: 24,
  },
  description: {
    fontSize: 14,
    color: '#475569',
  },
  block: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    gap: 10,
  },
  blockTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  empty: {
    color: '#64748b',
  },
  itemCard: {
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  itemMain: {
    flex: 1,
    gap: 2,
  },
  itemTime: {
    fontWeight: '700',
    color: '#1d4ed8',
  },
  itemTitle: {
    fontWeight: '600',
    color: '#0f172a',
  },
  itemType: {
    color: '#475569',
    fontSize: 12,
  },
  inlineActions: {
    flexDirection: 'row',
    gap: 6,
  },
  smallBtn: {
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  danger: {
    backgroundColor: '#b91c1c',
  },
  smallBtnText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    gap: 10,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  segment: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  segmentActive: {
    backgroundColor: '#e2e8f0',
  },
  segmentText: {
    color: '#0f172a',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  formActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  actionBtnText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  actionBtnSecondary: {
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  actionBtnTextSecondary: {
    color: '#0f172a',
    fontWeight: '700',
  },
});
