import { StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from './PrimaryButton';

type EmptyStateCardProps = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const EmptyStateCard = ({
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateCardProps) => (
  <View style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
    {actionLabel && onAction ? (
      <PrimaryButton label={actionLabel} onPress={onAction} />
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#f9fafb',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  message: {
    fontSize: 14,
    color: '#4b5563',
  },
});
