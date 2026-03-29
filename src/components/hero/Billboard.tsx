'use client';

/**
 * ============================================
 * COMPONENTE BILLBOARD
 * ============================================
 * 
 * Banner principal de destaque (Hero Section) da aplicação.
 * Exibe o conteúdo em destaque com:
 * - Filmes: Trailer do YouTube em loop/mute no background
 * - Séries/Novelas: Backdrop de alta qualidade
 * 
 * Características:
 * - Altura adaptativa (70vh mobile, 85vh desktop)
 * - Gradientes para legibilidade do texto
 * - Animações de entrada com Framer Motion
 * - Suporte a logos dinâmicas (quando disponíveis)
 * - Botão de mute/unmute para trailers
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Info, Volume2, VolumeX } from 'lucide-react';
import { MediaItem } from '@/types/media';
import { buildImageUrl } from '@/lib/tmdb';
import { WatchProviders } from '@/components/ui/WatchProviders';

// ============================================
// TIPAGEM DAS PROPS
// ============================================

interface BillboardProps {
  /** Item de mídia a ser exibido em destaque */
  item: MediaItem;
  /** Chave do trailer do YouTube (opcional) */
  trailerKey?: string | null;
  /** Callback para abrir modal de detalhes */
  onOpenModal?: (item: MediaItem) => void;
  /** Classes CSS adicionais (opcional) */
  className?: string;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function Billboard({ 
  item, 
  trailerKey, 
  onOpenModal, 
  className = '' 
}: BillboardProps) {
  // Estados para controle de áudio e vídeo
  const [isMuted, setIsMuted] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  
  // Verifica se é filme (apenas filmes têm trailers)
  const isMovie = item.type === 'movie';
  const hasTrailer = isMovie && !!trailerKey;

  // ============================================
  // HOOKS DE EVENTO
  // ============================================

  /**
   * Carrega o trailer após um breve delay para suavizar a transição.
   * Evita que o usuário veja o trailer carregando abruptamente.
   */
  useEffect(() => {
    if (hasTrailer) {
      const timer = setTimeout(() => setShowTrailer(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [hasTrailer]);

  // ============================================
  // RENDERIZAÇÃO
  // ============================================

  return (
    <section
      className={`relative h-[70vh] w-full overflow-hidden md:h-[85vh] ${className}`}
      aria-label={`Destaque: ${item.title}`}
    >
      {/* ============================================
          BACKGROUND: Trailer ou Backdrop
      ============================================ */}
      {showTrailer && trailerKey ? (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${trailerKey}&controls=0&showinfo=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1`}
            className="absolute top-1/2 left-1/2 min-h-[100vh] min-w-[177.77vh] h-[56.25vw] w-[100vw] -translate-x-1/2 -translate-y-1/2 scale-105"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title={`Trailer: ${item.title}`}
          />
        </div>
      ) : (
        <Image
          src={buildImageUrl(item.backdropPath, '/original')}
          alt={item.title}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      )}

      {/* ============================================
          GRADIENTES DE LEGIBILIDADE
      ============================================ */}
      
      {/* Gradiente inferior - garante contraste com textos na parte inferior */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/40 to-transparent" />
      
      {/* Gradiente lateral - destaque para textos na lateral esquerda */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/80 via-transparent to-transparent" />

      {/* ============================================
          CONTEÚDO DO BANNER
      ============================================ */}
      <div className="absolute bottom-[12%] left-0 z-10 w-full max-w-2xl px-6 md:bottom-[15%] md:px-12">
        
        {/* Badge de tipo (Filme/Série/Novela) - apenas desktop */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="hidden md:inline-block mt-2 mb-4 rounded-sm bg-accent-yellow/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-navy-deep">
            {item.type === 'movie'
              ? 'Filme'
              : item.type === 'novela'
                ? 'Novela'
                : 'Série'}
          </span>
        </motion.div>

        {/* ============================================
            TÍTULO: Logo Dinâmico ou Texto
        ============================================ */}
        {item.logoPath ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative mt-2 h-20 w-64 md:h-32 md:w-80 lg:h-40 lg:w-96 xl:w-[450px]"
          >
            <Image
              src={buildImageUrl(item.logoPath, '/w500')}
              alt={item.title}
              fill
              className="object-contain object-left drop-shadow-2xl"
              priority
              sizes="(max-width: 768px) 256px, 450px"
            />
          </motion.div>
        ) : (
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-3 font-display text-4xl font-bold leading-tight tracking-tight drop-shadow-lg md:text-5xl lg:text-7xl"
          >
            {item.title}
          </motion.h1>
        )}

        {/* ============================================
            METADADOS: Rating, Ano, Duração, Capítulos
        ============================================ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-4 flex flex-wrap items-center gap-3 text-sm font-medium text-text-secondary md:text-base"
        >
          {/* Rating de relevância */}
          <span className="font-bold text-sea-green drop-shadow-sm">
            {(item.rating * 10).toFixed(0)}% Relevante
          </span>
          
          {/* Ano de lançamento */}
          {item.year > 0 && <span>{item.year}</span>}
          
          {/* Duração (filmes) */}
          {item.type === 'movie' && item.runtime && item.runtime > 0 && (
            <span>{Math.floor(item.runtime / 60)}h {item.runtime % 60}min</span>
          )}
          
          {/* Número de episódios/capítulos (séries/novelas) */}
          {(item.type === 'novela' || item.type === 'series') && item.numberOfEpisodes && item.numberOfEpisodes > 0 && (
            <span>{item.numberOfEpisodes} Capítulos</span>
          )}

          {/* Total de avaliações (apenas desktop) */}
          {item.voteCount > 0 && (
            <span className="hidden md:inline">{item.voteCount.toLocaleString('pt-BR')} avaliações</span>
          )}
        </motion.div>

        {/* ============================================
            CRIADOR/AUTOR (para séries/novelas)
        ============================================ */}
        {item.creator && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-1 text-sm font-semibold text-text-muted drop-shadow-md"
          >
            {item.creator}
          </motion.p>
        )}

        {/* ============================================
            SINOPSE
        ============================================ */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mt-4 line-clamp-3 text-sm leading-relaxed text-text-secondary md:text-base"
        >
          {item.overview}
        </motion.p>

        {/* ============================================
            BOTÃO DE AÇÃO
        ============================================ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-6 flex flex-wrap items-center gap-3"
        >
          <button
            onClick={() => onOpenModal?.(item)}
            className="flex min-w-[140px] items-center justify-center gap-2 rounded-md bg-white px-6 py-2.5 font-bold text-navy-deep shadow-lg transition-all hover:scale-105 hover:bg-white/90 active:scale-95"
          >
            <Info size={20} />
            Mais Informações
          </button>
        </motion.div>

        {/* ============================================
            PROVEDORES DE STREAMING
        ============================================ */}
        {item.watchProviders && item.watchProviders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
          >
            <WatchProviders providers={item.watchProviders} />
          </motion.div>
        )}
      </div>

      {/* ============================================
          BOTÃO MUTE/UNMUTE (quando há trailer)
      ============================================ */}
      {showTrailer && trailerKey && (
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute right-6 bottom-[12%] z-10 rounded-full border border-white/30 p-2 text-text-secondary transition-colors hover:text-text-primary md:right-12 md:bottom-[15%]"
          aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}
    </section>
  );
}
