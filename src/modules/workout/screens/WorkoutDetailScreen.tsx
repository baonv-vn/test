import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useEditModeStore } from '../../../stores/editMode.store';
import { useWorkoutLibraryStore } from '../../../stores/workoutLibrary.store';

type WorkoutDetailScreenProps = {
  dayId: string;
  onBack: () => void;
};

export const WorkoutDetailScreen = ({ dayId, onBack }: WorkoutDetailScreenProps) => {
  const isEditMode = useEditModeStore((state) => state.isEditMode);
  const plans = useWorkoutLibraryStore((state) => state.plans);
  const addExercise = useWorkoutLibraryStore((state) => state.addExercise);
  const editExercise = useWorkoutLibraryStore((state) => state.editExercise);
  const deleteExercise = useWorkoutLibraryStore((state) => state.deleteExercise);
  const reorderExercise = useWorkoutLibraryStore((state) => state.reorderExercise);

  const dayPlan = useMemo(() => plans.find((item) => item.id === dayId), [dayId, plans]);

  const [name, setName] = useState('');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('8-10');
  const [rest, setRest] = useState('90');
  const [editingId, setEditingId] = useState<string | null>(null);

  if (!dayPlan) {
    return (
      <View>
        <Text>Workout day not found.</Text>
        <Pressable style={styles.button} onPress={onBack}>
          <Text style={styles.buttonText}>Back</Text>
        </Pressable>
      </View>
    );
  }

  const resetForm = () => {
    setName('');
    setSets('3');
    setReps('8-10');
    setRest('90');
  };

  const submitAdd = () => {
    if (!isEditMode || !name.trim()) {
      return;
    }
    addExercise(dayId, {
      name: name.trim(),
      sets: Number(sets) || 1,
      reps: reps.trim() || '8-10',
      restSeconds: Number(rest) || 60,
    });
    resetForm();
  };

  const submitEdit = () => {
    if (!isEditMode || !editingId || !name.trim()) {
      return;
    }
    editExercise(dayId, editingId, {
      name: name.trim(),
      sets: Number(sets) || 1,
      reps: reps.trim() || '8-10',
      restSeconds: Number(rest) || 60,
    });
    setEditingId(null);
    resetForm();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable style={styles.backBtn} onPress={onBack}>
        <Text style={styles.backBtnText}>← Back to workout library</Text>
      </Pressable>

      <View style={styles.headerCard}>
        <Text style={styles.title}>{dayPlan.label} — {dayPlan.focus}</Text>
        <Text style={styles.subtitle}>Warm-up: {dayPlan.warmUp}</Text>
      </View>

      {dayPlan.exercises.map((exercise) => (
        <View key={exercise.id} style={styles.exerciseCard}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.exerciseMeta}>Sets/Reps: {exercise.sets} × {exercise.reps}</Text>
          <Text style={styles.exerciseMeta}>Rest: {exercise.restSeconds}s</Text>
          {isEditMode ? (
            <View style={styles.row}>
              <Pressable
                style={styles.smallBtn}
                onPress={() => {
                  setEditingId(exercise.id);
                  setName(exercise.name);
                  setSets(String(exercise.sets));
                  setReps(exercise.reps);
                  setRest(String(exercise.restSeconds));
                }}
              >
                <Text style={styles.smallBtnText}>Edit</Text>
              </Pressable>
              <Pressable style={styles.smallBtn} onPress={() => reorderExercise(dayId, exercise.id, 'up')}>
                <Text style={styles.smallBtnText}>↑</Text>
              </Pressable>
              <Pressable style={styles.smallBtn} onPress={() => reorderExercise(dayId, exercise.id, 'down')}>
                <Text style={styles.smallBtnText}>↓</Text>
              </Pressable>
              <Pressable style={[styles.smallBtn, styles.danger]} onPress={() => deleteExercise(dayId, exercise.id)}>
                <Text style={styles.smallBtnText}>Delete</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      ))}

      {isEditMode ? (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>{editingId ? 'Edit exercise' : 'Add exercise'}</Text>
          <TextInput style={styles.input} placeholder="Exercise name" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Sets" value={sets} onChangeText={setSets} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Reps" value={reps} onChangeText={setReps} />
          <TextInput style={styles.input} placeholder="Rest seconds" value={rest} onChangeText={setRest} keyboardType="numeric" />

          {editingId ? (
            <View style={styles.row}>
              <Pressable style={styles.button} onPress={submitEdit}>
                <Text style={styles.buttonText}>Save exercise</Text>
              </Pressable>
              <Pressable style={styles.secondaryButton} onPress={() => setEditingId(null)}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.button} onPress={submitAdd}>
              <Text style={styles.buttonText}>Add exercise</Text>
            </Pressable>
          )}
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
  backBtn: {
    alignSelf: 'flex-start',
  },
  backBtnText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  headerCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 12,
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    color: '#475569',
  },
  exerciseCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  exerciseName: {
    fontWeight: '700',
    color: '#0f172a',
  },
  exerciseMeta: {
    color: '#475569',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  smallBtn: {
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  smallBtnText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  danger: {
    backgroundColor: '#b91c1c',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    gap: 8,
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
  button: {
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  secondaryButtonText: {
    color: '#0f172a',
    fontWeight: '700',
  },
});
