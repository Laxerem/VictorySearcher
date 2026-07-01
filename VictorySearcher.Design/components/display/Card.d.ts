import React from 'react';

export interface CardProps {
  children?: React.ReactNode;
  /** Enables hover lift + lighter gradient. */
  interactive?: boolean;
  /** CSS padding. Default var(--sp-8). */
  padding?: string;
  style?: React.CSSProperties;
}

/** Base dark surface card — gradient, hairline, deep shadow, sharp corners. */
export function Card(props: CardProps): JSX.Element;
