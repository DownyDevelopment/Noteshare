import { User } from '@/types';

export const SESSION_COOKIE = 'ns_session';
export const AUTH_USERS_KEY = 'ns_auth_users';

export interface StoredAuthUser extends User {
  passwordHash: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  user?: User;
}

const ITS_EMAIL_REGEX = /^[a-z0-9._%+-]+@mhs\.its\.ac\.id$/i;
const NRP_REGEX = /^\d{10}$/;

export function validateItsEmail(email: string): string | null {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) return 'Email wajib diisi.';
  if (!ITS_EMAIL_REGEX.test(trimmed)) {
    return 'Gunakan email ITS resmi (@mhs.its.ac.id).';
  }
  return null;
}

export function validateNrp(nrp: string): string | null {
  const trimmed = nrp.trim();
  if (!trimmed) return 'NRP wajib diisi.';
  if (!NRP_REGEX.test(trimmed)) return 'NRP harus terdiri dari 10 digit angka.';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password wajib diisi.';
  if (password.length < 8) return 'Password minimal 8 karakter.';
  return null;
}

export function validateName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return 'Nama lengkap wajib diisi.';
  if (trimmed.length < 3) return 'Nama minimal 3 karakter.';
  return null;
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function generateAvatarUrl(seed: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
}

export function createDefaultUser(
  nrp: string,
  name: string,
  email: string
): User {
  return {
    nrp,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    avatar: generateAvatarUrl(nrp),
    balance: 0,
    bookmarks: [],
    followedCourses: [],
    purchasedNotes: [],
    uploadedNotes: [],
  };
}

export function getStoredAuthUsers(): StoredAuthUser[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(AUTH_USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as StoredAuthUser[];
  } catch {
    return [];
  }
}

export function saveStoredAuthUsers(users: StoredAuthUser[]): void {
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

export function setSessionCookie(nrp: string): void {
  const maxAge = 60 * 60 * 24 * 7;
  document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(nrp)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearSessionCookie(): void {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function toPublicUser(stored: StoredAuthUser): User {
  const { passwordHash: _, ...user } = stored;
  return user;
}
