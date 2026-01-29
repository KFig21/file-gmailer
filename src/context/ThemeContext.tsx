// src/context/ThemeContext.tsx

import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
  themes: string[];
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

const THEME_STORAGE_KEY = 'app-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const themes = ['night', 'light'];

  // 👇 initialize from localStorage
  const [theme, setThemeState] = useState<string>(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return storedTheme && themes.includes(storedTheme) ? storedTheme : 'night';
  });

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // 👇 ensure theme is applied on first render
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>{children}</ThemeContext.Provider>
  );
}
