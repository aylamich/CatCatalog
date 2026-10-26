import { useState } from 'react';
import { AuthLayout } from '../../components/AuthLayout';
import { FormError } from '../../components/FormError';
import { FormField } from '../../components/FormField';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useAuth } from '../../contexts/AuthContext';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { AuthScreenProps } from '../../navigation/types';

export function LoginScreen({ navigation }: AuthScreenProps<'Login'>) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { isRunning, error, setError, run } = useAsyncAction();

  const handleLogin = () => {
    if (!email.trim() || !password) {
      setError('Please fill in your email and password.');
      return;
    }
    // On success AuthContext gets a user and RootNavigator shows the catalog.
    run(() => login(email, password));
  };

  return (
    <AuthLayout subtitle="Welcome back! The kitties missed you.">
      <FormField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
      />
      <FormField
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Your password"
        secureTextEntry
        autoCapitalize="none"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={handleLogin}
      />
      {error ? <FormError message={error} /> : null}
      <PrimaryButton label="Log in" icon="log-in-outline" isLoading={isRunning} onPress={handleLogin} />
      <PrimaryButton
        label="New here? Create an account"
        variant="outline"
        onPress={() => navigation.navigate('Register')}
      />
    </AuthLayout>
  );
}
