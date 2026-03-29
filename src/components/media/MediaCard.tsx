'use client';

// MediaCard — Card vertical com efeito hover premium
// Zoom + glow amarelo + overlay com informações detalhadas
// Versão otimizada para mobile: toque abre modal diretamente

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Plus, ChevronDown, Check, PlayCircle, Trophy } from 'lucide-react';
import { MediaItem } from '@/types/media';
import { buildImageUrl } from '@/lib/tmdb';
import { Skeleton } from '@/components/ui/Skeleton';
import { useMyList } from '@/hooks/useMyList';

interface MediaCardProps {
  item: MediaItem;
  index?: number;
  isGrid?: boolean;
  onOpenModal?: (item: MediaItem) => void;
}

export default function MediaCard({ item, index = 0, isGrid = false, onOpenModal }: MediaCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const { hasItem, toggleItem } = useMyList();
  
  const inMyList = hasItem(item.id);

  const handleCardClick = useCallback(() => {
    onOpenModal?.(item);
  }, [onOpenModal, item]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    onOpenModal?.(item);
  }, [onOpenModal, item]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 10) * 0.05, duration: 0.3 }}
      className={`group/card relative cursor-pointer touch-manipulation ${
        isGrid ? 'w-full' : 'w-36 flex-shrink-0 md:w-44 lg:w-48'
      }`}
      style={{ zIndex: 1 }}
      aria-label={`${item.title} (${item.year})`}
      onClick={handleCardClick}
      onTouchEnd={handleTouchEnd}
      role="button"
      tabIndex={0}
    >
      {/* Poster do conteúdo c/ Skeleton de Fallback */}
      <figure className="relative aspect-[2/3] overflow-hidden rounded-radius-card transition-all duration-300 md:group-hover/card:z-20 md:group-hover/card:scale-105 md:group-hover/card:shadow-2xl md:group-hover/card:shadow-accent-yellow/20">
        {!imgLoaded && <Skeleton className="absolute inset-0 z-0 bg-navy-medium" />}
        
        <Image
          src={buildImageUrl(item.posterPath, '/w500')}
          alt={item.title}
          fill
          onLoad={() => setImgLoaded(true)}
          className={`object-cover transition-all duration-500 md:group-hover/card:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          sizes="(max-width: 768px) 144px, (max-width: 1024px) 176px, 192px"
          draggable={false}
        />

        {/* Tags Especiais de Utilidade Pública */}
        <div className="pointer-events-none absolute top-2 left-2 z-10 flex flex-col gap-1">
           {item.isFreeOnYT && (
             <span className="flex w-fit items-center gap-1 rounded bg-red-600/90 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-md md:transition-all md:group-hover/card:opacity-0">
                <PlayCircle size={10} /> Grátis no YT
             </span>
           )}
           {item.hasAward && (
             <span className="flex w-fit items-center gap-1 rounded bg-gradient-to-r from-accent-yellow to-yellow-600 px-1.5 py-0.5 text-[10px] font-bold text-navy-deep shadow-sm backdrop-blur-md md:transition-all md:group-hover/card:opacity-0">
                <Trophy size={10} fill="currentColor" /> Clássico
             </span>
           )}
        </div>

        {/* Overlay Escuro - visível apenas no desktop via hover, no mobile abre direto */}
        <div className="pointer-events-none absolute inset-0 z-30 hidden flex-col justify-center bg-black/80 p-4 md:flex md:opacity-0 md:backdrop-blur-sm md:transition-all md:duration-300 md:group-hover/card:opacity-100">
          <div className="mb-3 text-center">
            <h3 className="mb-1 text-sm font-bold text-white drop-shadow-md line-clamp-2 md:text-base">
              {item.title}
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px] md:text-xs">
              <span className="font-bold text-sea-green drop-shadow">
                {(item.rating * 10).toFixed(0)}% Relevante
              </span>
              <span className="font-medium text-white/90">{item.year}</span>
              <span className="rounded-[3px] border border-white/30 bg-white/10 px-1.5 py-[1px] font-semibold text-white/90">
                {item.type === 'movie'
                  ? 'Filme'
                  : item.type === 'novela'
                    ? 'Novela'
                    : 'Série'}
              </span>
            </div>
          </div>

          <p className="mb-4 text-center text-[10px] leading-relaxed text-white/80 line-clamp-3 md:text-xs">
            {item.overview || 'Sinopse não disponível.'}
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleItem(item);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white transition-all hover:scale-110 hover:border-white hover:bg-white/30"
              aria-label={inMyList ? 'Remover da minha lista' : 'Adicionar à minha lista'}
            >
              {inMyList ? <Check size={16} className="text-accent-yellow" /> : <Plus size={16} />}
            </button>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-navy-deep transition-all hover:scale-110 shadow-lg"
              aria-label="Mais informações"
              onClick={(e) => {
                e.stopPropagation();
                onOpenModal?.(item);
              }}
            >
              <ChevronDown strokeWidth={3} size={16} />
            </button>
          </div>
        </div>
      </figure>
    </motion.article>
  );
}
