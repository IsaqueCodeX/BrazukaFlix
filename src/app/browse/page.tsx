// Página Browse — Server Component que busca dados da TMDB
// Renderiza Billboard, MovieRows com conteúdo brasileiro real

import { Metadata } from 'next';
import { getAllCategories, getTrailerKey, getMediaDetails, getBrazilianMovies, getBrazilianSeries, getBrazilianNovelas } from '@/lib/tmdb';
import BrowseClient from './BrowseClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Navegar | Brazuka Flix',
  description: 'Explore filmes, séries e novelas brasileiras. O melhor do cinema nacional, séries da Globo, SBT e produções independentes em um só lugar.',
  keywords: ['streaming brasileiro', 'assistir online', 'filmes grátis', 'séries nacionais', 'brazuka flix'],
  openGraph: {
    title: 'Navegar | Brazuka Flix',
    description: 'Explore filmes, séries e novelas brasileiras.',
  },
};

export default async function BrowsePage({ searchParams }: { searchParams: Promise<{ type?: string; list?: string }> }) {
  const params = await searchParams;
  const type = params.type;
  const list = params.list;

  // Se há um filtro de tipo, buscar apenas esses dados
  let filteredItems: any[] = [];
  let viewTitle = '';
  
  if (type === 'movie') {
    const movies = await getBrazilianMovies('1');
    const movies2 = await getBrazilianMovies('2');
    filteredItems = [...movies, ...movies2];
    viewTitle = 'Filmes Nacionais';
  } else if (type === 'series') {
    const series = await getBrazilianSeries('1');
    const series2 = await getBrazilianSeries('2');
    filteredItems = [...series, ...series2];
    viewTitle = 'Séries e Docs';
  } else if (type === 'novela') {
    const novelas = await getBrazilianNovelas('1');
    const novelas2 = await getBrazilianNovelas('2');
    filteredItems = [...novelas, ...novelas2];
    viewTitle = 'Novelas Clássicas';
  }

  // Busca todas as categorias de conteúdo brasileiro via TMDB API
  const categories = await getAllCategories();

  // Destaca um grande clássico moderno do cinema nacional (Bacurau),
  // garantindo ausência de marcas d'água internacionais e vídeo de alta imersão.
  const PREMIUM_BILLBOARD_ID = 446159;
  let billboardItem = await getMediaDetails(PREMIUM_BILLBOARD_ID, 'movie');

  // Fallback caso a API falhe
  if (!billboardItem) {
    const allItems = categories.flatMap((c) => c.items);
    billboardItem = allItems.find((item) => item.backdropPath) || allItems[0];
    const details = await getMediaDetails(billboardItem.id, billboardItem.type);
    if (details) billboardItem = details;
  }

  // Busca trailer do item em destaque na TMDB (YouTube)
  let trailerKey: string | null = null;
  if (billboardItem?.type === 'movie' || billboardItem?.type === 'series' || billboardItem?.type === 'novela') {
    trailerKey = await getTrailerKey(billboardItem.id, billboardItem.type);
  }

  return (
    <BrowseClient
      categories={categories}
      billboardItem={billboardItem}
      trailerKey={trailerKey}
      initialType={type}
      initialList={list}
      filteredItems={type ? filteredItems : undefined}
      viewTitle={viewTitle}
    />
  );
}
