import React from 'react';

/**
 * Icon button. Two shapes:
 *  - 'circle' → the floating contact buttons (WhatsApp / Telegram / phone) on the site edge.
 *  - 'square' → the small "›" affordance in the corner of service blocks.
 */
export function IconButton({
  children,
  shape = 'square',   // 'square' | 'circle'
  size = 40,
  label,
  style = {},
  ...rest
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: size,
    height: size,
    flex: 'none',
    color: 'var(--text-strong)',
    background: 'transparent',
    border: '1px solid var(--border-hairline)',
    borderRadius: shape === 'circle' ? 'var(--radius-pill)' : 'var(--radius-sm)',
    cursor: 'pointer',
    lineHeight: 0,
    transition: 'background var(--dur-med) var(--ease-out), border-color var(--dur-med) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
    ...style,
  };

  return (
    <button
      aria-label={label}
      style={base}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'var(--text-strong)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border-hairline)'; }}
      onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.94)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      {...rest}
    >
      {children}
    </button>
  );
}
