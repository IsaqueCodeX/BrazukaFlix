'use client';

import { Home, Search, Play, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 z-40 w-full border-t border-white/10 bg-black/80 backdrop-blur-md md:hidden">
      <div className="flex h-16 items-center justify-around">
        <Link
          href="/browse"
          className={`flex flex-col items-center justify-center gap-1 p-2 ${
            isActive('/browse') ? 'text-accent-yellow' : 'text-white/60'
          }`}
        >
          <Home size={22} strokeWidth={isActive('/browse') ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Início</span>
        </Link>

        <Link
          href="/search"
          className={`flex flex-col items-center justify-center gap-1 p-2 ${
            isActive('/search') ? 'text-accent-yellow' : 'text-white/60'
          }`}
        >
          <Search size={22} strokeWidth={isActive('/search') ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Buscar</span>
        </Link>

        <Link
          href="/my-list"
          className={`flex flex-col items-center justify-center gap-1 p-2 ${
            isActive('/my-list') ? 'text-accent-yellow' : 'text-white/60'
          }`}
        >
          <Play size={22} strokeWidth={isActive('/my-list') ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Minha Lista</span>
        </Link>

        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center gap-1 p-2 ${
            isActive('/profile') ? 'text-accent-yellow' : 'text-white/60'
          }`}
        >
          <User size={22} strokeWidth={isActive('/profile') ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Perfil</span>
        </Link>
      </div>
    </nav>
  );
}
