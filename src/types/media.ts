// Tipos centrais do Brazuka Flix
// Define a estrutura de dados para mídias, perfis e categorias

/** Tipo de mídia disponível na plataforma */
export type MediaType = 'movie' | 'series' | 'novela';

/** Regiões geográficas do Brasil usadas para perfis */
export type BrazilRegion =
  | 'norte'
  | 'nordeste'
  | 'centro-oeste'
  | 'sudeste'
  | 'sul'
  | 'brasil-geral';

/** Perfil regional do usuário */
export interface Profile {
  id: string;
  name: string;
  region: BrazilRegion;
  avatar: string;
  color: string;
  description: string;
}

/** Provedor de Streaming Legal do Brasil */
export interface WatchProvider {
  id: number;
  name: string;
  logoPath: string;
  type: 'flatrate' | 'rent' | 'buy' | 'free' | 'ads';
}

/** Item de mídia (filme, série ou novela) */
export interface MediaItem {
  id: number;
  title: string;
  overview: string;
  backdropPath: string;
  posterPath: string;
  type: MediaType;
  year: number;
  rating: number;
  genreIds: number[];
  voteCount: number;
  originalLanguage: string;
  trailerKey?: string;
  
  // Propriedades Estendidas (UX Premium)
  logoPath?: string | null;
  runtime?: number; // Para filmes (minutos)
  numberOfEpisodes?: number; // Para novelas/séries (capítulos)
  creator?: string; // Para novelas ("Uma obra de ...")
  watchProviders?: WatchProvider[]; // "Onde Assistir"
  hasAward?: boolean; // Heurística de Troféu/Selo Canário
  isFreeOnYT?: boolean; // Tag Grátis no YT
}

/** Categoria de conteúdo agrupada para exibição */
export interface MediaCategory {
  slug: string;
  title: string;
  items: MediaItem[];
}

/** Resposta paginada da API TMDB */
export interface TMDBResponse {
  page: number;
  totalPages: number;
  totalResults: number;
  results: MediaItem[];
}
