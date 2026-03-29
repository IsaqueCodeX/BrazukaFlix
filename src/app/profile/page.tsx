'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Settings, LogOut, Trash2 } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useMyList } from '@/hooks/useMyList';
import BottomNav from '@/components/ui/BottomNav';

export default function ProfilePage() {
  const router = useRouter();
  const { selectedProfile, isLoading, clearProfile } = useProfile();
  const { myList } = useMyList();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && !selectedProfile) {
      router.push('/');
    }
  }, [isLoading, selectedProfile, router]);

  const handleLogout = () => {
    clearProfile();
    router.push('/');
  };

  if (isLoading || !selectedProfile || !mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-deep">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-dark-green border-t-transparent" />
      </div>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-navy-deep pb-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 pt-28 px-6 md:px-12"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 drop-shadow-md">
          Perfil
        </h2>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-yellow text-navy-deep">
            {selectedProfile.avatar ? (
              <img 
                src={selectedProfile.avatar} 
                alt={selectedProfile.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <User size={36} />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{selectedProfile.name}</h3>
            <p className="text-white/60 text-sm">Perfil selecionado</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg bg-white/5 p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-white">Minha Lista</span>
              <span className="text-accent-yellow font-bold">{myList.length} títulos</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full rounded-lg bg-red-600/20 border border-red-600/50 p-4 flex items-center justify-center gap-2 text-red-400 hover:bg-red-600/30 transition-colors"
          >
            <LogOut size={20} />
            <span>Sair do perfil</span>
          </button>
        </div>
      </motion.div>

      <BottomNav />
    </motion.main>
  );
}
