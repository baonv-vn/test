import { Text } from 'react-native';
import { WorkoutLibraryList } from '../modules/workout/WorkoutLibraryList';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { useWorkoutStore } from '../store/workout.store';

export const WorkoutLibraryScreen = () => {
  const routines = useWorkoutStore((state) => state.routines);

  return (
    <ScreenContainer scroll>
      <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827' }}>Thư viện Workout</Text>
      <WorkoutLibraryList routines={routines} />
    </ScreenContainer>
  );
};
