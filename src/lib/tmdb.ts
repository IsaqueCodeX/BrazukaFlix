/**
 * ============================================
 * MÓDULO DE INTEGRAÇÃO COM A API TMDB
 * ============================================
 * 
 * Este módulo é responsável por toda a comunicação com a API do The Movie Database (TMDB).
 * Todas as requisições são autenticadas via Bearer Token e filtradas para retornar
 * exclusivamente conteúdo brasileiro (original_language=pt, origin_country=BR).
 * 
 * As chaves de API são obtidas exclusivamente de variáveis de ambiente (process.env),
 * garantindo que nunca sejam expostas no código cliente.
 */

import { MediaItem, MediaType } from '@/types/media';
import { TMDB_CONFIG } from './constants';

// ============================================
// CONFIGURAÇÃO E AUTENTICAÇÃO
// ============================================

// Acesso às variáveis de ambiente (servidor-side only)
const API_KEY = process.env.TMDB_API_KEY!;
const ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN!;
const { baseUrl, imageBaseUrl } = TMDB_CONFIG;

/**
 * Headers padrão para requisições autenticadas via Bearer Token.
 * Utiliza o Access Token para autenticação segura.
 */
const headers = {
  Authorization: `Bearer ${ACCESS_TOKEN}`,
  'Content-Type': 'application/json;charset=utf-8',
};

// ============================================
// INTERFACES DE TIPAGEM (DTOs)
// ============================================

/** Interface bruta retornada pela TMDB para filmes */
interface TMDBMovieRaw {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  original_language: string;
  popularity: number;
}

/** Interface de resposta paginada da TMDB */
interface TMDBPageResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: TMDBMovieRaw[];
}

/** Interface de vídeos da TMDB */
interface TMDBVideoResponse {
  results: Array<{
    key: string;
    site: string;
    type: string;
    official: boolean;
  }>;
}

/** Interface detalhada com dados adicionais (Append to Response) */
export interface TMDBMediaDetailsRaw extends TMDBMovieRaw {
  runtime?: number;
  number_of_episodes?: number;
  created_by?: Array<{ name: string }>;
  images?: {
    logos: Array<{ file_path: string; iso_639_1: string | null }>;
  };
  'watch/providers'?: {
    results: {
      BR?: {
        flatrate?: Array<{ provider_id: number; provider_name: string; logo_path: string }>;
        rent?: Array<{ provider_id: number; provider_name: string; logo_path: string }>;
        buy?: Array<{ provider_id: number; provider_name: string; logo_path: string }>;
        free?: Array<{ provider_id: number; provider_name: string; logo_path: string }>;
        ads?: Array<{ provider_id: number; provider_name: string; logo_path: string }>;
      };
    };
  };
}

// ============================================
// FUNÇÕES UTILITÁRIAS
// ============================================

/**
 * Constrói a URL completa de uma imagem TMDB.
 * @param path - Caminho relativo da imagem fornecido pela API
 * @param size - Tamanho da imagem desejado (padrão: /w780)
 * @returns URL completa ou fallback do Brazuka Flix se path for null/inválido
 */
export function buildImageUrl(
  path: string | null,
  size: string = '/w780'
): string {
  if (!path || path.trim() === '') {
    return '/brazuka-fallback.svg';
  }
  return `${imageBaseUrl}${size}${path}`;
}

/**
 * Constrói URL para backdrop (imagem de fundo).
 * Usa fallback do Brazuka Flix se não houver imagem.
 */
export function buildBackdropUrl(path: string | null): string {
  if (!path || path.trim() === '') {
    return '/brazuka-fallback.svg';
  }
  return `${imageBaseUrl}/w1280${path}`;
}

/**
 * Constrói URL para poster em alta resolução.
 */
export function buildPosterUrl(path: string | null): string {
  if (!path || path.trim() === '') {
    return '/brazuka-fallback.svg';
  }
  return `${imageBaseUrl}/w500${path}`;
}

/**
 * Transforma os dados brutos da TMDB no formato padronizado MediaItem.
 * Realiza o mapeamento e tratamento de dados para o formato interno da aplicação.
 * @param raw - Dados brutos retornados pela API
 * @param type - Tipo de mídia (movie, series, novela)
 * @returns Objeto MediaItem formatado
 */
