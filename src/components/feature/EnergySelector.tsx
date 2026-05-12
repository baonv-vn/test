import { FlatList, StyleSheet, Text, View } from 'react-native';
import type { EnergyLevel } from '../../types/energy';
import { ENERGY_LEVELS } from '../../types/energy';
import { PrimaryButton } from '../ui/PrimaryButton';

type EnergySelectorProps = {
  energy: EnergyLevel | null;
  onSelect: (energy: EnergyLevel) => void;
  onClear?: () => void;
};

export const EnergySelector = ({ energy, onSelect, onClear }: EnergySelectorProps) => (
  <View style={styles.container}>
    <Text style={styles.label}>Energy State</Text>
    <FlatList
      data={ENERGY_LEVELS}
      keyExtractor={(item) => item}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <PrimaryButton
          label={item}
          onPress={() => onSelect(item)}
          variant={energy === item ? 'primary' : 'secondary'}
          style={styles.button}
        />
      )}
    />
    {energy && onClear ? (
      <PrimaryButton
        label="Change energy"
        onPress={onClear}
        variant="secondary"
      />
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  list: {
    gap: 8,
    paddingVertical: 4,
  },
  button: {
    marginVertical: 0,
  },
});
