import { useMemo, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { Field } from '../components/ui/Field';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import type { RecipeMealType, RecipeTag } from '../modules/cooking/types';
import { isValidTime } from '../modules/timeline/time';
import type { ScheduleItemType } from '../modules/timeline/types';
import type { WorkoutCategory, WorkoutExercise } from '../modules/workout/types';
import { useRecipeStore } from '../store/recipe.store';
import { useScheduleStore } from '../store/schedule.store';
import { useSettingsStore } from '../store/settings.store';
import { useWorkoutStore } from '../store/workout.store';

const defaultScheduleForm = {
  title: '',
  type: 'study' as ScheduleItemType,
  startTime: '08:00',
  endTime: '09:00',
  workoutId: '',
  recipeId: '',
};

const defaultWorkoutForm = {
  name: '',
  category: 'push' as WorkoutCategory,
  exercisesText: 'Hít đất|4|12|60',
};

const defaultRecipeForm = {
  name: '',
  mealType: 'breakfast' as RecipeMealType,
  ingredientsText: 'Yến mạch, Sữa',
  stepsText: 'Đun nhỏ lửa\nThêm topping',
  cookingTime: '10',
  tagsText: 'standard',
};

const parseExercises = (input: string): WorkoutExercise[] =>
  input
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [name, sets, reps, restSeconds] = line.split('|').map((part) => part.trim());
      return {
        id: `line-${Date.now()}-${index}`,
        name: name || `Bài tập ${index + 1}`,
        sets: Math.max(1, Number(sets) || 1),
        reps: Math.max(1, Number(reps) || 1),
        restSeconds: Math.max(10, Number(restSeconds) || 30),
      };
    });

const parseTags = (input: string): RecipeTag[] | undefined => {
  const tags = input
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .filter((item): item is RecipeTag => item === 'low energy' || item === 'standard');
  return tags.length ? tags : undefined;
};

