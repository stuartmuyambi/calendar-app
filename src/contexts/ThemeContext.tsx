
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppSettings } from '@/utils/storage';

interface ThemeContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'light',
    colorScheme: 'blue',
    view: 'year',
    customCategories: [],
  });

  useEffect(() => {
    const stored = localStorage.getItem('calendar-app-data');
    if (stored) {
      const data = JSON.parse(stored);
      if (data.settings) {
        setSettings(data.settings);
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
    document.documentElement.setAttribute('data-color-scheme', settings.colorScheme);
  }, [settings.theme, settings.colorScheme]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    
    const stored = localStorage.getItem('calendar-app-data');
    const data = stored ? JSON.parse(stored) : {};
    data.settings = updated;
    localStorage.setItem('calendar-app-data', JSON.stringify(data));
  };

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' });
  };

  return (
    <ThemeContext.Provider value={{ settings, updateSettings, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
