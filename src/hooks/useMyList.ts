'use client';

import { useState, useEffect } from 'react';
import { MediaItem } from '@/types/media';

const STORAGE_KEY = '@BrazukaFlix:MyList';

export function useMyList() {
  const [myList, setMyList] = useState<MediaItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Carregar do localStorage ao montar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setMyList(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Erro ao ler Minha Lista do localStorage', e);
    }
    setIsInitialized(true);
  }, []);

  // Sincronizar entre abas do navegador
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setMyList(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const hasItem = (mediaId: number) => {
    return myList.some((item) => item.id === mediaId);
  };

  const toggleItem = (item: MediaItem) => {
    setMyList((current) => {
      const exists = current.some((m) => m.id === item.id);
      let newList;
      if (exists) {
        newList = current.filter((m) => m.id !== item.id);
      } else {
        newList = [...current, item];
      }
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      } catch (e) {
        console.error('Erro ao salvar Minha Lista no localStorage', e);
      }
      return newList;
    });
  };

  const clearList = () => {
    setMyList([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    myList,
    isInitialized,
    hasItem,
    toggleItem,
    clearList,
  };
}
