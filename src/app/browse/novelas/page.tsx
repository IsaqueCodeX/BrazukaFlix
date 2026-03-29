import { Suspense } from 'react';
import { Metadata } from 'next';
import { getBrazilianNovelas, getMediaDetails } from '@/lib/tmdb';
import BrowseCategoryClient from '@/components/browse/BrowseCategoryClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Novelas Brasileiras | Brazuka Flix',
  description: 'Reviva as maiores novelas da história da TV brasileira. Clássicos do horário nobre e produções icônicas.',
  keywords: ['novelas brasileiras', 'novela brasileira', 'novela clássica', 'novela antiga', 'brazuka flix'],
  openGraph: {
    title: 'Novelas Brasileiras | Brazuka Flix',
    description: 'Reviva as maiores novelas da história da TV brasileira.',
  },
};

export default async function NovelasPage() {
  const novelas = await getBrazilianNovelas('1');
  const novelasPage2 = await getBrazilianNovelas('2');
  const novelasPage3 = await getBrazilianNovelas('3');
  
  const allNovelas = [...novelas, ...novelasPage2, ...novelasPage3];
  
  const uniqueNovelas = Array.from(
    new Map(allNovelas.map(m => [m.id, m])).values()
  );

  const billboardItem = uniqueNovelas[0];
  const details = await getMediaDetails(billboardItem.id, 'novela');

  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-navy-deep">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-dark-green border-t-transparent" />
      </div>
    }>
      <BrowseCategoryClient 
        title="Novelas Brasileiras"
        items={uniqueNovelas}
        billboardItem={details || billboardItem}
        type="novela"
      />
    </Suspense>
  );
}
