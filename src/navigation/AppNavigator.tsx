import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { HomeScreen } from '../modules/home/screens/HomeScreen';
import { WorkoutLibraryScreen } from '../modules/workout/screens/WorkoutLibraryScreen';
import { CookingLibraryScreen } from '../modules/cooking/screens/CookingLibraryScreen';
import { WorkoutSessionScreen } from '../modules/workout/screens/WorkoutSessionScreen';
import { CookingSessionScreen } from '../modules/cooking/screens/CookingSessionScreen';
import { WorkoutEditorScreen } from '../modules/workout/screens/WorkoutEditorScreen';
import { RecipeEditorScreen } from '../modules/cooking/screens/RecipeEditorScreen';
import { ScheduleEditorScreen } from '../modules/home/screens/ScheduleEditorScreen';
import { ScheduleDetailScreen } from '../modules/home/screens/ScheduleDetailScreen';
import { useEditModeStore } from '../stores/editMode.store';
import type { ScheduleItem } from '../modules/home/types';
import type { WorkoutDayPlan } from '../modules/workout/types';
import type { Recipe } from '../modules/cooking/types';
import { useWorkoutLibraryStore } from '../stores/workoutLibrary.store';
import { useRecipeLibraryStore } from '../stores/recipeLibrary.store';
import { toRuntimeWorkoutTemplate } from '../modules/workout/runtime';
import { useWorkoutStore } from '../stores/workout.store';
import { toRuntimeRecipeTemplate } from '../modules/cooking/runtime';
import { useCookingStore } from '../stores/cooking.store';
import { useScheduleStore } from '../stores/schedule.store';

type DrawerRoute = 'Home' | 'Workout Library' | 'Cooking Library';

type StackScreen =
  | { key: 'NONE' }
  | { key: 'WORKOUT_SESSION' }
  | { key: 'COOKING_SESSION' }
  | { key: 'WORKOUT_EDITOR'; dayId?: string }
  | { key: 'RECIPE_EDITOR'; recipeId?: string }
  | { key: 'SCHEDULE_EDITOR'; itemId?: string }
  | { key: 'SCHEDULE_DETAIL'; itemId: string };

