import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

interface LoadingViewProps {
  message: string;
  /** Small version for list footers and sections; default fills the screen. */
  compact?: boolean;
}

export function LoadingView({ message, compact = false }: LoadingViewProps) {
  return (
    <View style={compact ? styles.compact : styles.full} accessibilityRole="progressbar" accessibilityLabel={message}>
      <ActivityIndicator size={compact ? 'small' : 'large'} color={colors.heart} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  full: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  compact: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  message: {
    marginTop: 8,
    color: colors.textMuted,
    fontSize: 15,
  },
});
