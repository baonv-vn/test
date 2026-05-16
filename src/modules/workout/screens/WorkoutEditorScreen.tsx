import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useWorkoutLibraryStore } from '../../../stores/workoutLibrary.store';

type WorkoutEditorScreenProps = {
  dayId?: string;
  onBack: () => void;
};

export const WorkoutEditorScreen = ({ dayId, onBack }: WorkoutEditorScreenProps) => {
  const plans = useWorkoutLibraryStore((state) => state.plans);
  const addPlan = useWorkoutLibraryStore((state) => state.addPlan);
  const editPlan = useWorkoutLibraryStore((state) => state.editPlan);
  const deletePlan = useWorkoutLibraryStore((state) => state.deletePlan);
  const addExercise = useWorkoutLibraryStore((state) => state.addExercise);
  const editExercise = useWorkoutLibraryStore((state) => state.editExercise);
  const deleteExercise = useWorkoutLibraryStore((state) => state.deleteExercise);
  const reorderExercise = useWorkoutLibraryStore((state) => state.reorderExercise);

  const dayPlan = useMemo(() => plans.find((item) => item.id === dayId), [dayId, plans]);

  const [label, setLabel] = useState(dayPlan?.label ?? '');
  const [focus, setFocus] = useState(dayPlan?.focus ?? '');
  const [warmUp, setWarmUp] = useState(dayPlan?.warmUp ?? '');
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseSets, setExerciseSets] = useState('3');
  const [exerciseReps, setExerciseReps] = useState('8-10');
  const [exerciseRest, setExerciseRest] = useState('60');
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);

  const currentDayId = dayPlan?.id;

  const saveWorkout = () => {
    if (!label.trim() || !focus.trim()) {
      return;
    }
    if (currentDayId) {
      editPlan(currentDayId, {
        label: label.trim(),
        focus: focus.trim(),
        warmUp: warmUp.trim(),
      });
      return;
    }
    const createdId = addPlan({
      label: label.trim(),
      focus: focus.trim(),
      warmUp: warmUp.trim(),
    });
    setLabel('');
    setFocus('');
    setWarmUp('');
    onBack();
    void createdId;
  };

  const resetExerciseForm = () => {
    setExerciseName('');
    setExerciseSets('3');
    setExerciseReps('8-10');
    setExerciseRest('60');
    setEditingExerciseId(null);
  };

  const saveExercise = () => {
    if (!currentDayId || !exerciseName.trim()) {
      return;
    }
    const payload = {
      name: exerciseName.trim(),
      sets: Number(exerciseSets) || 1,
      reps: exerciseReps.trim() || '8-10',
      restSeconds: Number(exerciseRest) || 60,
    };
    if (editingExerciseId) {
      editExercise(currentDayId, editingExerciseId, payload);
    } else {
      addExercise(currentDayId, payload);
    }
    resetExerciseForm();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable style={styles.linkBtn} onPress={onBack}>
        <Text style={styles.linkText}>← Back</Text>
      </Pressable>

      <View style={styles.card}>
        <Text style={styles.title}>{currentDayId ? 'Edit workout' : 'Create workout'}</Text>
        <TextInput style={styles.input} value={label} onChangeText={setLabel} placeholder="Day label" />
        <TextInput style={styles.input} value={focus} onChangeText={setFocus} placeholder="Focus" />
        <TextInput style={styles.input} value={warmUp} onChangeText={setWarmUp} placeholder="Warm-up" />
        <View style={styles.row}>
          <Pressable style={styles.primaryBtn} onPress={saveWorkout}>
            <Text style={styles.primaryText}>Save workout</Text>
          </Pressable>
          {currentDayId ? (
            <Pressable
              style={styles.dangerBtn}
              onPress={() => {
                deletePlan(currentDayId);
                onBack();
              }}
            >
              <Text style={styles.primaryText}>Delete workout</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      {currentDayId ? (
        <View style={styles.card}>
          <Text style={styles.title}>{editingExerciseId ? 'Edit exercise' : 'Add exercise'}</Text>
          <TextInput
            style={styles.input}
            value={exerciseName}
            onChangeText={setExerciseName}
            placeholder="Exercise name"
          />
          <TextInput
            style={styles.input}
            value={exerciseSets}
            onChangeText={setExerciseSets}
            placeholder="Sets"
            keyboardType="numeric"
          />
          <TextInput style={styles.input} value={exerciseReps} onChangeText={setExerciseReps} placeholder="Reps" />
          <TextInput
            style={styles.input}
            value={exerciseRest}
            onChangeText={setExerciseRest}
            placeholder="Rest seconds"
            keyboardType="numeric"
          />
          <View style={styles.row}>
            <Pressable style={styles.primaryBtn} onPress={saveExercise}>
              <Text style={styles.primaryText}>Save exercise</Text>
            </Pressable>
            {editingExerciseId ? (
              <Pressable style={styles.secondaryBtn} onPress={resetExerciseForm}>
                <Text style={styles.secondaryText}>Cancel</Text>
              </Pressable>
            ) : null}
          </View>

          {dayPlan?.exercises.map((exercise) => (
            <View key={exercise.id} style={styles.itemCard}>
              <View style={styles.itemMain}>
                <Text style={styles.itemTitle}>{exercise.name}</Text>
                <Text style={styles.itemMeta}>
                  {exercise.sets} x {exercise.reps} • Rest {exercise.restSeconds}s
                </Text>
              </View>
              <View style={styles.row}>
                <Pressable
                  style={styles.smallBtn}
                  onPress={() => {
                    setEditingExerciseId(exercise.id);
                    setExerciseName(exercise.name);
                    setExerciseSets(String(exercise.sets));
                    setExerciseReps(exercise.reps);
                    setExerciseRest(String(exercise.restSeconds));
                  }}
                >
                  <Text style={styles.smallBtnText}>Edit</Text>
                </Pressable>
                <Pressable style={styles.smallBtn} onPress={() => reorderExercise(currentDayId, exercise.id, 'up')}>
                  <Text style={styles.smallBtnText}>↑</Text>
                </Pressable>
                <Pressable style={styles.smallBtn} onPress={() => reorderExercise(currentDayId, exercise.id, 'down')}>
                  <Text style={styles.smallBtnText}>↓</Text>
                </Pressable>
                <Pressable
                  style={[styles.smallBtn, styles.smallDanger]}
                  onPress={() => deleteExercise(currentDayId, exercise.id)}
                >
                  <Text style={styles.smallBtnText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      ) : null}
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
  secondaryBtn: {
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  secondaryText: {
    color: '#0f172a',
    fontWeight: '700',
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
  itemCard: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    padding: 10,
    gap: 8,
  },
  itemMain: {
    gap: 2,
  },
  itemTitle: {
    color: '#0f172a',
    fontWeight: '700',
  },
  itemMeta: {
    color: '#475569',
  },
  smallBtn: {
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  smallBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
  },
  smallDanger: {
    backgroundColor: '#b91c1c',
  },
});
