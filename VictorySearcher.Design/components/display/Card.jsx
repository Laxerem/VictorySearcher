import React, { useState } from 'react';

/**
 * Base surface card — subtle top-lit dark gradient, hairline border, deep shadow.
 * Sharp corners (Victory uses square cards). Optional hover lift.
 */
export function Card({ children, interactive = false, padding = 'var(--sp-8)', style = {}, ...rest }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => interactive && setHover(true)}
      onMouseLeave={() => interactive && setHover(false)}
      style={{
        position: 'relative',
        background: hover ? 'var(--grad-card-hover)' : 'var(--grad-card)',
        border: '1px solid var(--border-hairline)',
        borderRadius: 'var(--radius-sm)',
        boxShadow: 'var(--shadow-card)',
        padding,
        color: 'var(--text-body)',
        transition: 'background var(--dur-med) var(--ease-out), border-color var(--dur-med) var(--ease-out), transform var(--dur-med) var(--ease-out)',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
