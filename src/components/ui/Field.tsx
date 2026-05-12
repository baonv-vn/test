import { StyleSheet, Text, TextInput, type TextInputProps, View } from 'react-native';

type FieldProps = TextInputProps & {
  label: string;
};

export const Field = ({ label, ...props }: FieldProps) => (
  <View style={styles.wrapper}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      {...props}
      style={[styles.input, props.multiline ? styles.multiline : null]}
      placeholderTextColor="#9ca3af"
    />
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#111827',
    fontSize: 14,
    backgroundColor: '#fff',
  },
  multiline: {
    minHeight: 76,
    textAlignVertical: 'top',
  },
});
