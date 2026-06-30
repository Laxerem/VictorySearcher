import React from 'react';

/**
 * Square custom checkbox — matches the service-interest list in the CTA block.
 */
export function Checkbox({
  checked,
  defaultChecked,
  onChange,
  label,
  disabled = false,
  style = {},
  ...rest
}) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const on = isControlled ? checked : internal;

  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on);
  };

  return (
    <label
      onClick={toggle}
      style={{
        display: 'inline-flex',
        alignItems: 'flex-start',
        gap: 14,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        userSelect: 'none',
        ...style,
      }}
      {...rest}
    >
      <span
        style={{
          flex: 'none',
          width: 22,
          height: 22,
          marginTop: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--radius-xs)',
          border: `1px solid ${on ? 'var(--text-strong)' : 'var(--border-strong)'}`,
          background: on ? 'var(--action-fill)' : 'transparent',
          transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
        }}
      >
        {on && (
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2 7L5 10L11 3" stroke="var(--text-on-light)" strokeWidth="2" strokeLinecap="square" />
          </svg>
        )}
      </span>
      {label && (
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--fs-body-m)',
          color: 'var(--text-body)',
          lineHeight: 'var(--lh-snug)',
        }}>{label}</span>
      )}
    </label>
  );
}
