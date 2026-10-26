import { MetItem, SavedBreed } from '../types';
import { supabase } from './supabase';

// Tables are created by supabase/schema.sql. Every row belongs to one user, identified by email.

export interface CloudTable<T extends { id: string }> {
  fetchAll: (owner: string) => Promise<T[]>;
  saveAll: (owner: string, items: T[]) => Promise<void>;
  removeAll: (owner: string, ids: string[]) => Promise<void>;
}

interface FavoriteRow {
  breed_id: string;
  name: string;
  image_url: string | null;
}

interface MetRow extends FavoriteRow {
  rating: number;
  met_at: string;
}

function createCloudTable<T extends { id: string }, Row extends { breed_id: string }>(
  table: string,
  toRow: (item: T) => Row,
  fromRow: (row: Row) => T,
): CloudTable<T> | null {
  const client = supabase;
  if (!client) return null;

  return {
    async fetchAll(owner) {
      const { data, error } = await client.from(table).select('*').eq('user_email', owner);
      if (error) throw error;
      return (data as Row[]).map(fromRow);
    },
    async saveAll(owner, items) {
      if (items.length === 0) return;
      const rows = items.map((item) => ({ user_email: owner, ...toRow(item) }));
      const { error } = await client.from(table).upsert(rows);
      if (error) throw error;
    },
    async removeAll(owner, ids) {
      if (ids.length === 0) return;
      // Always filtered by the owner, so a user never deletes another user's rows.
      const { error } = await client.from(table).delete().eq('user_email', owner).in('breed_id', ids);
      if (error) throw error;
    },
  };
}

export const favoritesTable = createCloudTable<SavedBreed, FavoriteRow>(
  'favorites',
  (item) => ({ breed_id: item.id, name: item.name, image_url: item.imageUrl }),
  (row) => ({ id: row.breed_id, name: row.name, imageUrl: row.image_url }),
);

export const metTable = createCloudTable<MetItem, MetRow>(
  'met',
  (item) => ({
    breed_id: item.id,
    name: item.name,
    image_url: item.imageUrl,
    rating: item.rating,
    met_at: item.metAt,
  }),
  (row) => ({
    id: row.breed_id,
    name: row.name,
    imageUrl: row.image_url,
    rating: row.rating,
    metAt: row.met_at,
  }),
);
