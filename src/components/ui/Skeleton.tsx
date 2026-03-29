import React from 'react';

/**
 * Skeleton pulse animation para carregar placeholders.
 * Proteção de UX (Evitando Content Layout Shift).
 */
export function Skeleton({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-white/10 ${className}`}
      {...props}
    />
  );
}
