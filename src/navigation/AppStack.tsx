import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BreedDetailScreen } from '../screens/BreedDetailScreen';
import { CatalogScreen } from '../screens/CatalogScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { MetScreen } from '../screens/MetScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { colors } from '../theme/colors';
import { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.gradientTop },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '800' },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Catalog" component={CatalogScreen} options={{ title: 'Cat Breeds Catalog' }} />
      {/* The real title is set with navigation.setOptions when the breed arrives. */}
      <Stack.Screen name="BreedDetail" component={BreedDetailScreen} options={{ title: 'Kitty details' }} />
      <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Search kitties' }} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favorite kitties' }} />
      <Stack.Screen name="Met" component={MetScreen} options={{ title: "Kitties I've met" }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'My profile' }} />
    </Stack.Navigator>
  );
}
