import { useState } from 'react';
import { AuthLayout } from '../../components/AuthLayout';
import { FormError } from '../../components/FormError';
import { FormField } from '../../components/FormField';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useAuth } from '../../contexts/AuthContext';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { AuthScreenProps } from '../../navigation/types';

const MIN_PASSWORD_LENGTH = 6;

function validate(username: string, email: string, password: string, confirm: string): string | null {
  if (!username.trim() || !email.trim() || !password) return 'Please fill in all the fields.';
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) return 'Please type a valid email.';
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `The password needs at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (password !== confirm) return 'The passwords do not match.';
  return null;
}

export function RegisterScreen({ navigation }: AuthScreenProps<'Register'>) {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const { isRunning, error, setError, run } = useAsyncAction();

  const handleRegister = () => {
    const validationError = validate(username, email, password, confirm);
    if (validationError) {
      setError(validationError);
      return;
    }
    run(() => register(username, email, password));
  };

  return (
    <AuthLayout subtitle="Create your account to meet the kitties.">
      <FormField
        label="Username"
        value={username}
        onChangeText={setUsername}
        placeholder="Your name"
        autoComplete="username"
      />
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
        placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
        secureTextEntry
        autoCapitalize="none"
        textContentType="newPassword"
      />
      <FormField
        label="Confirm password"
        value={confirm}
        onChangeText={setConfirm}
        placeholder="Type it again"
        secureTextEntry
        autoCapitalize="none"
        textContentType="newPassword"
        returnKeyType="go"
        onSubmitEditing={handleRegister}
      />
      {error ? <FormError message={error} /> : null}
      <PrimaryButton label="Sign up" icon="paw" isLoading={isRunning} onPress={handleRegister} />
      <PrimaryButton label="I already have an account" variant="outline" onPress={() => navigation.goBack()} />
    </AuthLayout>
  );
}
