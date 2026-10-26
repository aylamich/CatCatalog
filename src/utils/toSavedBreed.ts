import { Breed, SavedBreed } from '../types';

/** Keeps only what the favorites / kitties met lists need to show a breed offline. */
export function toSavedBreed(breed: Breed): SavedBreed {
  return { id: breed.id, name: breed.name, imageUrl: breed.image?.url ?? null };
}
