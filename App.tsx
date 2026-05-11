import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FocusContainer } from './src/components/ui/FocusContainer';
import { PrimaryButton } from './src/components/ui/PrimaryButton';
import { EnergySelector } from './src/components/feature/EnergySelector';
import { WorkoutScreen } from './src/screens/WorkoutScreen';
import { CookingScreen } from './src/screens/CookingScreen';
import { useEnergyStore } from './src/stores/energy.store';

export default function App() {
  const [activeTab, setActiveTab] = useState<'workout' | 'cooking'>('workout');
  const energy = useEnergyStore((state) => state.energy);
  const setEnergy = useEnergyStore((state) => state.setEnergy);
  const clearEnergy = useEnergyStore((state) => state.clearEnergy);

  return (
    <FocusContainer>
      <StatusBar style="dark" />
      <Text style={styles.title}>Daily System</Text>
      <EnergySelector energy={energy} onSelect={setEnergy} onClear={clearEnergy} />
      <View style={styles.tabRow}>
        <PrimaryButton
          label="Workout"
          onPress={() => setActiveTab('workout')}
          variant={activeTab === 'workout' ? 'primary' : 'secondary'}
          style={styles.tabButton}
        />
        <PrimaryButton
          label="Cooking"
          onPress={() => setActiveTab('cooking')}
          variant={activeTab === 'cooking' ? 'primary' : 'secondary'}
          style={styles.tabButton}
        />
      </View>
      <View style={styles.screen}>{activeTab === 'workout' ? <WorkoutScreen /> : <CookingScreen />}</View>
    </FocusContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  tabRow: {
    flexDirection: 'row',
    gap: 12,
  },
  tabButton: {
    flex: 1,
    marginVertical: 0,
  },
  screen: {
    flex: 1,
  },
});
