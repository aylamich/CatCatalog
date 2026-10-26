import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

interface AuthLayoutProps {
  subtitle: string;
  children: ReactNode;
}

/** Shared frame of the login and sign up screens: gradient, logo and form card. */
export function AuthLayout({ subtitle, children }: AuthLayoutProps) {
  return (
    <LinearGradient colors={[colors.gradientTop, colors.gradientBottom]} style={styles.flex}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.logo} accessible accessibilityRole="header" accessibilityLabel="Cat Breeds Catalog">
            <View style={styles.logoIcon}>
              <Ionicons name="paw" size={44} color={colors.heart} />
            </View>
            <Text style={styles.title}>Cat Breeds Catalog</Text>
          </View>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <View style={styles.card}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: 64,
  },
  logo: {
    alignItems: 'center',
  },
  logoIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 12,
    color: colors.text,
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 24,
    color: colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
  },
  card: {
    gap: 16,
    padding: 20,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
