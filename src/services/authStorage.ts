import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { User } from '../types';
import { UserFacingError } from './errorParser';

// Local login: each account lives in SecureStore and the password is stored as SHA-256(salt + password).
const SESSION_KEY = 'catbreeds_session';

interface StoredAccount extends User {
  salt: string;
  passwordHash: string;
}

function sha256(text: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, text);
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** SecureStore keys only accept letters, numbers, ".", "-" and "_", so the email is hashed. */
async function accountKey(email: string): Promise<string> {
  const emailHash = await sha256(normalizeEmail(email));
  return `catbreeds_account_${emailHash.slice(0, 32)}`;
}

function toUser({ id, username, email, createdAt }: StoredAccount): User {
  return { id, username, email, createdAt };
}

export async function registerAccount(username: string, email: string, password: string): Promise<User> {
  const key = await accountKey(email);
  if (await SecureStore.getItemAsync(key)) {
    throw new UserFacingError('This email already has an account. Try logging in.');
  }
  const salt = Array.from(Crypto.getRandomBytes(16), (byte) => byte.toString(16).padStart(2, '0')).join('');
  const account: StoredAccount = {
    id: Crypto.randomUUID(),
    username: username.trim(),
    email: normalizeEmail(email),
    createdAt: new Date().toISOString(),
    salt,
    passwordHash: await sha256(salt + password),
  };
  await SecureStore.setItemAsync(key, JSON.stringify(account));
  const user = toUser(account);
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(user));
  return user;
}

export async function loginAccount(email: string, password: string): Promise<User> {
  const raw = await SecureStore.getItemAsync(await accountKey(email));
  const account: StoredAccount | null = raw ? JSON.parse(raw) : null;
  if (!account || (await sha256(account.salt + password)) !== account.passwordHash) {
    throw new UserFacingError('Wrong email or password.');
  }
  const user = toUser(account);
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(user));
  return user;
}

export async function loadSession(): Promise<User | null> {
  const raw = await SecureStore.getItemAsync(SESSION_KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}

export function clearSession(): Promise<void> {
  return SecureStore.deleteItemAsync(SESSION_KEY);
}
