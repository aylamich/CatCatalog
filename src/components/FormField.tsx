import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, MIN_TOUCH_SIZE } from '../theme/colors';

interface FormFieldProps extends TextInputProps {
  label: string;
}

/** Label + controlled TextInput used by the login and sign up forms. */
export function FormField({ label, style, ...inputProps }: FormFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...inputProps}
        style={[styles.input, style]}
        accessibilityLabel={label}
        placeholderTextColor={colors.textMuted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 6,
  },
  label: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  input: {
    minHeight: MIN_TOUCH_SIZE + 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 16,
  },
});