function mapToMediaItem(raw: TMDBMovieRaw | TMDBMediaDetailsRaw, type: MediaType): MediaItem {
  // Extrai a data de lançamento (filme ou série)
  const releaseDate = raw.release_date || raw.first_air_date || '';
  const rating = Math.round(raw.vote_average * 10) / 10;
  
  // Heurística para Troféu "Canary/Aclamado" - obras com alta avaliação e muitos votos
  const hasAward = raw.vote_count >= 800 && rating >= 7.5;

  // Inicializa variáveis opcionais
  let logoPath: string | null = null;
  let watchProviders: any[] = [];
  let isFreeOnYT = false;
  let runtime: number | undefined;
  let numberOfEpisodes: number | undefined;
  let creator: string | undefined;

  // Processamento para interface estendida (detalhes completos)
  if ('watch/providers' in raw || 'images' in raw) {
    const details = raw as TMDBMediaDetailsRaw;
    runtime = details.runtime;
    numberOfEpisodes = details.number_of_episodes;
    
    // Tenta obter o logo em português, caso contrário usa o primeiro disponível
    const logos = details.images?.logos || [];
    const ptLogo = logos.find((l) => l.iso_639_1 === 'pt' || l.iso_639_1 === 'BR');
    logoPath = ptLogo ? ptLogo.file_path : (logos.length > 0 ? logos[0].file_path : null);

    // Extrai criadores de séries/novelas
    if (details.created_by && details.created_by.length > 0) {
      creator = `Uma obra de ${details.created_by[0].name}`;
    }

    // Processa provedores de streaming disponíveis no Brasil
    const brProviders = details['watch/providers']?.results?.BR;
    if (brProviders) {
      const allProviders = new Map();

      /**
       * Adiciona provedores ao mapa, evitando duplicatas.
       * @param list - Lista de provedores
       * @param typeStr - Tipo de disponibilidade (flatrate, free, ads)
       */
      const addToMap = (list: any[], typeStr: string) => {
        if (!list) return;
        list.forEach((p) => {
          if (!allProviders.has(p.provider_id)) {
            allProviders.set(p.provider_id, {
              id: p.provider_id,
              name: p.provider_name,
              logoPath: p.logo_path,
              type: typeStr
            });
            // Detecta se está disponível gratuitamente no YouTube
            if (p.provider_name.toLowerCase().includes('youtube') && typeStr === 'free') {
              isFreeOnYT = true;
            }
          }
        });
      };

      addToMap(brProviders.flatrate || [], 'flatrate');
      addToMap(brProviders.free || [], 'free');
      addToMap(brProviders.ads || [], 'ads');
      
      watchProviders = Array.from(allProviders.values());
    }
  }

  return {
    id: raw.id,
    title: raw.title || raw.name || 'Sem título',
    overview: raw.overview || 'Descrição não disponível.',
    backdropPath: raw.backdrop_path || '',
    posterPath: raw.poster_path || '',
    type,
    year: releaseDate ? parseInt(releaseDate.substring(0, 4), 10) : 0,
    rating,
    genreIds: raw.genre_ids,
    voteCount: raw.vote_count,
    originalLanguage: raw.original_language,
    
    // Props elevadas para versão Premium
    logoPath,
    runtime,
    numberOfEpisodes,
    creator,
    watchProviders,
    hasAward,
    isFreeOnYT
  };
}

/**
 * Função genérica para requisições na API TMDB.
 * Inclui tratamento de erros e cache via ISR (Incremental Static Regeneration).
 * @param endpoint - Endpoint da API (ex: /discover/movie)
 * @param params - Parâmetros de query string
 * @returns Dados tipados da resposta
 */
async function fetchTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const searchParams = new URLSearchParams({
    api_key: API_KEY,
    language: 'pt-BR',
    ...params,
  });

  const url = `${baseUrl}${endpoint}?${searchParams}`;

  const res = await fetch(url, {
    headers,
    next: { revalidate: 3600 }, // Cache de 1 hora (ISR)
  });

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// ============================================
// FUNÇÕES PÚBLICAS DE BUSCA
// ============================================

/**
 * Busca filmes brasileiros populares ordenados por popularidade.
 * @param page - Número da página para paginação
 * @returns Lista de filmes em formato MediaItem (array vazio em caso de erro)
 */
export async function getBrazilianMovies(page: string = '1'): Promise<MediaItem[]> {
  try {
    const data = await fetchTMDB<TMDBPageResponse>('/discover/movie', {
      with_original_language: 'pt',
      with_origin_country: 'BR',
      sort_by: 'popularity.desc',
      page,
    });

    return data.results
      .filter((m) => m.poster_path && m.backdrop_path)
      .map((m) => mapToMediaItem(m, 'movie'));
  } catch (error) {
    console.error('Erro ao buscar filmes brasileiros:', error);
    return [];
  }
}

