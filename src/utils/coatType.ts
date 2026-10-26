export const COAT_TYPES = ['Short hair', 'Long hair', 'Hairless', 'Other'] as const;

export type CoatType = (typeof COAT_TYPES)[number];

/**
 * The API has ~15 inconsistent `breed_group` values ("Short/Long-hair", "Semi-longhair"...).
 * This groups them into a few coat types so the search results can be filtered.
 */
export function coatType(breedGroup: string | null | undefined): CoatType {
  const group = (breedGroup ?? '').toLowerCase();
  if (group.includes('hairless')) return 'Hairless';
  if (group.includes('long')) return 'Long hair';
  if (group.includes('short') || group.includes('medium')) return 'Short hair';
  return 'Other';
}
