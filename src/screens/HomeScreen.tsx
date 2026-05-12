import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { useScheduleStore } from '../store/schedule.store';
import { useTimelineClock } from '../store/useTimelineClock';
import { TimelineItemCard } from '../components/timeline/TimelineItemCard';
import { TimelineActivePanel } from '../modules/timeline/TimelineActivePanel';
import { useWorkoutStore } from '../store/workout.store';
import { useRecipeStore } from '../store/recipe.store';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { formatClock } from '../modules/timeline/time';

type HomeScreenProps = {
  onOpenSettings: () => void;
};

export const HomeScreen = ({ onOpenSettings }: HomeScreenProps) => {
  useTimelineClock();

  const now = useScheduleStore((state) => state.now);
  const items = useScheduleStore((state) => state.items);
  const activeTask = useScheduleStore((state) => state.activeTask);
  const startTask = useScheduleStore((state) => state.startTask);
  const markDone = useScheduleStore((state) => state.markDone);
  const routines = useWorkoutStore((state) => state.routines);
  const recipes = useRecipeStore((state) => state.recipes);

  const activeWorkout = activeTask?.type === 'workout'
    ? routines.find((routine) => routine.id === activeTask.workoutId) ?? routines[0]
    : undefined;
  const activeRecipe = activeTask?.type === 'cooking'
    ? recipes.find((recipe) => recipe.id === activeTask.recipeId) ?? recipes[0]
    : undefined;

  return (
    <ScreenContainer scroll>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Daily Timeline</Text>
          <Text style={styles.subTitle}>{`Giờ hiện tại: ${formatClock(now)}`}</Text>
        </View>
        <PrimaryButton label="⚙️" variant="secondary" onPress={onOpenSettings} />
      </View>

      <Text style={styles.sectionTitle}>Tác vụ đang hoạt động</Text>
      <TimelineActivePanel
        item={activeTask}
        workout={activeWorkout}
        recipe={activeRecipe}
        onComplete={markDone}
      />

      <Text style={styles.sectionTitle}>Lịch trình trong ngày (Chế độ xem)</Text>
      <View style={styles.list}>
        {items.map((item) => (
          <TimelineItemCard
            key={item.id}
            item={item}
            isActive={activeTask?.id === item.id}
            onStart={startTask}
            onDone={markDone}
          />
        ))}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subTitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#4b5563',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginTop: 4,
  },
  list: {
    gap: 8,
  },
});
