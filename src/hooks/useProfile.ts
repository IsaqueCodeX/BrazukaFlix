'use client';

// Hook para gerenciar o perfil regional selecionado
// Persiste a escolha no localStorage para manter entre sessões

import { useState, useEffect, useCallback } from 'react';
import { Profile } from '@/types/media';
import { PROFILES } from '@/lib/constants';

const STORAGE_KEY = 'brazukaflix-profile';

export function useProfile() {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Recupera o perfil salvo no localStorage ao montar
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const profile = PROFILES.find((p) => p.id === saved);
      if (profile) setSelectedProfile(profile);
    }
    setIsLoading(false);
  }, []);

  // Seleciona um perfil e persiste no localStorage
  const selectProfile = useCallback((profile: Profile) => {
    setSelectedProfile(profile);
    localStorage.setItem(STORAGE_KEY, profile.id);
  }, []);

  // Remove o perfil selecionado
  const clearProfile = useCallback(() => {
    setSelectedProfile(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    selectedProfile,
    isLoading,
    selectProfile,
    clearProfile,
    profiles: PROFILES,
  };
}
