'use client';

/**
 * ============================================
 * COMPONENTE MEDIA MODAL
 * ============================================
 * 
 * Modal de detalhes premium estilo Netflix.
 * Exibe informações completas sobre um filme, série ou novela:
 * - Backdrop/Trailer
 * - Título e logo
 * - Metadados (nota, ano, duração)
 * - Sinopse
 * - Onde assistir (streaming)
 * - Títulos similares
 * 
 * Características:
 * - Renderizado via Portal (createPortal)
 * - Scroll travado no body quando aberto
 * - Busca dados via API Route (server-side)
 * - Animações com Framer Motion
 */

import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { X, Volume2, VolumeX, Star, Clock, Tv, Calendar, Users } from 'lucide-react';
import { MediaItem, WatchProvider } from '@/types/media';
import { buildImageUrl } from '@/lib/tmdb';
import { WatchProviders } from '@/components/ui/WatchProviders';
import { Skeleton } from '@/components/ui/Skeleton';
import MediaCard from '@/components/media/MediaCard';

// ============================================
// TIPAGEM DAS PROPS
// ============================================

interface MediaModalProps {
  /** Item de mídia selecionado para exibir detalhes */
  item: MediaItem;
  /** Callback para fechar o modal */
  onClose: () => void;
  /** Callback para abrir modal de outro item */
  onOpenModal: (item: MediaItem) => void;
}

// ============================================
// TIPAGEM INTERNA
// ============================================

