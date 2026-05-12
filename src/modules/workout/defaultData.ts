import type { WorkoutRoutine } from './types';

export const defaultWorkoutRoutines: WorkoutRoutine[] = [
  {
    id: 'w-push-1',
    name: 'Push Cơ Bản',
    category: 'push',
    exercises: [
      { id: 'e-pushup', name: 'Hít đất', sets: 4, reps: 12, restSeconds: 60 },
      { id: 'e-press', name: 'Đẩy vai', sets: 3, reps: 10, restSeconds: 75 },
    ],
  },
  {
    id: 'w-pull-1',
    name: 'Pull Cơ Bản',
    category: 'pull',
    exercises: [
      { id: 'e-row', name: 'Kéo tạ tay', sets: 4, reps: 12, restSeconds: 60 },
      { id: 'e-curl', name: 'Cuốn tay trước', sets: 3, reps: 12, restSeconds: 60 },
    ],
  },
  {
    id: 'w-legs-1',
    name: 'Legs Cơ Bản',
    category: 'legs',
    exercises: [
      { id: 'e-squat', name: 'Squat', sets: 4, reps: 12, restSeconds: 75 },
      { id: 'e-lunge', name: 'Lunge', sets: 3, reps: 12, restSeconds: 60 },
    ],
  },
  {
    id: 'w-core-1',
    name: 'Core Cơ Bản',
    category: 'core',
    exercises: [
      { id: 'e-plank', name: 'Plank', sets: 3, reps: 1, restSeconds: 45 },
      { id: 'e-crunch', name: 'Gập bụng', sets: 3, reps: 20, restSeconds: 45 },
    ],
  },
];
