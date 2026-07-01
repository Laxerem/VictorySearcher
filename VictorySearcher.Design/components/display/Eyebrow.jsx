import React from 'react';

/**
 * Wide-tracked uppercase overline that sits above headings
 * (e.g. "ГОТОВЫ К ВЗРЫВНОМУ РОСТУ?", "НАША ИСТОРИЯ").
 */
export function Eyebrow({ children, accent, style = {}, ...rest }) {
  const accentColor = {
    orange: 'var(--accent)',
    cyan: 'var(--accent-cyan)',
    magenta: 'var(--accent-magenta)',
    green: 'var(--accent-green)',
  }[accent];

  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--fs-label)',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: 'var(--ls-eyebrow)',
        color: accentColor || 'var(--text-muted)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
