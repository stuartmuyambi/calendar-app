
export interface StorageData {
  notes: Note[];
  goals: Goals;
  habits: Habit[];
  settings: AppSettings;
}

export interface Note {
  id: string;
  date: string;
  text: string;
  category: 'personal' | 'work' | 'health' | 'other';
  priority: 'low' | 'medium' | 'high';
  timeSlot?: string;
  isTemplate?: boolean;
}

export interface Goals {
  [category: string]: Goal[];
}

export interface Goal {
  id: number;
  text: string;
  completed: boolean;
  progress: number;
  deadline?: string;
  streak: number;
  lastCompletedDate?: string;
}

export interface Habit {
  id: string;
  name: string;
  category: string;
  completedDates: string[];
  streak: number;
  color: string;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  colorScheme: 'blue' | 'green' | 'purple' | 'orange';
  view: 'year' | 'month' | 'week';
  customCategories: string[];
}

const STORAGE_KEY = 'calendar-app-data';

export const saveToStorage = (data: Partial<StorageData>) => {
  try {
    const existing = loadFromStorage();
    const updated = { ...existing, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const loadFromStorage = (): StorageData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
  }
  
  return {
    notes: [],
    goals: {
      personal: [],
      professional: [],
      creative: [],
    },
    habits: [],
    settings: {
      theme: 'light',
      colorScheme: 'blue',
      view: 'year',
      customCategories: [],
    },
  };
};
