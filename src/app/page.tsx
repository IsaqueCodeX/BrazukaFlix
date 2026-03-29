'use client';

// Página principal — Gerencia a transição entre ProfileSelector e conteúdo
// Se nenhum perfil está selecionado, exibe o seletor de perfis

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileSelector from '@/components/profile/ProfileSelector';
import { useProfile } from '@/hooks/useProfile';
import { Profile } from '@/types/media';

export default function HomePage() {
  const router = useRouter();
  const { selectedProfile, isLoading, selectProfile } = useProfile();

  // Ao selecionar um perfil, salva e redireciona para /browse
  const handleProfileSelect = useCallback(
    (profile: Profile) => {
      selectProfile(profile);
      router.push('/browse');
    },
    [selectProfile, router]
  );

  // Redirecionamento após carregar perfil
  useEffect(() => {
    if (!isLoading && selectedProfile) {
      router.push('/browse');
    }
  }, [isLoading, selectedProfile, router]);

  // Loading state enquanto verifica localStorage
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-dark-green border-t-transparent" />
          <span className="text-sm text-text-muted">Carregando...</span>
        </motion.div>
      </div>
    );
  }

  if (selectedProfile) {
    return null;
  }

  // Exibe o seletor de perfis
  return (
    <main>
      <AnimatePresence mode="wait">
        <motion.div
          key="profile-selector"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
        >
          <ProfileSelector onSelect={handleProfileSelect} />
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