/**
 * Busca séries brasileiras populares ordenadas por popularidade.
 * @param page - Número da página para paginação
 * @returns Lista de séries em formato MediaItem (array vazio em caso de erro)
 */
export async function getBrazilianSeries(page: string = '1'): Promise<MediaItem[]> {
  try {
    const data = await fetchTMDB<TMDBPageResponse>('/discover/tv', {
      with_original_language: 'pt',
      with_origin_country: 'BR',
      sort_by: 'popularity.desc',
      page,
    });

    return data.results
      .filter((m) => m.poster_path && m.backdrop_path)
      .map((m) => mapToMediaItem(m, 'series'));
  } catch (error) {
    console.error('Erro ao buscar séries brasileiras:', error);
    return [];
  }
}

/**
 * Busca novelas brasileiras (gênero soap/telenovela - genre_id 10766).
 * @param page - Número da página para paginação
 * @returns Lista de novelas em formato MediaItem (array vazio em caso de erro)
 */
export async function getBrazilianNovelas(page: string = '1'): Promise<MediaItem[]> {
  try {
    const data = await fetchTMDB<TMDBPageResponse>('/discover/tv', {
      with_original_language: 'pt',
      with_origin_country: 'BR',
      with_genres: '10766',
      sort_by: 'popularity.desc',
      page,
    });

    return data.results
      .filter((m) => m.poster_path && m.backdrop_path)
      .map((m) => mapToMediaItem(m, 'novela'));
  } catch (error) {
    console.error('Erro ao buscar novelas brasileiras:', error);
    return [];
  }
}

/**
 * Busca filmes brasileiros com melhor avaliação (Clássicos).
 * Ordena por nota média com mínimo de 100 votos.
 * @returns Lista de clássicos em formato MediaItem (array vazio em caso de erro)
 */
export async function getBrazilianTopRated(): Promise<MediaItem[]> {
  try {
    const data = await fetchTMDB<TMDBPageResponse>('/discover/movie', {
      with_original_language: 'pt',
      with_origin_country: 'BR',
      sort_by: 'vote_average.desc',
      'vote_count.gte': '100',
      page: '1',
    });

    return data.results
      .filter((m) => m.poster_path && m.backdrop_path)
      .map((m) => mapToMediaItem(m, 'movie'));
  } catch (error) {
    console.error('Erro ao buscar top rated brasileiro:', error);
    return [];
  }
}

/**
 * Busca lançamentos brasileiros recentes (últimos 6 meses).
 * @returns Lista de lançamentos em formato MediaItem (array vazio em caso de erro)
 */
export async function getBrazilianRecent(): Promise<MediaItem[]> {
  try {
    const now = new Date();
    const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
    const dateFrom = threeMonthsAgo.toISOString().split('T')[0];

    const data = await fetchTMDB<TMDBPageResponse>('/discover/movie', {
      with_original_language: 'pt',
      with_origin_country: 'BR',
      sort_by: 'release_date.desc',
      'release_date.gte': dateFrom,
      page: '1',
    });

    return data.results
      .filter((m) => m.poster_path)
      .map((m) => mapToMediaItem(m, 'movie'));
  } catch (error) {
    console.error('Erro ao buscar lançamentos brasileiros:', error);
    return [];
  }
}

/**
 * Busca séries brasileiras com alta avaliação (Séries da Realidade).
 * @returns Lista de séries bem avaliadas em formato MediaItem (array vazio em caso de erro)
 */
export async function getBrazilianTopSeries(): Promise<MediaItem[]> {
  try {
    const data = await fetchTMDB<TMDBPageResponse>('/discover/tv', {
      with_original_language: 'pt',
      with_origin_country: 'BR',
      sort_by: 'vote_average.desc',
      'vote_count.gte': '20',
      page: '1',
    });

    return data.results
      .filter((m) => m.poster_path && m.backdrop_path)
      .map((m) => mapToMediaItem(m, 'series'));
  } catch (error) {
    console.error('Erro ao buscar top series brasileiro:', error);
    return [];
  }
}

/**
 * Busca o trailer de um filme ou série no YouTube.
 * Prioriza trailer oficial em português, depois em inglês.
 * @param mediaId - ID do filme ou série na TMDB
 * @param type - Tipo de mídia (movie ou series)
 * @returns Chave do vídeo do YouTube ou null se não encontrado
 */
