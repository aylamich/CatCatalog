import { StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';

/** Error line of a form; `alert` makes TalkBack/VoiceOver read it as soon as it appears. */
export function FormError({ message }: { message: string }) {
  return (
    <Text style={styles.error} accessibilityRole="alert" accessibilityLiveRegion="polite">
      {message}
    </Text>
  );
}

const styles = StyleSheet.create({
  error: {
    color: colors.error,
    fontSize: 15,
    fontWeight: '600',
  },
});
