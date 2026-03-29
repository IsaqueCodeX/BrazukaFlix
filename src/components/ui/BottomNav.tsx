'use client';

import { useState, useEffect, useCallback } from 'react';
import { Home, Search, Play, User } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const isBrowsePage = pathname === '/browse' || pathname === '/';

  const isActive = (path: string) => {
    if (path === '/browse') {
      return pathname === '/browse' || pathname === '/';
    }
    return pathname === path;
  };

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

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent, href: string) => {
    if (!touchStart) return;
    const touch = e.changedTouches[0];
    const deltaX = Math.abs(touch.clientX - touchStart.x);
    const deltaY = Math.abs(touch.clientY - touchStart.y);
    
    if (deltaX < 10 && deltaY < 10) {
      router.push(href);
    }
    setTouchStart(null);
  };

  const navItems = [
    { icon: Home, label: 'Início', href: '/browse', active: isActive('/browse') },
    { icon: Search, label: 'Buscar', href: '/browse', active: isActive('/browse') },
    { icon: Play, label: 'Minha Lista', href: '/my-list', active: isActive('/my-list') },
    { icon: User, label: 'Perfil', href: '/profile', active: isActive('/profile') },
  ];

  return (
    <nav 
      className={`fixed bottom-0 left-0 z-40 w-full border-t border-white/10 bg-dark-green/70 backdrop-blur-lg transition-transform duration-300 md:hidden ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
      onTouchStart={handleTouchStart}
    >
      <div className="flex h-16 items-center justify-around px-1">
        {navItems.map((item) => (
          <button
            key={item.href}
            className={`flex flex-col items-center justify-center gap-0.5 touch-manipulation py-2 px-2 min-w-[60px] rounded-lg transition-all active:scale-90 ${
              item.active ? 'text-accent-yellow' : 'text-white/70 hover:text-white'
            }`}
            onClick={() => router.push(item.href)}
            onTouchEnd={(e) => handleTouchEnd(e, item.href)}
          >
            <item.icon size={24} strokeWidth={item.active ? 2.5 : 2} />
            <span className="text-[10px] font-medium whitespace-nowrap">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
