import { Suspense } from 'react';
import { Metadata } from 'next';
import { getBrazilianSeries, getMediaDetails } from '@/lib/tmdb';
import BrowseCategoryClient from '@/components/browse/BrowseCategoryClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Séries Brasileiras | Brazuka Flix',
  description: 'Assista às melhores séries brasileiras online. Novelas, dramas, comedies e produções nacionais em alta qualidade.',
  keywords: ['séries brasileiras', 'series nacionais', 'assistir séries', 'novelas brasileiras', 'brazuka flix'],
  openGraph: {
    title: 'Séries Brasileiras | Brazuka Flix',
    description: 'Assista às melhores séries brasileiras online.',
  },
};

export default async function SeriesPage() {
  const series = await getBrazilianSeries('1');
  const seriesPage2 = await getBrazilianSeries('2');
  const seriesPage3 = await getBrazilianSeries('3');
  
  const allSeries = [...series, ...seriesPage2, ...seriesPage3];
  
  const uniqueSeries = Array.from(
    new Map(allSeries.map(m => [m.id, m])).values()
  );

  const billboardItem = uniqueSeries[0];
  const details = await getMediaDetails(billboardItem.id, 'series');

  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-navy-deep">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-dark-green border-t-transparent" />
      </div>
    }>
      <BrowseCategoryClient 
        title="Séries Brasileiras"
        items={uniqueSeries}
        billboardItem={details || billboardItem}
        type="series"
      />
    </Suspense>
  );
}
