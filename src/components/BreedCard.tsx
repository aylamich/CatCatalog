import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, MIN_TOUCH_SIZE } from '../theme/colors';
import { CatImage } from './CatImage';

interface BreedCardProps {
  name: string;
  imageUrl: string | null;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
}

/** Grid card (half of the row). The heart is a sibling of the card button, so TalkBack can reach both. */
export function BreedCard({ name, imageUrl, isFavorite, onPress, onToggleFavorite }: BreedCardProps) {
  return (
    <View style={styles.cell}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`${name}. Open details`}
      >
        <CatImage uri={imageUrl} accessibilityLabel={`Photo of a ${name} cat`} style={styles.image} />
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>
      </Pressable>

      <Pressable
        onPress={onToggleFavorite}
        style={styles.heartButton}
        accessibilityRole="button"
        accessibilityLabel={isFavorite ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
        accessibilityState={{ selected: isFavorite }}
      >
        <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={24} color={colors.heart} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: '50%',
    padding: 6,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.85,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  name: {
    minHeight: 48,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  heartButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: MIN_TOUCH_SIZE,
    height: MIN_TOUCH_SIZE,
    borderRadius: MIN_TOUCH_SIZE / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