/** Estrutura de dados retornados pela API de detalhes */
interface ModalData {
  details: MediaItem | null;
  trailerKey: string | null;
  similar: MediaItem[];
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function MediaModal({ item, onClose, onOpenModal }: MediaModalProps) {
  // Estados de dados e UI
  const [data, setData] = useState<ModalData>({ details: null, trailerKey: null, similar: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ============================================
  // HOOKS DE CICLO DE VIDA
  // ============================================

  // Marca componente como montado (evita SSR issues com createPortal)
  useEffect(() => { 
    setMounted(true); 
  }, []);

  /**
   * Hook para travar scroll do body quando modal abre.
   * Garante que a página principal não role enquanto o modal está aberto.
   */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { 
      document.body.style.overflow = ''; 
    };
  }, []);

  /**
   * Hook para fechar modal com tecla Escape.
   * Melhora acessibilidade e UX.
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { 
      if (e.key === 'Escape') onClose(); 
    },
    [onClose]
  );
  
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  /**
   * Hook para buscar dados da API.
   * Carrega detalhes, trailer e títulos similares.
   */
  useEffect(() => {
    setIsLoading(true);
    setShowTrailer(false);
    setData({ details: null, trailerKey: null, similar: [] });

    fetch(`/api/media/${item.id}?type=${item.type}`)
      .then((r) => r.json())
      .then((json) => {
        setData({
          details: json.details ?? item,
          trailerKey: json.trailerKey ?? null,
          similar: json.similar ?? [],
        });
        setIsLoading(false);
        if (json.trailerKey) {
          setTimeout(() => setShowTrailer(true), 1200);
        }
      })
      .catch(() => {
        setData({ details: item, trailerKey: null, similar: [] });
        setIsLoading(false);
      });
  }, [item]);

  // ============================================
  // DADOS DERIVADOS
  // ============================================

  // Usa dados da API ou fallback para dados originais
  const activeItem = data.details ?? item;
  
  // Label do tipo de mídia
  const typeLabel = activeItem.type === 'movie' ? 'Filme' : activeItem.type === 'novela' ? 'Novela' : 'Série';

  // Backdrop: usa o do item original enquanto carrega (evita tela em branco)
  const rawBackdrop = activeItem.backdropPath || item.backdropPath;
  const backdropUrl = rawBackdrop ? buildImageUrl(rawBackdrop, '/w1280') : null;

  // Watch providers tipado corretamente
  const watchProviders = (activeItem.watchProviders ?? []) as WatchProvider[];

  // ============================================
  // RENDERIZAÇÃO
  // ============================================

  // Não renderiza no servidor (SSR)
  if (!mounted) return null;

  return createPortal(
    <>
      {/* ============================================
          OVERLAY (Fundo escurecido)
      ============================================ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[51] bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* ============================================
          SCROLL WRAPPER (Permite scroll dentro do modal)
      ============================================ */}
      <div className="fixed inset-0 z-[51] overflow-y-auto">
        {/* Container com margem para não cobrir a navbar */}
        <div className="flex min-h-full items-center justify-center px-4 py-10 md:px-6 md:py-14 mt-20 md:mt-24">

          {/* ============================================
              MODAL PRINCIPAL
          ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-3xl rounded-2xl bg-[#181818] shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >

            {/* ============================================
                BOTÃO FECHAR
            ============================================ */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-40 flex h-9 w-9 items-center justify-center rounded-full bg-[#181818] text-white shadow-xl ring-1 ring-white/10 transition-all hover:scale-110 hover:bg-[#282828]"
              aria-label="Fechar"
            >
              <X size={17} strokeWidth={2.5} />
            </button>

            {/* ============================================
                BACKDROP / TRAILER
            ============================================ */}
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>

              {/* Backdrop estático - base sempre visível enquanto carrega */}
              {backdropUrl ? (
                <Image
                  src={backdropUrl}
                  alt={activeItem.title}
                  fill
                  className={`object-cover object-top transition-opacity duration-700 ${showTrailer ? 'opacity-0' : 'opacity-100'}`}
                  sizes="(max-width: 768px) 100vw, 768px"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-navy-deep" />
              )}

              {/* Trailer YouTube - sobrepõe o backdrop quando carrega */}
              {showTrailer && data.trailerKey && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0"
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${data.trailerKey}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${data.trailerKey}&controls=0&showinfo=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1`}
                    className="h-full w-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title={`Trailer: ${activeItem.title}`}
                  />
                </motion.div>
              )}

              {/* Gradiente inferior sobre backdrop */}
              <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#181818] via-[#181818]/60 to-transparent pointer-events-none" />

              {/* ============================================
                  TÍTULO / LOGO SOBRE O BACKDROP
              ============================================ */}
              <div className="absolute bottom-4 left-6 right-14 md:left-8 md:bottom-6">
                {activeItem.logoPath ? (
                  <div className="relative h-14 w-52 md:h-16 md:w-64 drop-shadow-2xl">
                    <Image
                      src={buildImageUrl(activeItem.logoPath, '/w300')}
                      alt={activeItem.title}
                      fill
                      className="object-contain object-left"
                      sizes="256px"
                    />
                  </div>
                ) : (
                  <h2 className="font-display text-2xl font-black text-white drop-shadow-2xl leading-tight md:text-3xl">
                    {activeItem.title}
                  </h2>
                )}
              </div>

              {/* ============================================
                  BOTÃO MUTE (quando há trailer)
              ============================================ */}
              {showTrailer && data.trailerKey && (
                <button
                  onClick={() => setIsMuted((m) => !m)}
                  className="absolute bottom-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/50 bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/70"
                  aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
                >
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
              )}
            </div>

            {/* ============================================
                CORPO DO MODAL
            ============================================ */}
            <div className="px-6 pb-8 md:px-8">

              {isLoading ? (
                /* Skeletons de carregamento */
                <div className="space-y-3 py-4">
                  <div className="flex gap-3">
                    <Skeleton className="h-5 w-20 rounded-md bg-white/10" />
                    <Skeleton className="h-5 w-28 rounded-md bg-white/10" />
                    <Skeleton className="h-5 w-16 rounded-md bg-white/10" />
                  </div>
                  <Skeleton className="h-4 w-full rounded-md bg-white/10" />
                  <Skeleton className="h-4 w-full rounded-md bg-white/10" />
                  <Skeleton className="h-4 w-4/5 rounded-md bg-white/10" />
                </div>
              ) : (
                <>
                  {/* Linha de metadados */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-4 text-sm">
                    {/* Badge tipo (Filme/Série/Novela) */}
                    <span className="rounded bg-accent-yellow/90 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-navy-deep">
                      {typeLabel}
                    </span>

                    {/* Score de relevância */}
                    <span className="flex items-center gap-1 font-bold text-[#46d369]">
                      <Star size={13} fill="currentColor" />
                      {(activeItem.rating * 10).toFixed(0)}% Relevante
                    </span>

                    {/* Ano */}
                    {activeItem.year > 0 && (
                      <span className="flex items-center gap-1 text-white/50">
                        <Calendar size={12} />
                        {activeItem.year}
                      </span>
                    )}

                    {/* Duração (filmes) */}
                    {activeItem.type === 'movie' && activeItem.runtime && activeItem.runtime > 0 && (
                      <span className="flex items-center gap-1 text-white/50">
                        <Clock size={12} />
                        {Math.floor(activeItem.runtime / 60)}h {activeItem.runtime % 60}min
                      </span>
                    )}

                    {/* Episódios (séries/novelas) */}
                    {(activeItem.type === 'series' || activeItem.type === 'novela') &&
                      activeItem.numberOfEpisodes && activeItem.numberOfEpisodes > 0 && (
                        <span className="flex items-center gap-1 text-white/50">
                          <Tv size={12} />
                          {activeItem.numberOfEpisodes} {activeItem.type === 'novela' ? 'Cap.' : 'Ep.'}
                        </span>
                      )}

                    {/* Total de avaliações */}
                    {activeItem.voteCount > 0 && (
                      <span className="flex items-center gap-1 text-white/30">
                        <Users size={12} />
                        {activeItem.voteCount.toLocaleString('pt-BR')}
                      </span>
                    )}
                  </div>

                  {/* Criador/Autor */}
                  {activeItem.creator && (
                    <p className="mt-1.5 text-xs font-semibold text-white/40 tracking-wide">
                      {activeItem.creator}
                    </p>
                  )}

                  {/* Sinopse */}
                  <p className="mt-4 text-[15px] leading-relaxed text-white/75">
                    {activeItem.overview || 'Sinopse não disponível.'}
                  </p>

                  {/* Onde Assistir */}
                  {watchProviders.length > 0 && (
                    <WatchProviders providers={watchProviders} />
                  )}
                </>
              )}
            </div>

            {/* ============================================
                TÍTULOS SIMILARES
            ============================================ */}
            {!isLoading && data.similar.length > 0 && (
              <div className="border-t border-white/[0.08] px-6 pb-8 md:px-8">
                <h3 className="mb-4 mt-5 text-xs font-bold uppercase tracking-[0.15em] text-white/40">
                  Títulos Similares
                </h3>
                <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
                  {data.similar.map((s, i) => (
                    <div key={s.id} className="w-28 flex-shrink-0 md:w-36">
                      <MediaCard item={s} index={i} onOpenModal={onOpenModal} />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </div>
      </div>
    </>,
    document.body
  );
}
