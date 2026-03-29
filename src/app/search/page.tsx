'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search as SearchIcon } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { getAllCategories } from '@/lib/tmdb';
import { MediaItem } from '@/types/media';
import Navbar from '@/components/layout/Navbar';
import MediaCard from '@/components/media/MediaCard';
import MediaModal from '@/components/media/MediaModal';
import BottomNav from '@/components/ui/BottomNav';

export default function SearchPage() {
  const router = useRouter();
  const { selectedProfile, isLoading, clearProfile } = useProfile();
  const [searchTerm, setSearchTerm] = useState('');
  const [allItems, setAllItems] = useState<MediaItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
  const [modalItem, setModalItem] = useState<MediaItem | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    getAllCategories()
      .then((cats) => {
        const items = Array.from(
          new Map(cats.flatMap((c) => c.items).map((i) => [i.id, i])).values()
        );
        setAllItems(items);
        setFilteredItems(items);
      })
      .finally(() => {
        setIsLoadingData(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      });
  }, []);

  useEffect(() => {
    if (!isLoading && !selectedProfile) {
      router.push('/');
    }
  }, [isLoading, selectedProfile, router]);

  const performSearch = useCallback((term: string) => {
    if (!term.trim()) {
      setFilteredItems(allItems);
      setIsSearching(false);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    const lowerTerm = term.toLowerCase();
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const filtered = allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(lowerTerm) ||
          item.creator?.toLowerCase().includes(lowerTerm) ||
          item.overview?.toLowerCase().includes(lowerTerm)
      );
      setFilteredItems(filtered);
      setIsSearching(false);
      setHasSearched(true);
    }, 300);
  }, [allItems]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    performSearch(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchTerm);
  };

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

  const showNoResults = !isLoadingData && !isSearching && hasSearched && filteredItems.length === 0;
  const showInitialState = !isLoadingData && !hasSearched;

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

        <form onSubmit={handleSubmit} className="relative mb-8 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar filmes, séries, novelas..."
            value={searchTerm}
            onChange={handleInputChange}
            className="w-full rounded-lg bg-white/10 px-10 py-3 text-white placeholder-white/40 outline-none ring-1 ring-white/10 focus:bg-white/15 focus:ring-accent-yellow"
            enterKeyHint="search"
          />
        </form>

        {isLoadingData || isSearching ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-dark-green border-t-transparent" />
          </div>
        ) : showNoResults ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-text-muted">
            <p className="text-lg mb-2">Nenhum resultado encontrado</p>
            <p className="text-sm">Tente buscar por outro termo</p>
          </div>
        ) : showInitialState ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mb-16">
            {filteredItems.map((item, i) => (
              <MediaCard key={item.id} item={item} index={i} isGrid onOpenModal={setModalItem} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mb-16">
            {filteredItems.map((item, i) => (
              <MediaCard key={item.id} item={item} index={i} isGrid onOpenModal={setModalItem} />
            ))}
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
