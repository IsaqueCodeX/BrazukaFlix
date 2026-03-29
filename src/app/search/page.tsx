'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search as SearchIcon } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useMyList } from '@/hooks/useMyList';
import { getAllCategories } from '@/lib/tmdb';
import { MediaItem } from '@/types/media';
import Navbar from '@/components/layout/Navbar';
import MediaCard from '@/components/media/MediaCard';
import MediaModal from '@/components/media/MediaModal';
import BottomNav from '@/components/ui/BottomNav';

export default function SearchPage() {
  const router = useRouter();
  const { selectedProfile, isLoading, clearProfile } = useProfile();
  const { myList } = useMyList();
  const [searchTerm, setSearchTerm] = useState('');
  const [allItems, setAllItems] = useState<MediaItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
  const [modalItem, setModalItem] = useState<MediaItem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getAllCategories().then((cats) => {
      const items = Array.from(
        new Map(cats.flatMap((c) => c.items).map((i) => [i.id, i])).values()
      );
      setAllItems(items);
      setFilteredItems(items);
    });
  }, []);

  useEffect(() => {
    if (!isLoading && !selectedProfile) {
      router.push('/');
    }
  }, [isLoading, selectedProfile, router]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const filtered = allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.creator?.toLowerCase().includes(term) ||
          item.overview?.toLowerCase().includes(term)
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(allItems);
    }
  }, [searchTerm, allItems]);

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
      className="min-h-screen bg-navy-deep pb-20"
    >
      <Navbar
        profileName={selectedProfile.name}
        profileAvatar={selectedProfile.avatar}
        onSwitchProfile={handleSwitchProfile}
        onSearch={setSearchTerm}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 pt-28 px-6 md:px-12"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 drop-shadow-md">
          Buscar
        </h2>

        <div className="relative mb-8 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
          <input
            type="text"
            placeholder="Buscar filmes, séries, novelas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg bg-white/10 px-10 py-3 text-white placeholder-white/40 outline-none ring-1 ring-white/10 focus:bg-white/15 focus:ring-accent-yellow"
          />
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mb-16">
            {filteredItems.map((item, i) => (
              <MediaCard key={item.id} item={item} index={i} isGrid onOpenModal={setModalItem} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center text-text-muted">
            <p className="text-lg mb-2">Nenhum resultado encontrado.</p>
            <p className="text-sm">Tente buscar por outro termo.</p>
          </div>
        )}
      </motion.div>

      <BottomNav />

      <MediaModal
        item={modalItem!}
        onClose={() => setModalItem(null)}
        onOpenModal={setModalItem}
      />
    </motion.main>
  );
}
