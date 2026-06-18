import { writable } from 'svelte/store';

export interface User {
  id: string;
  username: string;
  role: 'user' | 'admin';
}

const isBrowser = typeof window !== 'undefined';

function getInitialToken() {
  if (!isBrowser) return null;
  return localStorage.getItem('token');
}

function getInitialUser(): User | null {
  if (!isBrowser) return null;
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
}

export const auth = writable<{ token: string | null; user: User | null }>({
  token: getInitialToken(),
  user: getInitialUser()
});

export function setAuth(token: string, user: User) {
  if (isBrowser) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }
  auth.set({ token, user });
}

export function logout() {
  if (isBrowser) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  auth.set({ token: null, user: null });
}
