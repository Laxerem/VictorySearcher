import React from 'react';

export interface InputProps {
  /** 'underline' (CTA-style bottom rule) or 'box'. Default 'underline'. */
  variant?: 'underline' | 'box';
  placeholder?: string;
  type?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}

/** Dark text input — underline (CTA) or boxed variant. */
export function Input(props: InputProps): JSX.Element;
