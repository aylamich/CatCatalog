/** Breed as returned by The Cat API (only the fields the app uses). */
export interface Breed {
  id: string;
  name: string;
  description: string;
  temperament: string;
  life_span: string;
  weight: { metric: string };
  height: { metric: string };
  origin?: string | null;
  history?: string | null;
  breed_group?: string | null;
  alt_names?: string | null;
  image?: { url: string };
}

export interface BreedPhoto {
  id: string;
  url: string;
}

export interface BreedPage {
  breeds: Breed[];
  hasMore: boolean;
}

/** Public user data (never includes the password hash). */
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

/** Minimal breed data saved on the device for favorites and kitties met. */
export interface SavedBreed {
  id: string;
  name: string;
  imageUrl: string | null;
}

export interface MetItem extends SavedBreed {
  rating: number;
  metAt: string;
}
