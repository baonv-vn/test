import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
};

export const PrimaryButton = ({
  label,
  onPress,
  disabled,
  variant = 'primary',
  style,
}: PrimaryButtonProps) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    style={({ pressed }) => [
      styles.base,
      variant === 'secondary' ? styles.secondary : styles.primary,
      disabled && styles.disabled,
      pressed && !disabled && styles.pressed,
      style,
    ]}
  >
    <Text
      style={[
        styles.label,
        variant === 'secondary' ? styles.labelSecondary : styles.labelPrimary,
      ]}
    >
      {label}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  primary: {
    backgroundColor: '#1f2937',
  },
  secondary: {
    backgroundColor: '#e5e7eb',
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  label: {
    fontWeight: '600',
  },
  labelPrimary: {
    color: '#ffffff',
  },
  labelSecondary: {
    color: '#111827',
  },
});
