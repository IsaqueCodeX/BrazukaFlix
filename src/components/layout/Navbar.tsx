'use client';

/**
 * ============================================
 * COMPONENTE NAVBAR
 * ============================================
 * 
 * Barra de navegação fixa que exibe a logo, links de navegação e avatar do perfil.
 * Implementa comportamento adaptativo:
 * - Mobile: Menu hamburger, logo e perfil
 * - Desktop: Logo gigante, links de navegação e ícones de ação
 * 
 * Características:
 * - Transparente no topo da página
 * - Sólida com blur após scroll
 * - Animações suaves com Framer Motion
 * - Layout responsivo mobile-first
 */

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Search, Bell, ChevronDown, Menu, X } from 'lucide-react';

// ============================================
// TIPAGEM DAS PROPS
// ============================================

interface NavbarProps {
  /** Nome do perfil atualmente selecionado */
  profileName: string;
  /** URL da imagem de avatar do perfil */
  profileAvatar: string;
  /** Callback para troca de perfil */
  onSwitchProfile: () => void;
  /** Callback para busca de conteúdo */
  onSearch: (term: string) => void;
}

// ============================================
// CONSTANTES DE NAVEGAÇÃO
// ============================================

/** Links de navegação do menu principal */
const NAV_LINKS = [
  { label: 'Início', href: '/browse' },
  { label: 'Filmes Nacionais', href: '/browse?type=movie' },
  { label: 'Séries e Docs', href: '/browse?type=series' },
  { label: 'Novelas Clássicas', href: '/browse?type=novela' },
  { label: 'Minha Lista', href: '/browse/lista' },
];

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function Navbar({
  profileName,
  profileAvatar,
  onSwitchProfile,
  onSearch,
}: NavbarProps) {
  // Estados para controle de UI
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  // Referência para o input de busca (permite foco programático)
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ============================================
  // HOOKS DE EVENTO
  // ============================================

  /**
   * Hook para controle de transparência no scroll.
   * Detecta quando o usuáriorola a página além de 50px
   * e alterna o estado da navbar entre transparente e sólida.
   */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * Hook para foco automático no input de busca.
   * Quando o usuário abre a busca, o input recebe foco automaticamente.
   */
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  /**
   * Handler para mudança no input de busca.
   * Propaga o termo de busca para o componente pai.
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  // ============================================
  // RENDERIZAÇÃO
  // ============================================

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className={`fixed top-0 right-0 left-0 z-[100] transition-colors duration-500 h-16 md:h-20 ${
          isScrolled || isMobileMenuOpen || isSearchOpen
            ? 'bg-[var(--color-dark-green)]/95 shadow-md backdrop-blur-md'
            : 'bg-gradient-to-b from-[var(--color-dark-green)]/90 via-[var(--color-dark-green)]/40 to-transparent'
        }`}
        aria-label="Navegação principal"
      >
        {/* ============================================
            CONTAINER DESKTOP
            Layout: Logo + Links | Ícones de ação
        ============================================ */}
        <div className="hidden md:flex justify-start items-center h-full px-8 py-1">
          
          {/* Lado Esquerdo: Logo + Links de Navegação */}
          <div className="flex items-center">
            {/* Logo - flex-shrink-0 impede que seja comprimida pelos links */}
            <Link 
              href="/browse" 
              aria-label="Brazuka Flix - Página inicial"
              className="flex-shrink-0 flex items-center"
            >
              <div className="relative h-[160px] w-[260px]">
                <Image
                  src="/logo/brazukaflix.webp"
                  alt="Brazuka Flix"
                  fill
                  priority
                  className="object-contain object-left drop-shadow-2xl"
                />
              </div>
            </Link>

            {/* Links de navegação - ml-12 cria espaçamento após a logo */}
            <ul className="flex items-center gap-8 ml-12">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-white/80 transition-colors duration-200 hover:text-[var(--color-accent-yellow)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Lado Direito: Busca + Notificações + Perfil */}
          <div className="flex items-center gap-6 ml-auto">
            
            {/* Busca Animada estilo Netflix */}
            <div className="flex items-center justify-end">
              {isSearchOpen ? (
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Títulos, criadores..."
                  className="w-48 lg:w-60 bg-black/60 border border-white/30 rounded-md px-3 py-1.5 text-sm text-white placeholder-white/50 focus:outline-none focus:border-[var(--color-accent-yellow)]"
                />
              ) : null}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-2 transition-colors ${
                  isSearchOpen ? 'text-white' : 'text-white/80 hover:text-[var(--color-accent-yellow)]'
                }`}
                aria-label="Buscar conteúdo"
              >
                <Search size={22} />
              </button>
            </div>

            {/* Notificações com indicator visual */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowToast(!showToast);
                  if (!showToast) setTimeout(() => setShowToast(false), 6000);
                }}
                className="relative p-2 text-white/80 transition-colors hover:text-[var(--color-accent-yellow)]"
                aria-label="Notificações"
              >
                <Bell size={22} />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--color-accent-yellow)] animate-pulse" />
              </button>
              
              {/* Toast de boas-vindas com animação */}
              <AnimatePresence>
                {showToast && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-4 w-72 rounded-lg border border-white/10 bg-[var(--color-dark-green)]/95 p-5 shadow-2xl backdrop-blur-xl"
                  >
                    <p className="text-sm font-medium leading-relaxed text-white">
                      Olá, <span className="font-bold text-[var(--color-accent-yellow)]">{profileName}</span>! Muito obrigado por visitar o Brazuka Flix!
                    </p>
                    <p className="mt-2 text-xs text-white/70">
                      Sinta-se em casa para explorar o melhor do cinema nacional.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Perfil do usuário com dropdown indicator */}
            <button
              onClick={onSwitchProfile}
              className="group flex items-center gap-2 rounded-md transition-colors hover:bg-white/5"
              aria-label={`Perfil: ${profileName}. Clique para trocar perfil`}
            >
              <Image
                src={profileAvatar}
                alt={profileName}
                width={32}
                height={32}
                className="rounded-md"
              />
              <ChevronDown
                size={14}
                className="text-white/70 transition-transform group-hover:rotate-180"
              />
            </button>
          </div>
        </div>

        {/* ============================================
            CONTAINER MOBILE
            Layout: Hamburger | Logo | Perfil
        ============================================ */}
        <div className="md:hidden px-4 h-full flex items-center justify-between">
          
          {/* Menu Hamburger - Extrema esquerda */}
          <button
            className="p-2 text-white transition-colors hover:text-[var(--color-accent-yellow)] min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Logo Mobile - Extrema direita */}
          <Link 
            href="/browse" 
            aria-label="Brazuka Flix - Página inicial"
            className="flex-shrink-0 flex items-center"
          >
            <div className="relative h-[100px] w-[240px]">
              <Image
                src="/logo/brazukaflix.webp"
                alt="Brazuka Flix"
                fill
                priority
                className="object-contain object-left drop-shadow-2xl"
              />
            </div>
          </Link>

          {/* Perfil - Extrema direita */}
          <button
            onClick={onSwitchProfile}
            className="flex items-center gap-2 rounded-md transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={`Perfil: ${profileName}. Clique para trocar perfil`}
          >
            <Image
              src={profileAvatar}
              alt={profileName}
              width={36}
              height={36}
              className="rounded-md"
            />
          </button>
        </div>

        {/* ============================================
            MENU MOBILE EXPANDIDO
            Lista de links e busca mobile
        ============================================ */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-[var(--color-dark-green)]/95 border-t border-white/10"
            >
              <ul className="flex flex-col py-4 px-6 gap-4">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-medium text-white/80 transition-colors duration-200 hover:text-[var(--color-accent-yellow)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                {/* Campo de busca mobile */}
                <li className="mt-2">
                  <div className="flex items-center">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder="Buscar títulos..."
                      className="w-full bg-black/60 border border-white/30 rounded-md px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:border-[var(--color-accent-yellow)]"
                    />
                  </div>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
