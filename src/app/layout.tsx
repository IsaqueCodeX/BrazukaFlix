// Root Layout — Configuração global do Brazuka Flix
// Inclui fontes (Montserrat + Inter), metadata SEO e providers

import type { Metadata } from 'next';
import { Inter, Montserrat, Poppins } from 'next/font/google';
import './globals.css';

// Fonte principal para corpo de texto
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

// Fonte display para títulos e destaques
const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  display: 'swap',
});

// Fonte Poppins para títulos
const poppins = Poppins({
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

// Metadata SEO global da plataforma
const APP_NAME = 'Brazuka Flix';
const APP_DEFAULT_TITLE = 'Brazuka Flix — Streaming de Cinema Brasileiro';
const APP_DEFAULT_DESCRIPTION = 'A maior plataforma de streaming dedicada à diversidade cultural do Brasil. Filmes, séries e novelas que contam a história do nosso povo.';

export const metadata: Metadata = {
  title: {
    default: APP_DEFAULT_TITLE,
    template: '%s | Brazuka Flix',
  },
  description: APP_DEFAULT_DESCRIPTION,
  keywords: [
    'streaming brasileiro',
    'filmes brasileiros',
    'novelas brasileiras',
    'séries brasileiras',
    'cinema nacional',
    'cultura brasileira',
    'brazuka flix',
  ],
  authors: [{ name: APP_NAME }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: APP_NAME,
    title: APP_DEFAULT_TITLE,
    description: APP_DEFAULT_DESCRIPTION,
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_DEFAULT_TITLE,
    description: APP_DEFAULT_DESCRIPTION,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${montserrat.variable} ${poppins.variable} h-full`}
    >
      <body className="min-h-full font-body antialiased">{children}</body>
    </html>
  );
}
