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
import { WorkoutDetailScreen } from '../modules/workout/screens/WorkoutDetailScreen';
import { CookingLibraryScreen } from '../modules/cooking/screens/CookingLibraryScreen';
import { RecipeDetailScreen } from '../modules/cooking/screens/RecipeDetailScreen';
import { useEditModeStore } from '../stores/editMode.store';
import type { WorkoutDayPlan } from '../modules/workout/types';
import type { Recipe } from '../modules/cooking/types';

type DrawerRoute = 'Home' | 'Workout Library' | 'Cooking Library';

type StackState = {
  workoutDayId?: string;
  recipeId?: string;
};

export const AppNavigator = () => {
  const [activeRoute, setActiveRoute] = useState<DrawerRoute>('Home');
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [stackState, setStackState] = useState<StackState>({});
  const isEditMode = useEditModeStore((state) => state.isEditMode);
  const toggleEditMode = useEditModeStore((state) => state.toggleEditMode);

  const title = useMemo(() => {
    if (stackState.workoutDayId) return 'Workout Detail';
    if (stackState.recipeId) return 'Recipe Detail';
    return activeRoute;
  }, [activeRoute, stackState.recipeId, stackState.workoutDayId]);

  const openRoute = (route: DrawerRoute) => {
    setActiveRoute(route);
    setStackState({});
    setDrawerOpen(false);
  };

  const content = (() => {
    if (activeRoute === 'Home') {
      return <HomeScreen />;
    }
    if (activeRoute === 'Workout Library') {
      if (stackState.workoutDayId) {
        return (
          <WorkoutDetailScreen
            dayId={stackState.workoutDayId}
            onBack={() => setStackState({})}
          />
        );
      }
      return (
        <WorkoutLibraryScreen
          onOpenDay={(day: WorkoutDayPlan) => setStackState({ workoutDayId: day.id })}
        />
      );
    }
    if (stackState.recipeId) {
      return (
        <RecipeDetailScreen
          recipeId={stackState.recipeId}
          onBack={() => setStackState({})}
        />
      );
    }
    return (
      <CookingLibraryScreen
        onOpenRecipe={(recipe: Recipe) => setStackState({ recipeId: recipe.id })}
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
