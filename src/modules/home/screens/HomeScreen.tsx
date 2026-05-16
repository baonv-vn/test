import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EnergySelector } from '../../../components/feature/EnergySelector';
import { useCookingStore } from '../../../stores/cooking.store';
import { useEditModeStore } from '../../../stores/editMode.store';
import { useEnergyStore } from '../../../stores/energy.store';
import { useScheduleStore } from '../../../stores/schedule.store';
import { useWorkoutStore } from '../../../stores/workout.store';
import type { DayPeriod, ScheduleItem } from '../types';

type HomeScreenProps = {
  onStartWorkout: () => void;
  onStartCooking: () => void;
  onResumeWorkout: () => void;
  onResumeCooking: () => void;
  onOpenScheduleItem: (item: ScheduleItem) => void;
  onOpenScheduleEditor: (itemId?: string) => void;
};

const PERIOD_ORDER: DayPeriod[] = ['Morning', 'Noon', 'Afternoon', 'Evening'];

export const HomeScreen = ({
  onStartWorkout,
  onStartCooking,
  onResumeWorkout,
  onResumeCooking,
  onOpenScheduleItem,
  onOpenScheduleEditor,
}: HomeScreenProps) => {
  const isEditMode = useEditModeStore((state) => state.isEditMode);
  const energy = useEnergyStore((state) => state.energy);
  const setEnergy = useEnergyStore((state) => state.setEnergy);
  const clearEnergy = useEnergyStore((state) => state.clearEnergy);

  const scheduleItems = useScheduleStore((state) => state.items);

  const workoutSavedSession = useWorkoutStore((state) => state.savedSession);
  const cookingSavedSession = useCookingStore((state) => state.savedSession);

  const grouped = useMemo(() => {
    return PERIOD_ORDER.map((period) => ({
      period,
      items: scheduleItems
        .filter((item) => item.period === period)
        .sort((a, b) => a.time.localeCompare(b.time)),
    })).filter((group) => group.items.length > 0);
  }, [scheduleItems]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Energy</Text>
        <EnergySelector energy={energy} onSelect={setEnergy} onClear={clearEnergy} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Quick actions</Text>
        <View style={styles.row}>
          <Pressable style={styles.primaryBtn} onPress={onStartWorkout}>
            <Text style={styles.primaryText}>Start Workout</Text>
          </Pressable>
          <Pressable style={styles.primaryBtn} onPress={onStartCooking}>
            <Text style={styles.primaryText}>Start Cooking</Text>
          </Pressable>
        </View>
        <View style={styles.row}>
          {workoutSavedSession ? (
            <Pressable style={styles.secondaryBtn} onPress={onResumeWorkout}>
              <Text style={styles.secondaryText}>Resume Workout</Text>
            </Pressable>
          ) : null}
          {cookingSavedSession ? (
            <Pressable style={styles.secondaryBtn} onPress={onResumeCooking}>
              <Text style={styles.secondaryText}>Resume Cooking</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Today schedule</Text>
          {isEditMode ? (
            <Pressable onPress={() => onOpenScheduleEditor()}>
              <Text style={styles.linkText}>Add / Edit / Delete</Text>
            </Pressable>
          ) : null}
        </View>
        {grouped.length === 0 ? <Text style={styles.empty}>No schedule items</Text> : null}
        {grouped.map((group) => (
          <View key={group.period} style={styles.groupBlock}>
            <Text style={styles.groupTitle}>{group.period}</Text>
            {group.items.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <View style={styles.itemMain}>
                  <Text style={styles.itemTime}>{item.time}</Text>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemType}>{item.type === 'workout' ? 'Workout' : 'Cooking'}</Text>
                </View>
                <View style={styles.itemActions}>
                  <Pressable onPress={() => onOpenScheduleItem(item)}>
                    <Text style={styles.linkText}>Open</Text>
                  </Pressable>
                  {isEditMode ? (
                    <Pressable onPress={() => onOpenScheduleEditor(item.id)}>
                      <Text style={styles.linkText}>Edit</Text>
                    </Pressable>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 12,
    gap: 10,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: '#0f172a',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  primaryBtn: {
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minWidth: 140,
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
    minWidth: 140,
  },
  secondaryText: {
    color: '#0f172a',
    fontWeight: '700',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  groupBlock: {
    gap: 8,
  },
  groupTitle: {
    color: '#1d4ed8',
    fontWeight: '700',
  },
  itemCard: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  itemMain: {
    flex: 1,
  },
  itemActions: {
    gap: 6,
    alignItems: 'flex-end',
  },
  itemTime: {
    color: '#1d4ed8',
    fontWeight: '700',
  },
  itemTitle: {
    color: '#0f172a',
    fontWeight: '600',
  },
  itemType: {
    color: '#64748b',
    fontSize: 12,
  },
  linkText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  empty: {
    color: '#64748b',
  },
});
