import React, { useState } from 'react';
import { IconButton } from '../buttons/IconButton.jsx';

/**
 * Branded service / offering block — the "РАЗРАБОТАЕМ ФИРМЕННЫЙ СТИЛЬ", "УКРЕПИМ ДОВЕРИЕ"
 * cards from the "Комплексное продвижение" grid. Uppercase title, muted body,
 * "›" affordance top-right. `active` highlights one block.
 */
export function ServiceCard({ title, children, active = false, onClick, style = {}, ...rest }) {
  const [hover, setHover] = useState(false);
  const lit = active || hover;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--sp-6)',
        minHeight: 240,
        padding: 'var(--sp-8)',
        background: lit ? 'var(--grad-card)' : 'transparent',
        border: `1px solid ${lit ? 'var(--border-hairline)' : 'transparent'}`,
        borderRadius: 'var(--radius-sm)',
        boxShadow: lit ? 'var(--shadow-card)' : 'none',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background var(--dur-med) var(--ease-out), border-color var(--dur-med) var(--ease-out)',
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--sp-4)' }}>
        <h3 style={{
          margin: 0,
          maxWidth: '78%',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 'var(--fs-display-s)',
          lineHeight: 'var(--lh-snug)',
          letterSpacing: 'var(--ls-display)',
          textTransform: 'uppercase',
          color: 'var(--text-strong)',
        }}>{title}</h3>
        <IconButton shape="square" size={36} label={typeof title === 'string' ? title : 'Подробнее'}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
          </svg>
        </IconButton>
      </div>
      {children && (
        <p style={{
          margin: 0,
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--fs-body-m)',
          lineHeight: 'var(--lh-body)',
          color: 'var(--text-muted)',
        }}>{children}</p>
      )}
    </div>
  );
}
