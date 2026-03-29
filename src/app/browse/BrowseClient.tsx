'use client';

// BrowseClient — Componente cliente da página principal
// Gerencia perfil, renderiza Navbar, Billboard, MovieRows e Footer

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfile } from '@/hooks/useProfile';
import { useMyList } from '@/hooks/useMyList';
import { MediaItem, MediaCategory } from '@/types/media';
import Navbar from '@/components/layout/Navbar';
import Billboard from '@/components/hero/Billboard';
import MovieRow from '@/components/media/MovieRow';
import Footer from '@/components/layout/Footer';
import MediaCard from '@/components/media/MediaCard';
import MediaModal from '@/components/media/MediaModal';
import BottomNav from '@/components/ui/BottomNav';

interface BrowseClientProps {
  categories: MediaCategory[];
  billboardItem: MediaItem;
  trailerKey: string | null;
  initialType?: string;
  initialList?: string;
  filteredItems?: MediaItem[];
  viewTitle?: string;
}

export default function BrowseClient({
  categories,
  billboardItem,
  trailerKey,
  initialType,
  initialList,
  filteredItems,
  viewTitle,
}: BrowseClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedProfile, isLoading, clearProfile } = useProfile();
  const { myList } = useMyList();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [modalItem, setModalItem] = useState<MediaItem | null>(null);
  const [mounted, setMounted] = useState(false);
  
  const [urlParams, setUrlParams] = useState<{ type?: string; list?: string }>({});
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Get URL params from window.location for client-side navigation
    if (typeof window !== 'undefined') {
      const search = window.location.search;
      const params = new URLSearchParams(search);
      setUrlParams({
        type: params.get('type') || undefined,
        list: params.get('list') || undefined,
      });
      setIsMobile(window.innerWidth < 768);
    }
  }, []);

  const paramsKey = searchParams.toString();
  
  const categoryFilter = useMemo(() => {
    const serverType = initialType || '';
    const clientType = searchParams.get('type') || urlParams.type || '';
    return mounted ? (clientType || serverType) : serverType;
  }, [mounted, paramsKey, initialType, urlParams.type]);
  
  const listFilter = useMemo(() => {
    const serverList = initialList || '';
    const clientList = searchParams.get('list') || urlParams.list || '';
    return mounted ? (clientList || serverList) : serverList;
  }, [mounted, paramsKey, initialList, urlParams.list]);
  
  const isMineListActive = listFilter === 'mine';
  
  // Check if we are searching or in a specific list view, then we hide the billboard
  const isSearchView = searchTerm.length > 0;
  const hideBillboard = isSearchView || isMineListActive || !!categoryFilter;

  // Redireciona para seleção de perfil se nenhum está selecionado
  useEffect(() => {
    if (!isLoading && !selectedProfile) {
      router.push('/');
    }
  }, [isLoading, selectedProfile, router]);

  // Loading state
  if (isLoading || !selectedProfile || !mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-deep">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-dark-green border-t-transparent" />
      </div>
    );
  }

  const handleSwitchProfile = () => {
    clearProfile();
    router.push('/');
  };

  // Dedup de items
  const allItems = Array.from(
    new Map(
      categories.flatMap((c) => c.items).map((item) => [item.id, item])
    ).values()
  );

  // Computando os itens para exibir quando há pesquisa ou "minha lista" atrelada ou categoria
  let displayedItems: MediaItem[] = [];
  let activeCategories = categories;
  
  let effectiveViewTitle = '';
  
  if (isSearchView) {
    displayedItems = allItems.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.creator?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (item.overview && item.overview.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    effectiveViewTitle = `Resultados para "${searchTerm}" (${displayedItems.length})`;
  } else if (filteredItems && filteredItems.length > 0) {
    displayedItems = filteredItems;
    effectiveViewTitle = viewTitle || '';
  } else if (isMineListActive) {
    displayedItems = myList;
    effectiveViewTitle = 'Minha Lista';
  } else if (categoryFilter) {
    displayedItems = allItems.filter(item => item.type === categoryFilter);
    effectiveViewTitle = categoryFilter === 'movie' ? 'Filmes Nacionais' : categoryFilter === 'series' ? 'Séries e Docs' : 'Novelas Clássicas';
  }

  return (
    <motion.main
      key="browse-main"
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
        autoOpenSearch={isMobile}
      />

      <AnimatePresence mode="wait">
        {!hideBillboard ? (
           <motion.div
             key="main-view"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             transition={{ duration: 0.3 }}
           >
              {billboardItem && (
                <Billboard item={billboardItem} trailerKey={trailerKey} onOpenModal={setModalItem} className="pt-20 md:pt-0" />
              )}
        
              <div className="relative z-10 pt-20 md:pt-4 pb-12 space-y-6 md:space-y-10 lg:pt-8 bg-gradient-to-b from-navy-deep/80 to-navy-deep">
                {activeCategories.map((category) => (
                  <MovieRow
                    key={category.slug}
                    title={category.title}
                    items={category.items}
                    onOpenModal={setModalItem}
                  />
                ))}
              </div>
           </motion.div>
        ) : (
           <motion.div
             key="search-view"
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0 }}
             transition={{ duration: 0.4 }}
             className="pt-20 md:pt-28 px-6 md:px-12 relative z-10"
           >
              <h2 className="text-2xl font-bold text-white mb-8 drop-shadow-md">
                {effectiveViewTitle}
              </h2>
              {displayedItems.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mb-16">
                  {displayedItems.map((item, i) => (
                    <MediaCard key={item.id} item={item} index={i} isGrid onOpenModal={setModalItem} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center text-text-muted">
                  <p className="text-lg mb-2">Putz, não encontramos nenhum título.</p>
                  <p className="text-sm">Trabalhando para trazer mais obras em breve.</p>
                </div>
              )}
           </motion.div>
        )}
      </AnimatePresence>

      {!hideBillboard && <Footer />}

      <BottomNav />

      {/* Modal de detalhes */}
      <AnimatePresence>
        {modalItem && (
          <MediaModal
            key={modalItem.id}
            item={modalItem}
            onClose={() => setModalItem(null)}
            onOpenModal={setModalItem}
          />
        )}
      </AnimatePresence>
    </motion.main>
  );
}
