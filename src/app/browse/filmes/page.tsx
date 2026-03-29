import { Suspense } from 'react';
import { Metadata } from 'next';
import { getBrazilianMovies, getMediaDetails } from '@/lib/tmdb';
import BrowseCategoryClient from '@/components/browse/BrowseCategoryClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Filmes Brasileiros | Brazuka Flix',
  description: 'Assista aos melhores filmes brasileiros online. Classics, lançamentos e produções nacionais em alta qualidade.',
  keywords: ['filmes brasileiros', 'cinema nacional', 'filmes online', 'assistir filmes brasileiros', 'brazuka flix'],
  openGraph: {
    title: 'Filmes Brasileiros | Brazuka Flix',
    description: 'Assista aos melhores filmes brasileiros online.',
  },
};

export default async function FilmesPage() {
  const movies = await getBrazilianMovies('1');
  const moviesPage2 = await getBrazilianMovies('2');
  const moviesPage3 = await getBrazilianMovies('3');
  
  const allMovies = [...movies, ...moviesPage2, ...moviesPage3];
  
  const uniqueMovies = Array.from(
    new Map(allMovies.map(m => [m.id, m])).values()
  );

  const billboardItem = uniqueMovies[0];
  const details = await getMediaDetails(billboardItem.id, 'movie');

  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-navy-deep">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-dark-green border-t-transparent" />
      </div>
    }>
      <BrowseCategoryClient 
        title="Filmes Brasileiros"
        items={uniqueMovies}
        billboardItem={details || billboardItem}
        type="movie"
      />
    </Suspense>
  );
}
