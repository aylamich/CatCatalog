import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  Catalog: undefined;
  /** Only the id travels in the route; the screen fetches the full data. */
  BreedDetail: { id: string };
  Search: undefined;
  Favorites: undefined;
  Met: undefined;
  Profile: undefined;
};

export type AuthScreenProps<Screen extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  Screen
>;

export type AppScreenProps<Screen extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  Screen
>;
