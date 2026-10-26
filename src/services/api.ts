import axios from 'axios';

/** Axios instance for The Cat API. The key comes from .env (EXPO_PUBLIC_CAT_API_KEY). */
export const api = axios.create({
  baseURL: 'https://api.thecatapi.com/v1',
  timeout: 10000,
  headers: { 'x-api-key': process.env.EXPO_PUBLIC_CAT_API_KEY ?? '' },
});
