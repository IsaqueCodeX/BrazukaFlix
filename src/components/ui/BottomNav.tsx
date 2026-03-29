'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Play, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  const isBrowsePage = pathname === '/browse' || pathname === '/';

  const isActive = (href: string) => pathname === href;

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    if (isBrowsePage) {
      setIsVisible(currentScrollY > 300);
    } else {
      setIsVisible(true);
    }
  }, [isBrowsePage]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (!isBrowsePage) {
      setIsVisible(true);
    }
  }, [isBrowsePage]);

  const navItems = [
    { icon: Home, label: 'Início', href: '/browse', active: isActive('/browse') },
    { icon: Search, label: 'Procurar', href: '/search', active: isActive('/search') },
    { icon: Play, label: 'Minha Lista', href: '/my-list', active: isActive('/my-list') },
    { icon: User, label: 'Perfil', href: '/profile', active: isActive('/profile') },
  ];

  return (
    <nav 
      className={`fixed bottom-0 left-0 z-[999] w-full border-t border-white/10 bg-dark-green/70 backdrop-blur-lg transition-transform duration-300 md:hidden ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="pointer-events-auto flex h-16 items-center justify-around px-1 touch-manipulation">
        {navItems.map((item, index) => (
          <Link
            key={`${item.href}-${index}`}
            href={item.href}
            className={`pointer-events-auto touch-manipulation flex flex-col items-center justify-center gap-0.5 px-2 min-w-[60px] rounded-lg transition-all active:scale-90 ${
              item.active ? 'text-accent-yellow' : 'text-white/70 hover:text-white'
            }`}
          >
            <item.icon size={24} strokeWidth={item.active ? 2.5 : 2} />
            <span className="text-[10px] font-medium whitespace-nowrap">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