export async function getTrailerKey(
  mediaId: number,
  type: MediaType
): Promise<string | null> {
  const mediaType = type === 'movie' ? 'movie' : 'tv';

  try {
    const data = await fetchTMDB<TMDBVideoResponse>(
      `/${mediaType}/${mediaId}/videos`,
      { language: 'pt-BR' }
    );

    // Prioriza trailer oficial em português, depois em inglês, depois qualquer vídeo do YouTube
    const trailer =
      data.results.find(
        (v) => v.type === 'Trailer' && v.site === 'YouTube' && v.official
      ) ||
      data.results.find((v) => v.type === 'Trailer' && v.site === 'YouTube') ||
      data.results.find((v) => v.site === 'YouTube');

    return trailer?.key || null;
  } catch {
    return null;
  }
}

/**
 * Busca detalhes ricos de uma mídia específica.
 * Utilizado para preencher os dados da Billboard (Hero).
 * Inclui: Logos, Watch Providers, Criadores, Duração.
 * @param mediaId - ID do filme ou série na TMDB
 * @param type - Tipo de mídia (movie ou series)
 * @returns Objeto MediaItem com todos os detalhes ou null em caso de erro
 */
export async function getMediaDetails(
  mediaId: number,
  type: MediaType
): Promise<MediaItem | null> {
  const mediaType = type === 'movie' ? 'movie' : 'tv';

  try {
    const rawData = await fetchTMDB<TMDBMediaDetailsRaw>(
      `/${mediaType}/${mediaId}`,
      {
        append_to_response: 'images,watch/providers,credits',
        include_image_language: 'pt,BR,null'
      }
    );
    
    return mapToMediaItem(rawData, type);
  } catch {
    return null;
  }
}

/**
 * Busca títulos similares a um filme ou série.
 * Utilizado para a seção "Títulos Similares" no modal.
 * @param mediaId - ID do filme ou série na TMDB
 * @param type - Tipo de mídia (movie ou series)
 * @returns Lista de títulos similares em formato MediaItem
 */
export async function getSimilar(
  mediaId: number,
  type: MediaType
): Promise<MediaItem[]> {
  const mediaType = type === 'movie' ? 'movie' : 'tv';

  try {
    const data = await fetchTMDB<TMDBPageResponse>(
      `/${mediaType}/${mediaId}/similar`,
      { page: '1' }
    );

    return data.results
      .filter((m) => m.poster_path)
      .slice(0, 12)
      .map((m) => mapToMediaItem(m, type));
  } catch {
    return [];
  }
}

/**
 * Função agregadora que busca todas as categorias de conteúdo para a página principal.
 * Utiliza Promise.allSettled para resiliência - se uma API falhar, as outras continuam funcionando.
 * @returns Array de categorias formatadas para display
 */
export async function getAllCategories() {
  const results = await Promise.allSettled([
    getBrazilianNovelas(),
    getBrazilianTopRated(),
    getBrazilianTopSeries(),
    getBrazilianMovies('2'),
    getBrazilianMovies(),
    getBrazilianRecent(),
  ]);

  const [
    novelasResult,
    topRatedMoviesResult,
    topSeriesResult,
    classicMoviesResult,
    popularMoviesResult,
    recentMoviesResult,
  ] = results;

  const novelas = novelasResult.status === 'fulfilled' ? novelasResult.value : [];
  const topRatedMovies = topRatedMoviesResult.status === 'fulfilled' ? topRatedMoviesResult.value : [];
  const topSeries = topSeriesResult.status === 'fulfilled' ? topSeriesResult.value : [];
  const classicMovies = classicMoviesResult.status === 'fulfilled' ? classicMoviesResult.value : [];
  const popularMovies = popularMoviesResult.status === 'fulfilled' ? popularMoviesResult.value : [];
  const recentMovies = recentMoviesResult.status === 'fulfilled' ? recentMoviesResult.value : [];

  return [
    {
      slug: 'em-alta-no-brasil',
      title: 'Em Alta no Brasil',
      items: popularMovies,
    },
    {
      slug: 'novelas-que-pararam-o-pais',
      title: 'Novelas Históricas',
      items: novelas,
    },
    {
      slug: 'cinema-de-retomada',
      title: 'Cinema de Retomada',
      items: topRatedMovies,
    },
    {
      slug: 'series-da-realidade',
      title: 'Séries da Realidade',
      items: topSeries,
    },
    {
      slug: 'classicos-imortais',
      title: 'Clássicos Imortais',
      items: classicMovies,
    },
    {
      slug: 'lancamentos-nacionais',
      title: 'Lançamentos Nacionais',
      items: recentMovies,
    },
  ];
}
