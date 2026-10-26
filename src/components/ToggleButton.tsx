import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, MIN_TOUCH_SIZE } from '../theme/colors';

type IconName = ComponentProps<typeof Ionicons>['name'];

interface ToggleButtonProps {
  selected: boolean;
  onPress: () => void;
  label: string;
  selectedLabel: string;
  icon: IconName;
  selectedIcon: IconName;
  /** What TalkBack/VoiceOver says; it changes with the state. */
  accessibilityLabel: string;
}

/** On/off button for "Favorite" and "I've met this kitty!". */
export function ToggleButton({
  selected,
  onPress,
  label,
  selectedLabel,
  icon,
  selectedIcon,
  accessibilityLabel,
}: ToggleButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, selected && styles.selected]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected }}
    >
      <Ionicons name={selected ? selectedIcon : icon} size={22} color={selected ? colors.heart : colors.text} />
      <Text style={styles.label}>{selected ? selectedLabel : label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    minHeight: MIN_TOUCH_SIZE + 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  selected: {
    backgroundColor: colors.placeholder,
  },
  label: {
    flexShrink: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});