export const AppNavigator = () => {
  const [activeRoute, setActiveRoute] = useState<DrawerRoute>('Home');
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [stackScreen, setStackScreen] = useState<StackScreen>({ key: 'NONE' });

  const isEditMode = useEditModeStore((state) => state.isEditMode);
  const toggleEditMode = useEditModeStore((state) => state.toggleEditMode);

  const workoutPlans = useWorkoutLibraryStore((state) => state.plans);
  const recipes = useRecipeLibraryStore((state) => state.recipes);
  const scheduleItems = useScheduleStore((state) => state.items);

  const startWorkout = useWorkoutStore((state) => state.startWorkout);
  const resumeWorkout = useWorkoutStore((state) => state.resume);
  const startCooking = useCookingStore((state) => state.startCooking);
  const resumeCooking = useCookingStore((state) => state.resume);

  const title = useMemo(() => {
    if (stackScreen.key === 'WORKOUT_SESSION') return 'Workout Session';
    if (stackScreen.key === 'COOKING_SESSION') return 'Cooking Session';
    if (stackScreen.key === 'WORKOUT_EDITOR') return 'Workout Editor';
    if (stackScreen.key === 'RECIPE_EDITOR') return 'Recipe Editor';
    if (stackScreen.key === 'SCHEDULE_EDITOR') return 'Schedule Editor';
    if (stackScreen.key === 'SCHEDULE_DETAIL') return 'Schedule Detail';
    return activeRoute;
  }, [activeRoute, stackScreen.key]);

  const hydrateWorkoutRuntime = () => {
    useWorkoutStore.setState({ workouts: workoutPlans.map(toRuntimeWorkoutTemplate) });
  };

  const hydrateCookingRuntime = () => {
    useCookingStore.setState({ recipes: recipes.map(toRuntimeRecipeTemplate) });
  };

  const beginWorkoutFromPlan = async (plan: WorkoutDayPlan) => {
    hydrateWorkoutRuntime();
    await startWorkout(toRuntimeWorkoutTemplate(plan));
    setStackScreen({ key: 'WORKOUT_SESSION' });
  };

  const beginCookingFromRecipe = async (recipe: Recipe) => {
    hydrateCookingRuntime();
    await startCooking(toRuntimeRecipeTemplate(recipe));
    setStackScreen({ key: 'COOKING_SESSION' });
  };

  const openRoute = (route: DrawerRoute) => {
    setActiveRoute(route);
    setStackScreen({ key: 'NONE' });
    setDrawerOpen(false);
  };

  const openScheduleItem = async (item: ScheduleItem) => {
    if (item.type === 'workout' && item.linkedWorkoutId) {
      const workout = workoutPlans.find((entry) => entry.id === item.linkedWorkoutId);
      if (workout) {
        setActiveRoute('Workout Library');
        await beginWorkoutFromPlan(workout);
        return;
      }
    }

    if (item.type === 'cooking' && item.linkedRecipeId) {
      const recipe = recipes.find((entry) => entry.id === item.linkedRecipeId);
      if (recipe) {
        setActiveRoute('Cooking Library');
        await beginCookingFromRecipe(recipe);
        return;
      }
    }

    setStackScreen({ key: 'SCHEDULE_DETAIL', itemId: item.id });
  };

  const scheduleDetailItem =
    stackScreen.key === 'SCHEDULE_DETAIL'
      ? scheduleItems.find((item) => item.id === stackScreen.itemId)
      : undefined;

  const content = (() => {
    if (stackScreen.key === 'WORKOUT_SESSION') {
      return (
        <WorkoutSessionScreen
          onBackToLibrary={() => {
            setActiveRoute('Workout Library');
            setStackScreen({ key: 'NONE' });
          }}
        />
      );
    }

    if (stackScreen.key === 'COOKING_SESSION') {
      return (
        <CookingSessionScreen
          onBackToLibrary={() => {
            setActiveRoute('Cooking Library');
            setStackScreen({ key: 'NONE' });
          }}
        />
      );
    }

    if (stackScreen.key === 'WORKOUT_EDITOR') {
      return (
        <WorkoutEditorScreen
          dayId={stackScreen.dayId}
          onBack={() => {
            setActiveRoute('Workout Library');
            setStackScreen({ key: 'NONE' });
          }}
        />
      );
    }

    if (stackScreen.key === 'RECIPE_EDITOR') {
      return (
        <RecipeEditorScreen
          recipeId={stackScreen.recipeId}
          onBack={() => {
            setActiveRoute('Cooking Library');
            setStackScreen({ key: 'NONE' });
          }}
        />
      );
    }

    if (stackScreen.key === 'SCHEDULE_EDITOR') {
      return (
        <ScheduleEditorScreen
          itemId={stackScreen.itemId}
          onBack={() => {
            setActiveRoute('Home');
            setStackScreen({ key: 'NONE' });
          }}
        />
      );
    }

    if (stackScreen.key === 'SCHEDULE_DETAIL' && scheduleDetailItem) {
      return (
        <ScheduleDetailScreen
          item={scheduleDetailItem}
          onBack={() => setStackScreen({ key: 'NONE' })}
        />
      );
    }

    if (activeRoute === 'Home') {
      return (
        <HomeScreen
          onStartWorkout={() => {
            setActiveRoute('Workout Library');
            setStackScreen({ key: 'NONE' });
          }}
          onStartCooking={() => {
            setActiveRoute('Cooking Library');
            setStackScreen({ key: 'NONE' });
          }}
          onResumeWorkout={() => {
            hydrateWorkoutRuntime();
            resumeWorkout();
            setActiveRoute('Workout Library');
            setStackScreen({ key: 'WORKOUT_SESSION' });
          }}
          onResumeCooking={() => {
            hydrateCookingRuntime();
            resumeCooking();
            setActiveRoute('Cooking Library');
            setStackScreen({ key: 'COOKING_SESSION' });
          }}
          onOpenScheduleItem={(item) => {
            void openScheduleItem(item);
          }}
          onOpenScheduleEditor={(itemId) => setStackScreen({ key: 'SCHEDULE_EDITOR', itemId })}
        />
      );
    }

    if (activeRoute === 'Workout Library') {
      return (
        <WorkoutLibraryScreen
          onStartDay={(day) => {
            void beginWorkoutFromPlan(day);
          }}
          onOpenEditor={(dayId) => setStackScreen({ key: 'WORKOUT_EDITOR', dayId })}
        />
      );
    }

    return (
      <CookingLibraryScreen
        onStartRecipe={(recipe) => {
          void beginCookingFromRecipe(recipe);
        }}
        onOpenEditor={(recipeId) => setStackScreen({ key: 'RECIPE_EDITOR', recipeId })}
      />
    );
  })();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.headerActions}>
          <Pressable style={styles.editToggle} onPress={toggleEditMode}>
            <Text style={styles.editToggleText}>{isEditMode ? 'EDIT ON' : 'EDIT OFF'}</Text>
          </Pressable>
          <Pressable style={styles.drawerButton} onPress={() => setDrawerOpen((prev) => !prev)}>
            <Text style={styles.drawerButtonText}>☰</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.content}>{content}</View>

      <Modal visible={isDrawerOpen} transparent animationType="fade" onRequestClose={() => setDrawerOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setDrawerOpen(false)}>
          <Pressable style={styles.drawerPanel} onPress={() => undefined}>
            {(['Home', 'Workout Library', 'Cooking Library'] as DrawerRoute[]).map((route) => (
              <Pressable
                key={route}
                onPress={() => openRoute(route)}
                style={[styles.drawerItem, activeRoute === route && styles.drawerItemActive]}
              >
                <Text style={styles.drawerItemText}>{route}</Text>
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editToggle: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#111827',
  },
  editToggleText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  drawerButton: {
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#e2e8f0',
  },
  drawerButtonText: {
    color: '#111827',
    fontWeight: '700',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.35)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  drawerPanel: {
    width: 250,
    marginTop: 70,
    marginRight: 12,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    padding: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  drawerItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  drawerItemActive: {
    backgroundColor: '#e2e8f0',
  },
  drawerItemText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },
});
