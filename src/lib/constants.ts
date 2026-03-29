// Constantes centrais do Brazuka Flix
// Define perfis regionais e categorias de conteúdo

import { Profile } from '@/types/media';

/** Perfis regionais disponíveis para seleção */
export const PROFILES: Profile[] = [
  {
    id: 'norte',
    name: 'Ana',
    region: 'norte',
    avatar: '/perfil/amazona.png',
    color: '#009739',
    description: 'Floresta, rios e a imensidão da Amazônia',
  },
  {
    id: 'nordeste',
    name: 'João',
    region: 'nordeste',
    avatar: '/perfil/bahia.png',
    color: '#FFDF00',
    description: 'Axé, forró e a magia do Nordeste',
  },
  {
    id: 'centro-oeste',
    name: 'Carolina',
    region: 'centro-oeste',
    avatar: '/perfil/goiana.png',
    color: '#FF6B35',
    description: 'Cerrado, sertanejo e o coração do Brasil',
  },
  {
    id: 'sudeste',
    name: 'Marcelo',
    region: 'sudeste',
    avatar: '/perfil/paulista.png',
    color: '#002776',
    description: 'Metrópole, arte e diversidade cultural',
  },
  {
    id: 'sul',
    name: 'Tiago',
    region: 'sul',
    avatar: '/perfil/gaucho.png',
    color: '#E74C3C',
    description: 'Tradição, chimarrão e o espírito gaúcho',
  },
  {
    id: 'brasil-geral',
    name: 'Fernanda',
    region: 'brasil-geral',
    avatar: '/perfil/catarina.png',
    color: '#009739',
    description: 'Todo o Brasil em um só lugar',
  },
];

/** Categorias de conteúdo brasileiro para organização na Home */
export const CONTENT_CATEGORIES = [
  {
    slug: 'novelas-que-pararam-o-pais',
    title: 'Novelas que Pararam o País',
  },
  {
    slug: 'cinema-de-retomada',
    title: 'Cinema de Retomada',
  },
  {
    slug: 'series-da-realidade',
    title: 'Séries da Realidade',
  },
  {
    slug: 'classicos-imortais',
    title: 'Clássicos Imortais',
  },
  {
    slug: 'em-alta-no-brasil',
    title: 'Em Alta no Brasil',
  },
  {
    slug: 'lancamentos-nacionais',
    title: 'Lançamentos Nacionais',
  },
] as const;

/** Configurações da TMDB API para conteúdo brasileiro */
export const TMDB_CONFIG = {
  baseUrl: 'https://api.themoviedb.org/3',
  imageBaseUrl: 'https://image.tmdb.org/t/p',
  posterSizes: {
    small: '/w342',
    medium: '/w500',
    large: '/w780',
  },
  backdropSizes: {
    small: '/w780',
    large: '/w1280',
    original: '/original',
  },
  // Filtros obrigatórios para conteúdo brasileiro
  filters: {
    originalLanguage: 'pt',
    originCountry: 'BR',
  },
} as const;
