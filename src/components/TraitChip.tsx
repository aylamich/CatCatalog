import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

interface TraitChipProps {
  label: string;
  /** Position in the list, used to pick a pastel color. */
  index: number;
}

/** One personality trait from the breed temperament ("Playful", "Gentle"...). */
export function TraitChip({ label, index }: TraitChipProps) {
  return (
    <View style={[styles.chip, { backgroundColor: colors.chips[index % colors.chips.length] }]}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
});
