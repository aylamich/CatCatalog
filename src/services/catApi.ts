import { api } from './api';
import { Breed, BreedPage, BreedPhoto } from '../types';

const PAGE_SIZE = 10;
const GALLERY_SIZE = 10;

/** One page of the catalog, requested from the server (pages start at 0). */
export async function fetchBreeds(page: number, signal?: AbortSignal): Promise<BreedPage> {
  const response = await api.get<Breed[]>('/breeds', {
    params: { limit: PAGE_SIZE, page },
    signal,
  });
  const total = Number(response.headers['pagination-count']);
  const hasMore = Number.isFinite(total)
    ? (page + 1) * PAGE_SIZE < total
    : response.data.length === PAGE_SIZE;
  return { breeds: response.data, hasMore };
}

/** Uses the API search endpoint (the API only understands English names). */
export async function searchBreeds(term: string, signal?: AbortSignal): Promise<Breed[]> {
  const response = await api.get<Breed[]>('/breeds/search', { params: { q: term }, signal });
  return response.data;
}

export async function fetchBreed(id: string, signal?: AbortSignal): Promise<Breed> {
  const response = await api.get<Breed>(`/breeds/${encodeURIComponent(id)}`, { signal });
  return response.data;
}

export async function fetchBreedPhotos(id: string, signal?: AbortSignal): Promise<BreedPhoto[]> {
  const response = await api.get<BreedPhoto[]>('/images/search', {
    params: { breed_ids: id, limit: GALLERY_SIZE },
    signal,
  });
  return response.data;
}
