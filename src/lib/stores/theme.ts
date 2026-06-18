import { writable } from 'svelte/store';

const isBrowser = typeof window !== 'undefined';

function getInitialTheme(): 'dark' | 'light' {
  if (!isBrowser) return 'dark';
  
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'dark' || storedTheme === 'light') {
    return storedTheme;
  }
  
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  
  return 'dark'; // Default to dark
}

export const theme = writable<'dark' | 'light'>(getInitialTheme());

export function toggleTheme() {
  theme.update(current => {
    const newTheme = current === 'dark' ? 'light' : 'dark';
    if (isBrowser) {
      localStorage.setItem('theme', newTheme);
    }
    return newTheme;
  });
}
