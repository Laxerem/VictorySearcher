import React from 'react';

export interface ServiceCardProps {
  /** Uppercase block title. */
  title: React.ReactNode;
  /** Description body. */
  children?: React.ReactNode;
  /** Highlights this block (lit gradient + border). */
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  style?: React.CSSProperties;
}

/**
 * Branded service/offering block with uppercase title + corner "›" affordance.
 * @startingPoint section="Display" subtitle="Service offering block grid" viewport="700x280"
 */
export function ServiceCard(props: ServiceCardProps): JSX.Element;
