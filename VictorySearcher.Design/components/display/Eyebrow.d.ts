import React from 'react';

export interface EyebrowProps {
  children?: React.ReactNode;
  /** Optional neon accent color for the label. */
  accent?: 'orange' | 'cyan' | 'magenta' | 'green';
  style?: React.CSSProperties;
}

/** Wide-tracked uppercase overline above section headings. */
export function Eyebrow(props: EyebrowProps): JSX.Element;
