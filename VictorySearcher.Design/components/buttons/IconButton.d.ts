import React from 'react';

export interface IconButtonProps {
  children?: React.ReactNode;
  /** 'square' for the "›" block affordance, 'circle' for floating contact buttons. Default 'square'. */
  shape?: 'square' | 'circle';
  /** px. Default 40. */
  size?: number;
  /** Accessible label. */
  label?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

/** Square "›" affordance or circular floating contact button. */
export function IconButton(props: IconButtonProps): JSX.Element;
