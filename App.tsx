import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CookingLibraryScreen } from './src/screens/CookingLibraryScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { WorkoutLibraryScreen } from './src/screens/WorkoutLibraryScreen';
import { PrimaryButton } from './src/components/ui/PrimaryButton';

type TabKey = 'home' | 'workout' | 'cooking' | 'settings';

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: 'home', label: 'Home' },
  { key: 'workout', label: 'Workout Library' },
  { key: 'cooking', label: 'Cooking Library' },
  { key: 'settings', label: 'Settings' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('home');

  const content = useMemo(() => {
    if (activeTab === 'workout') {
      return <WorkoutLibraryScreen />;
    }
    if (activeTab === 'cooking') {
      return <CookingLibraryScreen />;
    }
    if (activeTab === 'settings') {
      return <SettingsScreen />;
    }
    return <HomeScreen onOpenSettings={() => setActiveTab('settings')} />;
  }, [activeTab]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>{content}</View>
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <PrimaryButton
            key={tab.key}
            label={tab.label}
            variant={activeTab === tab.key ? 'primary' : 'secondary'}
            onPress={() => setActiveTab(tab.key)}
            style={styles.tabButton}
          />
        ))}
      </View>
      <Text style={styles.footer}>Chế độ mặc định: View Mode (Timeline)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    gap: 8,
  },
  tabButton: {
    flexGrow: 1,
    minWidth: '47%',
    marginVertical: 0,
  },
  footer: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 12,
    paddingBottom: 8,
  },
});