export const SettingsScreen = () => {
  const isEditMode = useSettingsStore((state) => state.isEditMode);
  const setEditMode = useSettingsStore((state) => state.setEditMode);

  const scheduleItems = useScheduleStore((state) => state.items);
  const addScheduleItem = useScheduleStore((state) => state.addItem);
  const updateScheduleItem = useScheduleStore((state) => state.updateItem);
  const deleteScheduleItem = useScheduleStore((state) => state.deleteItem);

  const workouts = useWorkoutStore((state) => state.routines);
  const addWorkout = useWorkoutStore((state) => state.addRoutine);
  const updateWorkout = useWorkoutStore((state) => state.updateRoutine);
  const deleteWorkout = useWorkoutStore((state) => state.deleteRoutine);

  const recipes = useRecipeStore((state) => state.recipes);
  const addRecipe = useRecipeStore((state) => state.addRecipe);
  const updateRecipe = useRecipeStore((state) => state.updateRecipe);
  const deleteRecipe = useRecipeStore((state) => state.deleteRecipe);

  const [editingScheduleId, setEditingScheduleId] = useState<string>();
  const [scheduleForm, setScheduleForm] = useState(defaultScheduleForm);

  const [editingWorkoutId, setEditingWorkoutId] = useState<string>();
  const [workoutForm, setWorkoutForm] = useState(defaultWorkoutForm);

  const [editingRecipeId, setEditingRecipeId] = useState<string>();
  const [recipeForm, setRecipeForm] = useState(defaultRecipeForm);

  const scheduleError = useMemo(() => {
    if (!scheduleForm.title.trim()) {
      return 'Tiêu đề lịch trình là bắt buộc.';
    }
    if (!isValidTime(scheduleForm.startTime) || !isValidTime(scheduleForm.endTime)) {
      return 'Thời gian phải theo định dạng HH:mm.';
    }
    return undefined;
  }, [scheduleForm]);

  return (
    <ScreenContainer scroll>
      <Text style={styles.title}>Cài đặt</Text>
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Bật chế độ chỉnh sửa</Text>
        <Switch value={isEditMode} onValueChange={setEditMode} />
      </View>

      {!isEditMode ? (
        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>Chế độ xem đang hoạt động</Text>
          <Text style={styles.noteText}>Bật chế độ chỉnh sửa để thêm, sửa, xóa lịch trình, workout và công thức.</Text>
        </View>
      ) : (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quản lý lịch trình</Text>
            <Field
              label="Tiêu đề"
              value={scheduleForm.title}
              onChangeText={(value) => setScheduleForm((current) => ({ ...current, title: value }))}
              placeholder="Nhập tiêu đề"
            />
            <Field
              label="Giờ bắt đầu (HH:mm)"
              value={scheduleForm.startTime}
              onChangeText={(value) => setScheduleForm((current) => ({ ...current, startTime: value }))}
              placeholder="06:00"
            />
            <Field
              label="Giờ kết thúc (HH:mm)"
              value={scheduleForm.endTime}
              onChangeText={(value) => setScheduleForm((current) => ({ ...current, endTime: value }))}
              placeholder="07:00"
            />
            <Text style={styles.formLabel}>Loại tác vụ</Text>
            <View style={styles.rowWrap}>
              {(['workout', 'cooking', 'study', 'rest'] as ScheduleItemType[]).map((type) => (
                <PrimaryButton
                  key={type}
                  label={type}
                  variant={scheduleForm.type === type ? 'primary' : 'secondary'}
                  onPress={() => setScheduleForm((current) => ({ ...current, type }))}
                  style={styles.choice}
                />
              ))}
            </View>
            {scheduleForm.type === 'workout' ? (
              <Field
                label="workoutId (tùy chọn)"
                value={scheduleForm.workoutId}
                onChangeText={(value) => setScheduleForm((current) => ({ ...current, workoutId: value }))}
                placeholder="w-push-1"
              />
            ) : null}
            {scheduleForm.type === 'cooking' ? (
              <Field
                label="recipeId (tùy chọn)"
                value={scheduleForm.recipeId}
                onChangeText={(value) => setScheduleForm((current) => ({ ...current, recipeId: value }))}
                placeholder="r-breakfast-1"
              />
            ) : null}
            {scheduleError ? <Text style={styles.error}>{scheduleError}</Text> : null}
            <View style={styles.row}>
              <PrimaryButton
                label={editingScheduleId ? 'Cập nhật lịch trình' : 'Thêm lịch trình'}
                onPress={() => {
                  if (scheduleError) {
                    return;
                  }
                  const payload = {
                    title: scheduleForm.title.trim(),
                    type: scheduleForm.type,
                    startTime: scheduleForm.startTime,
                    endTime: scheduleForm.endTime,
                    workoutId: scheduleForm.type === 'workout' ? scheduleForm.workoutId.trim() || undefined : undefined,
                    recipeId: scheduleForm.type === 'cooking' ? scheduleForm.recipeId.trim() || undefined : undefined,
                  };
                  if (editingScheduleId) {
                    updateScheduleItem(editingScheduleId, payload);
                  } else {
                    addScheduleItem(payload);
                  }
                  setEditingScheduleId(undefined);
                  setScheduleForm(defaultScheduleForm);
                }}
                style={styles.flex}
              />
              {editingScheduleId ? (
                <PrimaryButton
                  label="Hủy"
                  variant="secondary"
                  onPress={() => {
                    setEditingScheduleId(undefined);
                    setScheduleForm(defaultScheduleForm);
                  }}
                />
              ) : null}
            </View>
            {scheduleItems.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <Text style={styles.itemText}>{`${item.startTime}-${item.endTime} • ${item.title}`}</Text>
                <View style={styles.row}>
                  <PrimaryButton
                    label="Sửa"
                    variant="secondary"
                    onPress={() => {
                      setEditingScheduleId(item.id);
                      setScheduleForm({
                        title: item.title,
                        type: item.type,
                        startTime: item.startTime,
                        endTime: item.endTime,
                        workoutId: item.workoutId ?? '',
                        recipeId: item.recipeId ?? '',
                      });
                    }}
                  />
                  <PrimaryButton label="Xóa" variant="danger" onPress={() => deleteScheduleItem(item.id)} />
                </View>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quản lý workout</Text>
            <Field
              label="Tên workout"
              value={workoutForm.name}
              onChangeText={(value) => setWorkoutForm((current) => ({ ...current, name: value }))}
              placeholder="Push nâng cao"
            />
            <Text style={styles.formLabel}>Nhóm workout</Text>
            <View style={styles.rowWrap}>
              {(['push', 'pull', 'legs', 'core'] as WorkoutCategory[]).map((category) => (
                <PrimaryButton
                  key={category}
                  label={category}
                  variant={workoutForm.category === category ? 'primary' : 'secondary'}
                  onPress={() => setWorkoutForm((current) => ({ ...current, category }))}
                  style={styles.choice}
                />
              ))}
            </View>
            <Field
              label="Bài tập (mỗi dòng: tên|sets|reps|rest)"
              value={workoutForm.exercisesText}
              onChangeText={(value) => setWorkoutForm((current) => ({ ...current, exercisesText: value }))}
              multiline
            />
            <View style={styles.row}>
              <PrimaryButton
                label={editingWorkoutId ? 'Cập nhật workout' : 'Thêm workout'}
                onPress={() => {
                  const exercises = parseExercises(workoutForm.exercisesText);
                  if (!workoutForm.name.trim() || !exercises.length) {
                    return;
                  }
                  const payload = {
                    name: workoutForm.name.trim(),
                    category: workoutForm.category,
                    exercises,
                  };
                  if (editingWorkoutId) {
                    updateWorkout(editingWorkoutId, payload);
                  } else {
                    addWorkout(payload);
                  }
                  setEditingWorkoutId(undefined);
                  setWorkoutForm(defaultWorkoutForm);
                }}
                style={styles.flex}
              />
              {editingWorkoutId ? (
                <PrimaryButton
                  label="Hủy"
                  variant="secondary"
                  onPress={() => {
                    setEditingWorkoutId(undefined);
                    setWorkoutForm(defaultWorkoutForm);
                  }}
                />
              ) : null}
            </View>
            {workouts.map((workout) => (
              <View key={workout.id} style={styles.itemRow}>
                <Text style={styles.itemText}>{`${workout.name} (${workout.category})`}</Text>
                <View style={styles.row}>
                  <PrimaryButton
                    label="Sửa"
                    variant="secondary"
                    onPress={() => {
                      setEditingWorkoutId(workout.id);
                      setWorkoutForm({
                        name: workout.name,
                        category: workout.category,
                        exercisesText: workout.exercises
                          .map((exercise) => `${exercise.name}|${exercise.sets}|${exercise.reps}|${exercise.restSeconds}`)
                          .join('\n'),
                      });
                    }}
                  />
                  <PrimaryButton label="Xóa" variant="danger" onPress={() => deleteWorkout(workout.id)} />
                </View>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quản lý công thức nấu ăn</Text>
            <Field
              label="Tên công thức"
              value={recipeForm.name}
              onChangeText={(value) => setRecipeForm((current) => ({ ...current, name: value }))}
              placeholder="Cơm cuộn"
            />
            <Text style={styles.formLabel}>Bữa ăn</Text>
            <View style={styles.rowWrap}>
              {(['breakfast', 'lunch', 'dinner'] as RecipeMealType[]).map((mealType) => (
                <PrimaryButton
                  key={mealType}
                  label={mealType}
                  variant={recipeForm.mealType === mealType ? 'primary' : 'secondary'}
                  onPress={() => setRecipeForm((current) => ({ ...current, mealType }))}
                  style={styles.choice}
                />
              ))}
            </View>
            <Field
              label="Nguyên liệu (cách nhau bằng dấu phẩy)"
              value={recipeForm.ingredientsText}
              onChangeText={(value) => setRecipeForm((current) => ({ ...current, ingredientsText: value }))}
            />
            <Field
              label="Các bước (mỗi dòng 1 bước)"
              value={recipeForm.stepsText}
              onChangeText={(value) => setRecipeForm((current) => ({ ...current, stepsText: value }))}
              multiline
            />
            <Field
              label="Thời gian nấu (phút)"
              value={recipeForm.cookingTime}
              onChangeText={(value) => setRecipeForm((current) => ({ ...current, cookingTime: value }))}
              keyboardType="number-pad"
            />
            <Field
              label="Tags (low energy, standard)"
              value={recipeForm.tagsText}
              onChangeText={(value) => setRecipeForm((current) => ({ ...current, tagsText: value }))}
            />
            <View style={styles.row}>
              <PrimaryButton
                label={editingRecipeId ? 'Cập nhật công thức' : 'Thêm công thức'}
                onPress={() => {
                  const ingredients = recipeForm.ingredientsText
                    .split(',')
                    .map((item) => item.trim())
                    .filter(Boolean);
                  const steps = recipeForm.stepsText
                    .split('\n')
                    .map((item) => item.trim())
                    .filter(Boolean);
                  const cookingTime = Math.max(1, Number(recipeForm.cookingTime) || 1);
                  if (!recipeForm.name.trim() || !ingredients.length || !steps.length) {
                    return;
                  }
                  const payload = {
                    name: recipeForm.name.trim(),
                    mealType: recipeForm.mealType,
                    ingredients,
                    steps,
                    cookingTime,
                    tags: parseTags(recipeForm.tagsText),
                  };
                  if (editingRecipeId) {
                    updateRecipe(editingRecipeId, payload);
                  } else {
                    addRecipe(payload);
                  }
                  setEditingRecipeId(undefined);
                  setRecipeForm(defaultRecipeForm);
                }}
                style={styles.flex}
              />
              {editingRecipeId ? (
                <PrimaryButton
                  label="Hủy"
                  variant="secondary"
                  onPress={() => {
                    setEditingRecipeId(undefined);
                    setRecipeForm(defaultRecipeForm);
                  }}
                />
              ) : null}
            </View>
            {recipes.map((recipe) => (
              <View key={recipe.id} style={styles.itemRow}>
                <Text style={styles.itemText}>{`${recipe.name} (${recipe.mealType})`}</Text>
                <View style={styles.row}>
                  <PrimaryButton
                    label="Sửa"
                    variant="secondary"
                    onPress={() => {
                      setEditingRecipeId(recipe.id);
                      setRecipeForm({
                        name: recipe.name,
                        mealType: recipe.mealType,
                        ingredientsText: recipe.ingredients.join(', '),
                        stepsText: recipe.steps.join('\n'),
                        cookingTime: String(recipe.cookingTime),
                        tagsText: recipe.tags?.join(', ') ?? '',
                      });
                    }}
                  />
                  <PrimaryButton label="Xóa" variant="danger" onPress={() => deleteRecipe(recipe.id)} />
                </View>
              </View>
            ))}
          </View>
        </>
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
  noteCard: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    gap: 6,
  },
  noteTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#92400e',
  },
  noteText: {
    fontSize: 13,
    color: '#78350f',
  },
  section: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    padding: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  choice: {
    minWidth: 80,
  },
  itemRow: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    padding: 10,
    gap: 8,
  },
  itemText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
  },
  error: {
    fontSize: 12,
    color: '#b91c1c',
  },
  flex: {
    flex: 1,
  },
});
