import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, MIN_TOUCH_SIZE } from '../theme/colors';

const PAWS = [1, 2, 3, 4, 5];

interface PawRatingProps {
  rating: number;
  /** Without onRate the rating is read-only. */
  onRate?: (rating: number) => void;
  size?: number;
}

/** 1 to 5 rating shown as paws. */
export function PawRating({ rating, onRate, size = 28 }: PawRatingProps) {
  if (!onRate) {
    return (
      <View style={styles.row} accessible accessibilityRole="image" accessibilityLabel={`Rated ${rating} of 5 paws`}>
        {PAWS.map((value) => (
          <Ionicons
            key={value}
            name={value <= rating ? 'paw' : 'paw-outline'}
            size={size}
            color={value <= rating ? colors.paw : colors.pawEmpty}
          />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.row}>
      {PAWS.map((value) => (
        <Pressable
          key={value}
          onPress={() => onRate(value)}
          style={styles.pawButton}
          accessibilityRole="button"
          accessibilityLabel={`Rate ${value} of 5 paws`}
          accessibilityState={{ selected: value === rating }}
        >
          <Ionicons
            name={value <= rating ? 'paw' : 'paw-outline'}
            size={size}
            color={value <= rating ? colors.paw : colors.pawEmpty}
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pawButton: {
    minWidth: MIN_TOUCH_SIZE,
    minHeight: MIN_TOUCH_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
