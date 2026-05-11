import { ReactNode } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

type FocusContainerProps = {
  children: ReactNode;
};

export const FocusContainer = ({ children }: FocusContainerProps) => (
  <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>{children}</View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
});
