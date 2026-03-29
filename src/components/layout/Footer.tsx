// Footer — Rodapé com informações sobre a valorização do cinema nacional
// Contém links úteis e mensagem de propósito cultural

import { Film, Globe } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t border-white/5 bg-navy-deep px-6 py-12 md:px-12"
      role="contentinfo"
    >
      <div className="mx-auto max-w-6xl">
        {/* Mensagem cultural */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-2 text-sea-green">
            <Film size={20} />
            <span className="font-display text-sm font-semibold uppercase tracking-widest">
              Valorizando o Cinema Nacional
            </span>
            <Film size={20} />
          </div>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-text-muted">
            O Brazuka Flix nasceu para celebrar a riqueza cultural do Brasil.
            Cada filme, série e novela conta uma história que é nossa — do sertão
            à metrópole, da floresta ao litoral.
          </p>
        </div>

        {/* Links organizados em colunas */}
        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-primary">
              Navegação
            </h3>
            <ul className="space-y-2 text-sm text-text-muted">
              <li><Link href="/browse" className="transition-colors hover:text-accent-yellow">Início</Link></li>
              <li><Link href="/browse?type=movie" className="transition-colors hover:text-accent-yellow">Filmes Nacionais</Link></li>
              <li><Link href="/browse?type=series" className="transition-colors hover:text-accent-yellow">Séries e Docs</Link></li>
              <li><Link href="/browse?type=novela" className="transition-colors hover:text-accent-yellow">Novelas Clássicas</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-primary">
              Categorias
            </h3>
            <ul className="space-y-2 text-sm text-text-muted">
              <li><Link href="/browse?type=movie" className="transition-colors hover:text-accent-yellow">Clássicos Imortais</Link></li>
              <li><Link href="/browse?type=movie" className="transition-colors hover:text-accent-yellow">Cinema de Retomada</Link></li>
              <li><Link href="/browse?type=novela" className="transition-colors hover:text-accent-yellow">Novelas Históricas</Link></li>
              <li><Link href="/browse?type=series" className="transition-colors hover:text-accent-yellow">Séries Curtas</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-primary">
              Institucional
            </h3>
            <ul className="space-y-2 text-sm text-text-muted">
              <li><Link href="/browse" className="transition-colors hover:text-accent-yellow">Quem Somos</Link></li>
              <li><Link href="/browse" className="transition-colors hover:text-accent-yellow">Nossa Missão</Link></li>
              <li><Link href="/browse" className="font-semibold text-white drop-shadow-md transition-colors hover:text-accent-yellow">Fale Conosco / Contato</Link></li>
              <li><Link href="/browse" className="transition-colors hover:text-accent-yellow">Imprensa e Mídia</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-primary">
              Legal
            </h3>
            <ul className="space-y-2 text-sm text-text-muted">
              <li><Link href="/browse" className="transition-colors hover:text-accent-yellow">Termos de Uso</Link></li>
              <li><Link href="/browse" className="transition-colors hover:text-accent-yellow">Política de Privacidade</Link></li>
              <li><Link href="/browse" className="transition-colors hover:text-accent-yellow">Preferências de Cookies</Link></li>
              <li><Link href="/browse" className="transition-colors hover:text-accent-yellow">Acessibilidade (WCAG)</Link></li>
            </ul>
          </div>
        </div>

        {/* Linha de créditos */}
        <div className="flex flex-col items-center gap-6 border-t border-white/10 pt-8 text-center md:flex-row md:justify-between">
          <p className="text-xs text-text-muted/60 order-2 md:order-1">
            🇧🇷 Brazuka Flix © {currentYear} — Dados TMDB. Todos os direitos reservados.
          </p>

          <div className="flex flex-col items-center gap-3 order-1 md:order-2 sm:flex-row">
            <span className="text-xs text-text-muted">
              Desenvolvido durante a Imersão Front-End por <a href="https://isaquesantosdev.com/" target="_blank" rel="noopener noreferrer" className="font-bold text-white hover:text-accent-yellow transition-colors outline-none focus:ring-1">Isaque Santos</a>
            </span>
            <span className="hidden h-4 border-l border-white/20 sm:block"></span>
            <div className="flex items-center gap-4">
              <a href="https://www.linkedin.com/in/isaque-santos-720b8b15a" target="_blank" rel="noopener noreferrer" className="text-text-muted transition-colors hover:text-blue-500 hover:scale-110" aria-label="LinkedIn Isaque">
                <FaLinkedin size={20} />
              </a>
              <a href="https://github.com/IsaqueCodeX" target="_blank" rel="noopener noreferrer" className="text-text-muted transition-colors hover:text-white hover:scale-110" aria-label="GitHub IsaqueCodeX">
                <FaGithub size={20} />
              </a>
              <a href="https://isaquesantosdev.com/" target="_blank" rel="noopener noreferrer" className="text-text-muted transition-colors hover:text-accent-yellow hover:scale-110" aria-label="Portfólio">
                <Globe size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
