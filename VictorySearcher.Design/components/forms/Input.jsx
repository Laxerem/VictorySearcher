import React, { useState } from 'react';

/**
 * Text input. Two variants:
 *  - 'underline' → the bottom-rule field used in the CTA block ("Укажите номер телефона").
 *  - 'box' → a bordered dark field for forms.
 */
export function Input({
  variant = 'underline',  // 'underline' | 'box'
  placeholder,
  type = 'text',
  value,
  defaultValue,
  onChange,
  disabled = false,
  style = {},
  ...rest
}) {
  const [focused, setFocused] = useState(false);

  const common = {
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--fs-body-l)',
    fontWeight: 500,
    color: 'var(--text-strong)',
    background: 'transparent',
    outline: 'none',
    transition: 'border-color var(--dur-med) var(--ease-out), background var(--dur-med) var(--ease-out)',
  };

  const variants = {
    underline: {
      padding: '16px 2px',
      border: 'none',
      borderBottom: `1px solid ${focused ? 'var(--text-strong)' : 'var(--border-hairline)'}`,
      borderRadius: 0,
    },
    box: {
      padding: '15px 18px',
      border: `1px solid ${focused ? 'var(--text-strong)' : 'var(--border-hairline)'}`,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--surface-card)',
    },
  };

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      disabled={disabled}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{ ...common, ...variants[variant], opacity: disabled ? 0.5 : 1, ...style }}
      {...rest}
    />
  );
}
