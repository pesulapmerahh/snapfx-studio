import React, { createContext, useContext, useState, useCallback } from 'react';
import type { EffectType } from '../components/EffectEngine';

export interface Photo {
  id: string;
  dataUrl: string;
  timestamp: number;
  filter: string;
}

interface AppSettings {
  countdownEnabled: boolean;
  mirrorEnabled: boolean;
  squareCrop: boolean;
  flashEnabled: boolean;
  quadMode: boolean;
  /**
   * Quad aktif:
   * - true → satu ketukan menghasilkan satu foto 2×2 (snapshot penuh).
   * - false → empat ketukan bergiliran (Ti–Ka–Bk–Bk) yang digabung jadi satu kolase.
   */
  quadCaptureAllAtOnce: boolean;
}

interface AppContextType {
  photos: Photo[];
  addPhoto: (dataUrl: string, filter: string) => void;
  removePhoto: (id: string) => void;
  activeEffect: EffectType;
  setActiveEffect: (effect: EffectType) => void;
  isFlashing: boolean;
  triggerFlash: () => void;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [activeEffect, setActiveEffect] = useState<EffectType>('none');
  const [isFlashing, setIsFlashing] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    countdownEnabled: true,
    mirrorEnabled: true,
    squareCrop: false,
    flashEnabled: true,
    quadMode: false,
    quadCaptureAllAtOnce: true,
  });

  const addPhoto = useCallback((dataUrl: string, filter: string) => {
    const newPhoto: Photo = {
      id: crypto.randomUUID(),
      dataUrl,
      timestamp: Date.now(),
      filter
    };
    setPhotos(prev => [newPhoto, ...prev]);
  }, []);

  const removePhoto = useCallback((id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  }, []);

  const triggerFlash = useCallback(() => {
    if (!settings.flashEnabled) return;
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 300);
  }, [settings.flashEnabled]);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return (
    <AppContext.Provider value={{
      photos,
      addPhoto,
      removePhoto,
      activeEffect,
      setActiveEffect,
      isFlashing,
      triggerFlash,
      settings,
      updateSettings
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
