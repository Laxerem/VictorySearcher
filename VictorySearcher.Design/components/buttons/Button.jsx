import React from 'react';

/**
 * Victory Group primary action button.
 * Sharp-cornered, uppercase, wide-tracked — matches the "ОТПРАВИТЬ" / "ХОЧУ БОЛЬШЕ КЛИЕНТОВ" CTAs.
 */
export function Button({
  children,
  variant = 'primary',   // 'primary' | 'secondary' | 'ghost'
  size = 'md',           // 'sm' | 'md' | 'lg'
  fullWidth = false,
  disabled = false,
  type = 'button',
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { padding: '10px 18px', fontSize: 12 },
    md: { padding: '15px 30px', fontSize: 13 },
    lg: { padding: '20px 40px', fontSize: 14 },
  };

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 'var(--ls-button)',
    borderRadius: 'var(--radius-sm)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    width: fullWidth ? '100%' : 'auto',
    transition: 'background var(--dur-med) var(--ease-out), color var(--dur-med) var(--ease-out), border-color var(--dur-med) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
    whiteSpace: 'nowrap',
    ...sizes[size],
  };

  const variants = {
    primary: {
      background: 'var(--action-fill)',
      color: 'var(--text-on-light)',
      border: '1px solid var(--action-fill)',
      boxShadow: 'var(--shadow-btn)',
    },
    secondary: {
      background: 'transparent',
      color: 'var(--text-strong)',
      border: '1px solid var(--border-strong)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-body)',
      border: '1px solid transparent',
    },
  };

  const hover = {
    primary: (e) => { e.currentTarget.style.background = 'var(--action-fill-hover)'; },
    secondary: (e) => { e.currentTarget.style.borderColor = 'var(--text-strong)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; },
    ghost: (e) => { e.currentTarget.style.color = 'var(--text-strong)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; },
  };
  const leave = {
    primary: (e) => { e.currentTarget.style.background = 'var(--action-fill)'; },
    secondary: (e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = 'transparent'; },
    ghost: (e) => { e.currentTarget.style.color = 'var(--text-body)'; e.currentTarget.style.background = 'transparent'; },
  };

  return (
    <button
      type={type}
      disabled={disabled}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={(e) => { if (!disabled) hover[variant](e); }}
      onMouseLeave={(e) => { if (!disabled) leave[variant](e); }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'translateY(1px)'; }}
      onMouseUp={(e) => { if (!disabled) e.currentTarget.style.transform = 'translateY(0)'; }}
      {...rest}
    >
      {children}
    </button>
  );
}
