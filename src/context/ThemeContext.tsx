import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'dark' | 'light' | 'neon';

const ThemeContext = createContext<{ theme: Theme; setTheme: (t: Theme) => void }>({
  theme: 'dark',
  setTheme: () => undefined,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('cp_theme') as Theme) || 'dark');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('cp_theme', theme);
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
