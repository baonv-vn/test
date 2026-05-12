import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: ViewStyle;
};

export const PrimaryButton = ({
  label,
  onPress,
  variant = 'primary',
  style,
}: PrimaryButtonProps) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.base,
      styles[variant],
      pressed && styles.pressed,
      style,
    ]}
  >
    <Text
      style={[
        styles.label,
        variant === 'primary' ? styles.primaryLabel : null,
        variant === 'secondary' ? styles.secondaryLabel : null,
        variant === 'danger' ? styles.dangerLabel : null,
      ]}
    >
      {label}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  base: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  primary: {
    backgroundColor: '#1d4ed8',
  },
  secondary: {
    backgroundColor: '#e5e7eb',
  },
  danger: {
    backgroundColor: '#fee2e2',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  label: {
    fontWeight: '600',
  },
  primaryLabel: {
    color: '#ffffff',
  },
  secondaryLabel: {
    color: '#111827',
  },
  dangerLabel: {
    color: '#991b1b',
  },
});
