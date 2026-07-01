import React from 'react';

export interface BadgeProps {
  children?: React.ReactNode;
  /** Neon accent — adds matching glow. Omit for neutral outline. */
  accent?: 'orange' | 'cyan' | 'magenta' | 'green';
  style?: React.CSSProperties;
}

/** Compact uppercase label; optional glowing neon accent. */
export function Badge(props: BadgeProps): JSX.Element;
