// API Route — Detalhes de mídia para o Modal
// Roda no servidor onde as variáveis de ambiente TMDB estão disponíveis

import { NextRequest, NextResponse } from 'next/server';
import { getMediaDetails, getTrailerKey, getSimilar } from '@/lib/tmdb';
import { MediaType } from '@/types/media';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = request.nextUrl;
  const type = (searchParams.get('type') ?? 'movie') as MediaType;

  const mediaId = parseInt(id, 10);
  if (isNaN(mediaId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    const [details, trailerKey, similar] = await Promise.all([
      getMediaDetails(mediaId, type),
      getTrailerKey(mediaId, type),
      getSimilar(mediaId, type),
    ]);

    return NextResponse.json({ details, trailerKey, similar });
  } catch (error) {
    console.error('Erro na API Route /api/media:', error);
    return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 });
  }
}
