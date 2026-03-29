# AGENTS.md - BrazukaFlix Development Guide

## Project Overview

BrazukaFlix is a Brazilian streaming content aggregator built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4. It integrates with the TMDB API to display Brazilian movies, series, and novelas.

## Build & Development Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build            # Build for production
npm run start            # Start production server

# Linting
npm run lint             # Run ESLint on entire codebase
npm run lint -- --fix   # Auto-fix linting issues
npm run lint <file>     # Lint specific file
```

**Note:** No test framework is currently configured. Do not add tests unless explicitly requested.

## Code Style Guidelines

### TypeScript Configuration
- Strict mode is enabled in `tsconfig.json`
- Use explicit types; avoid `any` unless absolutely necessary
- Use `undefined` for optional properties, not `null`
- Define types in `src/types/` directory

### Imports & Path Aliases
- Use `@/*` alias for src imports: `import { MediaItem } from '@/types/media'`
- Order imports: built-in → external → aliased → relative
- Group imports with blank lines between groups
```typescript
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Plus, Check } from 'lucide-react';
import { MediaItem } from '@/types/media';
import { buildImageUrl } from '@/lib/tmdb';
import { Skeleton } from '@/components/ui/Skeleton';
```

### Component Structure
- Use `'use client'` directive for client-side components
- Export components as default
- Define interfaces in same file or in `src/types/`
- Use PascalCase for component filenames: `MediaCard.tsx`, `MovieRow.tsx`
- Use camelCase for hooks: `useMyList.ts`, `useProfile.ts`

### Naming Conventions
- Components: PascalCase (`MediaCard`, `MovieRow`)
- Hooks: camelCase with `use` prefix (`useMyList`, `useProfile`)
- Types/Interfaces: PascalCase (`MediaItem`, `MediaType`)
- Constants: PascalCase or SCREAMING_SNAKE_CASE
- Variables/functions: camelCase

### React Patterns
- Use `useCallback` for event handlers passed to child components
- Use `useState` with explicit type when not inferrable
- Prefer functional components with arrow functions or function declarations
- Destructure props with default values when appropriate

### Error Handling
- Wrap async operations in try/catch
- Log errors with `console.error()` (Portuguese messages preferred)
- Return empty arrays/objects on errors rather than throwing
- Handle loading states explicitly

```typescript
try {
  const data = await fetchTMDB<TMDBPageResponse>('/discover/movie', params);
  return data.results.map(m => mapToMediaItem(m, 'movie'));
} catch (error) {
  console.error('Erro ao buscar filmes brasileiros:', error);
  return [];
}
```

### Tailwind CSS v4
- Use utility classes following the existing pattern
- Use arbitrary values sparingly
- Maintain consistent spacing scale
- Use semantic color names from `globals.css` (e.g., `bg-navy-deep`, `text-sea-green`)
- Use `md:` and `lg:` prefixes for responsive design

### UI/UX Patterns
- Use framer-motion for animations
- Use `lucide-react` for icons
- Use Skeleton components for loading states
- Implement touch-friendly interactions for mobile

### File Organization
```
src/
├── app/              # Next.js App Router pages
├── components/      # React components
│   ├── ui/          # Reusable UI components
│   ├── layout/      # Layout components (Navbar, Footer)
│   ├── media/       # Media-related components
│   └── profile/     # Profile components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and API clients
└── types/           # TypeScript type definitions
```

### API Integration (TMDB)
- All API keys stored in environment variables
- Use Bearer token authentication
- Filter content for Brazilian origin (`with_original_language=pt`, `with_origin_country=BR`)
- Use ISR with `next: { revalidate: 3600 }` for caching
- Use `Promise.allSettled` for resilient multi-fetch operations

### Best Practices
- Add JSDoc comments for public API functions
- Use TypeScript interfaces for API response types
- Validate null/undefined values before rendering
- Use semantic HTML elements (`<article>`, `<figure>`, `<main>`)
- Include accessibility attributes (`aria-label`, `role`, `tabIndex`)

## Environment Variables

Required variables (see `.env.local`):
- `TMDB_API_KEY` - TMDB API key
- `TMDB_ACCESS_TOKEN` - TMDB Bearer token

## Common Tasks

### Adding a new page
1. Create file in `src/app/[route]/page.tsx`
2. Add `'use client'` if using hooks
3. Import types from `@/types/media`
4. Use existing layout components

### Adding a new component
1. Create in appropriate `src/components/` subdirectory
2. Export as default
3. Define Props interface
4. Use existing UI patterns and Tailwind classes

### Adding a new API function
1. Add to `src/lib/tmdb.ts`
2. Define input/output interfaces
3. Use existing fetchTMDB helper
4. Handle errors with try/catch
