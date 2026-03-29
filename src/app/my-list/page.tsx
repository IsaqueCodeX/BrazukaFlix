'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useProfile } from '@/hooks/useProfile';
import { useMyList } from '@/hooks/useMyList';
import { MediaItem } from '@/types/media';
import Navbar from '@/components/layout/Navbar';
import MediaCard from '@/components/media/MediaCard';
import MediaModal from '@/components/media/MediaModal';
import BottomNav from '@/components/ui/BottomNav';

export default function MyListPage() {
  const router = useRouter();
  const { selectedProfile, isLoading, clearProfile } = useProfile();
  const { myList } = useMyList();
  const [modalItem, setModalItem] = useState<MediaItem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && !selectedProfile) {
      router.push('/');
    }
  }, [isLoading, selectedProfile, router]);

  const handleSwitchProfile = () => {
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
      className="min-h-screen bg-navy-deep pb-24"
    >
      <Navbar
        profileName={selectedProfile.name}
        profileAvatar={selectedProfile.avatar}
        onSwitchProfile={handleSwitchProfile}
        onSearch={() => {}}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 pt-28 px-6 md:px-12"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 drop-shadow-md">
          Minha Lista
        </h2>
        
        {myList.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mb-16">
            {myList.map((item, i) => (
              <MediaCard key={item.id} item={item} index={i} isGrid onOpenModal={setModalItem} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center text-text-muted">
            <p className="text-lg mb-2">Sua lista está vazia.</p>
            <p className="text-sm">Adicione filmes, séries e novelas para ver aqui.</p>
          </div>
        )}
      </motion.div>

      <BottomNav />

      {modalItem && (
        <MediaModal
          item={modalItem}
          onClose={() => setModalItem(null)}
          onOpenModal={setModalItem}
        />
      )}
    </motion.main>
  );
}
