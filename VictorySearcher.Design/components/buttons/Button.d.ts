import React from 'react';

export interface ButtonProps {
  children?: React.ReactNode;
  /** Visual style. Default 'primary'. */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Default 'md'. */
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Sharp-cornered uppercase action button — the Victory Group primary CTA.
 * @startingPoint section="Buttons" subtitle="Primary / secondary / ghost CTAs" viewport="700x180"
 */
export function Button(props: ButtonProps): JSX.Element;
