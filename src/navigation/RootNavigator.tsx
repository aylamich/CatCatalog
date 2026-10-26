import { LoadingView } from '../components/LoadingView';
import { useAuth } from '../contexts/AuthContext';
import { AppStack } from './AppStack';
import { AuthStack } from './AuthStack';

/**
 * Conditional navigation: the session in AuthContext decides which stack exists.
 * Login/logout only change `user`; no navigate('Login') is needed.
 */
export function RootNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingView message="Opening the catalog..." />;
  return user ? <AppStack /> : <AuthStack />;
}
