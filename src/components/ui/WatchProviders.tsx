'use client';

import Image from 'next/image';
import { WatchProvider } from '@/types/media';
import { buildImageUrl } from '@/lib/tmdb';

interface WatchProvidersProps {
  providers?: WatchProvider[];
}

/**
 * Componente de Utilidade Pública: Renderiza miniaturas
 * das plataformas de streaming legais onde a obra está disponível.
 */
export function WatchProviders({ providers }: WatchProvidersProps) {
  if (!providers || providers.length === 0) return null;

  return (
    <div className="mt-6 flex flex-col gap-2">
      <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
        Onde Assistir Oficialmente
      </span>
      <div className="flex flex-wrap items-center gap-3">
        {providers.map((p) => (
          <div
            key={`${p.type}-${p.id}`}
            className="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-navy-medium shadow-lg transition-transform hover:scale-110 hover:border-white/50"
          >
            <Image
              src={buildImageUrl(p.logoPath, '/w92')}
              alt={p.name}
              fill
              className="object-cover"
              sizes="40px"
            />
            {/* Tooltip premium on Hover */}
            <div className="pointer-events-none absolute -top-8 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded bg-black/95 px-2 py-1 text-[11px] font-medium text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
              {p.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
