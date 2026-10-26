import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors, MIN_TOUCH_SIZE } from '../theme/colors';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  icon?: ComponentProps<typeof Ionicons>['name'];
  isLoading?: boolean;
  variant?: 'filled' | 'outline';
}

export function PrimaryButton({ label, onPress, icon, isLoading = false, variant = 'filled' }: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      style={({ pressed }) => [
        styles.button,
        variant === 'outline' ? styles.outline : styles.filled,
        pressed && variant === 'filled' && styles.filledPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isLoading, busy: isLoading }}
    >
      {isLoading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        icon && <Ionicons name={icon} size={20} color={colors.text} />
      )}
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: MIN_TOUCH_SIZE + 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
  },
  filled: {
    backgroundColor: colors.primary,
  },
  filledPressed: {
    backgroundColor: colors.primaryPressed,
  },
  outline: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  label: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
});
