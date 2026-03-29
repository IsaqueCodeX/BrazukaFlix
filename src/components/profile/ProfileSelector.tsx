'use client';

// ProfileSelector — Tela inicial de seleção de perfil regional
// Exibe 6 perfis baseados nas regiões do Brasil com animações premium

import { motion, type Variants } from 'framer-motion';
import Image from 'next/image';
import { Profile } from '@/types/media';
import { PROFILES } from '@/lib/constants';

interface ProfileSelectorProps {
  /** Callback executado ao selecionar um perfil */
  onSelect: (profile: Profile) => void;
}

// Variantes de animação para o container principal
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

// Variantes de animação para cada card de perfil (entrada com stagger)
const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

// Animação de entrada do logo
const logoVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 14,
      delay: 0.1,
    },
  },
};

// Animação do subtítulo
const subtitleVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.2 },
  },
};

export default function ProfileSelector({ onSelect }: ProfileSelectorProps) {
  return (
    <section
      id="profile-selector"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12"
      aria-label="Seleção de perfil regional"
    >
      {/* Gradiente de fundo decorativo */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,100,0,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(85,107,47,0.1) 0%, transparent 50%)',
        }}
      />

      {/* Logo Brazuka Flix */}
      <motion.div
        variants={logoVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mb-6"
      >
        <Image
          src="/logo/brazukaflix.webp"
          alt="Brazuka Flix - Streaming Brasileiro"
          width={280}
          height={80}
          priority
          className="drop-shadow-2xl"
        />
      </motion.div>

      {/* Subtítulo */}
      <motion.h1
        variants={subtitleVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mb-12 text-center font-display text-xl font-medium tracking-wide text-text-secondary md:text-2xl"
      >
        Quem está assistindo?
      </motion.h1>

      {/* Grid de perfis regionais */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 grid w-full max-w-3xl grid-cols-3 gap-6 md:gap-12"
      >
        {PROFILES.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            onSelect={onSelect}
          />
        ))}
      </motion.div>

      {/* Texto inferior */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="relative z-10 mt-16 text-center text-sm text-text-muted"
      >
        Celebrando a diversidade do cinema brasileiro
      </motion.p>
    </section>
  );
}

// Card individual de perfil regional com efeitos de hover premium
function ProfileCard({
  profile,
  onSelect,
}: {
  profile: Profile;
  onSelect: (profile: Profile) => void;
}) {
  return (
    <motion.button
      variants={cardVariants}
      whileHover={{
        scale: 1.12,
        transition: { type: 'spring', stiffness: 300, damping: 15 },
      }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(profile)}
      className="group flex cursor-pointer flex-col items-center gap-3 p-2 focus-visible:outline-none"
      aria-label={`Perfil ${profile.name} — ${profile.description}`}
      id={`profile-${profile.id}`}
    >
      {/* Avatar com borda colorida e glow no hover */}
      <div
        className="relative rounded-full transition-all duration-300"
        style={
          {
            '--profile-color': profile.color,
          } as React.CSSProperties
        }
      >
        {/* Glow ring no hover */}
        <div
          className="absolute -inset-1 rounded-full opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-60"
          style={{ backgroundColor: profile.color }}
        />

        {/* Borda colorida */}
        <div
          className="relative overflow-hidden rounded-full border-2 border-transparent transition-all duration-300 group-hover:border-[var(--profile-color)]"
        >
          <Image
            src={profile.avatar}
            alt={profile.name}
            width={140}
            height={140}
            className="aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </div>

      {/* Nome do perfil */}
      <span className="text-sm font-semibold tracking-wide text-text-secondary transition-colors duration-300 group-hover:text-text-primary md:text-base">
        {profile.name}
      </span>

      {/* Região (visível apenas no hover) */}
      <motion.span
        initial={{ opacity: 0, height: 0 }}
        className="text-xs font-medium uppercase tracking-widest opacity-0 transition-all duration-300 group-hover:opacity-100"
        style={{ color: profile.color }}
      >
        {profile.region === 'brasil-geral'
          ? 'Brasil'
          : profile.region.replace('-', ' ')}
      </motion.span>
    </motion.button>
  );
}
