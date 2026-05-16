import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRecipeLibraryStore } from '../../../stores/recipeLibrary.store';
import { useScheduleStore } from '../../../stores/schedule.store';
import { useWorkoutLibraryStore } from '../../../stores/workoutLibrary.store';
import type { DayPeriod, ScheduleItem } from '../types';

type ScheduleEditorScreenProps = {
  itemId?: string;
  onBack: () => void;
};

const PERIODS: DayPeriod[] = ['Morning', 'Noon', 'Afternoon', 'Evening'];

export const ScheduleEditorScreen = ({ itemId, onBack }: ScheduleEditorScreenProps) => {
  const items = useScheduleStore((state) => state.items);
  const addItem = useScheduleStore((state) => state.addItem);
  const editItem = useScheduleStore((state) => state.editItem);
  const deleteItem = useScheduleStore((state) => state.deleteItem);

  const workoutPlans = useWorkoutLibraryStore((state) => state.plans);
  const recipes = useRecipeLibraryStore((state) => state.recipes);

  const item = useMemo(() => items.find((entry) => entry.id === itemId), [items, itemId]);

  const [title, setTitle] = useState(item?.title ?? '');
  const [time, setTime] = useState(item?.time ?? '08:00');
  const [period, setPeriod] = useState<DayPeriod>(item?.period ?? 'Morning');
  const [type, setType] = useState<'workout' | 'cooking'>(item?.type ?? 'workout');
  const [linkedWorkoutId, setLinkedWorkoutId] = useState(item?.linkedWorkoutId ?? '');
  const [linkedRecipeId, setLinkedRecipeId] = useState(item?.linkedRecipeId ?? '');

  const save = () => {
    if (!title.trim()) {
      return;
    }
    const payload: Omit<ScheduleItem, 'id'> = {
      period,
      time,
      type,
      title: title.trim(),
      linkedWorkoutId: type === 'workout' && linkedWorkoutId ? linkedWorkoutId : undefined,
      linkedRecipeId: type === 'cooking' && linkedRecipeId ? linkedRecipeId : undefined,
    };

    if (item?.id) {
      editItem(item.id, payload);
      return;
    }
    addItem(payload);
    onBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable style={styles.linkBtn} onPress={onBack}>
        <Text style={styles.linkText}>← Back</Text>
      </Pressable>

      <View style={styles.card}>
        <Text style={styles.title}>{item?.id ? 'Edit schedule item' : 'Create schedule item'}</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Title" />
        <TextInput style={styles.input} value={time} onChangeText={setTime} placeholder="Time (HH:mm)" />

        <View style={styles.row}>
          {PERIODS.map((value) => (
            <Pressable
              key={value}
              style={[styles.segmentBtn, period === value && styles.segmentBtnActive]}
              onPress={() => setPeriod(value)}
            >
              <Text style={styles.segmentText}>{value}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.row}>
          {(['workout', 'cooking'] as const).map((value) => (
            <Pressable
              key={value}
              style={[styles.segmentBtn, type === value && styles.segmentBtnActive]}
              onPress={() => setType(value)}
            >
              <Text style={styles.segmentText}>{value}</Text>
            </Pressable>
          ))}
        </View>

        {type === 'workout' ? (
          <View style={styles.selectorWrap}>
            <Text style={styles.selectorLabel}>Assign workout (optional)</Text>
            {workoutPlans.map((plan) => (
              <Pressable
                key={plan.id}
                style={[styles.selectorBtn, linkedWorkoutId === plan.id && styles.selectorBtnActive]}
                onPress={() => setLinkedWorkoutId((prev) => (prev === plan.id ? '' : plan.id))}
              >
                <Text style={styles.selectorText}>{plan.label} • {plan.focus}</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.selectorWrap}>
            <Text style={styles.selectorLabel}>Assign recipe (optional)</Text>
            {recipes.map((recipe) => (
              <Pressable
                key={recipe.id}
                style={[styles.selectorBtn, linkedRecipeId === recipe.id && styles.selectorBtnActive]}
                onPress={() => setLinkedRecipeId((prev) => (prev === recipe.id ? '' : recipe.id))}
              >
                <Text style={styles.selectorText}>{recipe.name}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <View style={styles.row}>
          <Pressable style={styles.primaryBtn} onPress={save}>
            <Text style={styles.primaryText}>Save schedule item</Text>
          </Pressable>
          {item?.id ? (
            <Pressable
              style={styles.dangerBtn}
              onPress={() => {
                deleteItem(item.id);
                onBack();
              }}
            >
              <Text style={styles.primaryText}>Delete</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
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
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
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
  row: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  segmentBtn: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  segmentBtnActive: {
    backgroundColor: '#e2e8f0',
  },
  segmentText: {
    color: '#0f172a',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  selectorWrap: {
    gap: 6,
  },
  selectorLabel: {
    color: '#334155',
    fontWeight: '600',
  },
  selectorBtn: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
  },
  selectorBtnActive: {
    backgroundColor: '#e2e8f0',
  },
  selectorText: {
    color: '#0f172a',
    fontWeight: '600',
  },
  primaryBtn: {
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  dangerBtn: {
    backgroundColor: '#b91c1c',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  primaryText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  linkBtn: {
    alignSelf: 'flex-start',
  },
  linkText: {
    color: '#2563eb',
    fontWeight: '600',
  },
});
