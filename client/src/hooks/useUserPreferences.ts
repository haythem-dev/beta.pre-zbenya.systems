
import { useState, useEffect } from 'react';

interface UserPreferences {
  theme: 'light' | 'dark';
  sector: 'B2B' | 'B2C';
  interests: string[];
}

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('userPreferences');
    return saved ? JSON.parse(saved) : {
      theme: 'light',
      sector: 'B2B',
      interests: []
    };
  });

  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);

  return {
    preferences,
    updatePreferences: (newPreferences: Partial<UserPreferences>) => {
      setPreferences(prev => ({ ...prev, ...newPreferences }));
    }
  };
}
