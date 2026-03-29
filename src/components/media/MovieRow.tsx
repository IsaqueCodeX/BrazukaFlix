'use client';

// MovieRow — Carrossel horizontal responsivo de MediaCards
// Navegação por botões laterais com scroll suave

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaItem } from '@/types/media';
import MediaCard from './MediaCard';

interface MovieRowProps {
  title: string;
  items: MediaItem[];
  onOpenModal?: (item: MediaItem) => void;
}

export default function MovieRow({ title, items, onOpenModal }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Atualiza os indicadores de scroll disponível
  function updateScrollState() {
    if (!rowRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }

  // Rola o carrossel na direção especificada
  function scroll(direction: 'left' | 'right') {
    if (!rowRef.current) return;
    const scrollAmount = rowRef.current.clientWidth * 0.8;
    rowRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    setTimeout(updateScrollState, 400);
  }

  if (!items.length) return null;

  return (
    <section className="group/row relative py-4" aria-label={title}>
      {/* Título da categoria */}
      <h2 className="mb-3 px-6 font-bebas text-2xl font-semibold tracking-wide text-text-primary md:px-12 md:text-3xl">
        {title}
      </h2>

      {/* Container do carrossel */}
      <div className="relative">
        {/* Botão de scroll esquerdo */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute top-0 bottom-0 left-0 z-20 flex w-12 items-center justify-center bg-gradient-to-r from-navy-deep to-transparent opacity-0 transition-opacity group-hover/row:opacity-100"
            aria-label="Rolar para a esquerda"
          >
            <ChevronLeft size={28} className="text-white drop-shadow-lg" />
          </button>
        )}

        {/* Cards */}
        <div
          ref={rowRef}
          onScroll={updateScrollState}
          className="no-scrollbar flex gap-2 overflow-x-auto scroll-smooth px-6 pb-16 md:gap-3 md:px-12"
        >
          {items.map((item, index) => (
            <MediaCard key={item.id} item={item} index={index} onOpenModal={onOpenModal} />
          ))}
        </div>

        {/* Botão de scroll direito */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute top-0 right-0 bottom-0 z-20 flex w-12 items-center justify-center bg-gradient-to-l from-navy-deep to-transparent opacity-0 transition-opacity group-hover/row:opacity-100"
            aria-label="Rolar para a direita"
          >
            <ChevronRight size={28} className="text-white drop-shadow-lg" />
          </button>
        )}
      </div>
    </section>
  );
}
