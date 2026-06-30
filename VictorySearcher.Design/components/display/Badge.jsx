import React from 'react';

/**
 * Small label/badge. Neutral by default; pass `accent` for a glowing neon variant
 * matching the service category colors (Реклама/Лидогенерация/Digital/Репутация).
 */
export function Badge({ children, accent, style = {}, ...rest }) {
  const map = {
    orange: { color: 'var(--accent)', glow: 'var(--glow-orange)' },
    cyan: { color: 'var(--accent-cyan)', glow: 'var(--glow-cyan)' },
    magenta: { color: 'var(--accent-magenta)', glow: 'var(--glow-magenta)' },
    green: { color: 'var(--accent-green)', glow: 'var(--glow-green)' },
  };
  const a = map[accent];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 11px',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--fs-label)',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        lineHeight: 1,
        borderRadius: 'var(--radius-xs)',
        color: a ? a.color : 'var(--text-body)',
        border: `1px solid ${a ? a.color : 'var(--border-strong)'}`,
        background: a ? 'rgba(255,255,255,0.02)' : 'transparent',
        boxShadow: a ? a.glow : 'none',
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
