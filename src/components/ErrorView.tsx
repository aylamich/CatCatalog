import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { PrimaryButton } from './PrimaryButton';

interface ErrorViewProps {
  message: string;
  onRetry: () => void;
  /** Small version (inside lists); default fills the screen. */
  compact?: boolean;
}

/** Sad kitty + friendly message + "Try again". The container is not `accessible`, so the button stays reachable. */
export function ErrorView({ message, onRetry, compact = false }: ErrorViewProps) {
  return (
    <View style={compact ? styles.compact : styles.full}>
      <Ionicons name="sad-outline" size={compact ? 32 : 64} color={colors.placeholderIcon} />
      <Text style={styles.message} accessibilityRole="alert">
        {message}
      </Text>
      <PrimaryButton label="Try again" icon="refresh" onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  full: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
    backgroundColor: colors.background,
  },
  compact: {
    alignItems: 'center',
    padding: 16,
    gap: 10,
  },
  message: {
    color: colors.text,
    fontSize: 16,
    textAlign: 'center',
  },
});
