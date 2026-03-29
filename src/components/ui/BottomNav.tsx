'use client';

import { useState, useEffect, useCallback } from 'react';
import { Home, Search, Play, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const isActive = (path: string) => pathname === path;

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    const isAtBottom = currentScrollY + clientHeight >= scrollHeight - 50;
    
    setIsVisible(isAtBottom);
    setLastScrollY(currentScrollY);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

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

  return (
    <nav 
      className={`fixed bottom-0 left-0 z-40 w-full border-t border-white/10 bg-black/80 backdrop-blur-md transition-transform duration-300 md:hidden ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
      onTouchStart={handleTouchStart}
    >
      <div className="flex h-16 items-center justify-around">
        <div
          className={`flex flex-col items-center justify-center gap-1 p-2 touch-manipulation ${
            isActive('/browse') ? 'text-accent-yellow' : 'text-white/60'
          }`}
          onTouchEnd={(e) => handleTouchEnd(e, '/browse')}
        >
          <Home size={22} strokeWidth={isActive('/browse') ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Início</span>
        </div>

        <div
          className={`flex flex-col items-center justify-center gap-1 p-2 touch-manipulation ${
            isActive('/search') ? 'text-accent-yellow' : 'text-white/60'
          }`}
          onTouchEnd={(e) => handleTouchEnd(e, '/search')}
        >
          <Search size={22} strokeWidth={isActive('/search') ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Buscar</span>
        </div>

        <div
          className={`flex flex-col items-center justify-center gap-1 p-2 touch-manipulation ${
            isActive('/my-list') ? 'text-accent-yellow' : 'text-white/60'
          }`}
          onTouchEnd={(e) => handleTouchEnd(e, '/my-list')}
        >
          <Play size={22} strokeWidth={isActive('/my-list') ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Minha Lista</span>
        </div>

        <div
          className={`flex flex-col items-center justify-center gap-1 p-2 touch-manipulation ${
            isActive('/profile') ? 'text-accent-yellow' : 'text-white/60'
          }`}
          onTouchEnd={(e) => handleTouchEnd(e, '/profile')}
        >
          <User size={22} strokeWidth={isActive('/profile') ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Perfil</span>
        </div>
      </div>
    </nav>
  );
}
