'use client';

import React from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

interface TilesProps {
  className?: string;
  rows?: number;
  cols?: number;
  tileClassName?: string;
  tileSize?: 'sm' | 'md' | 'lg';
  hoverColor?: string;
}

const tileSizes = {
  sm: 'w-8 h-8',
  md: 'w-9 h-9 md:w-12 md:h-12',
  lg: 'w-12 h-12 md:w-16 md:h-16',
};

export function Tiles({
  className,
  rows = 100,
  cols = 10,
  tileClassName,
  tileSize = 'md',
  hoverColor = 'rgba(6, 182, 212, 0.15)',
}: TilesProps) {
  const rowsArray = new Array(rows).fill(1);
  const colsArray = new Array(cols).fill(1);

  return (
    <div
      className={cn('pointer-events-auto relative z-0 flex h-full w-full justify-center', className)}
      style={{ '--tile-hover': hoverColor } as React.CSSProperties}
    >
      {rowsArray.map((_, i) => (
        <motion.div
          key={`row-${i}`}
          className={cn(tileSizes[tileSize], 'relative border-l border-border/20', tileClassName)}
        >
          {colsArray.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: 'var(--tile-hover)',
                transition: { duration: 0 },
              }}
              animate={{
                transition: { duration: 2 },
              }}
              key={`col-${j}`}
              className={cn(tileSizes[tileSize], 'relative border-r border-t border-border/20', tileClassName)}
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
}
