import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

type LoadingCardProps = {
  message?: string;
};

export const LoadingCard = ({ message = 'Loading...' }: LoadingCardProps) => (
  <View style={styles.card}>
    <ActivityIndicator size="small" color="#111827" />
    <Text style={styles.text}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    color: '#374151',
    fontWeight: '500',
  },
});
