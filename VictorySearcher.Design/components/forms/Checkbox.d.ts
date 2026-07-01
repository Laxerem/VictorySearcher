import React from 'react';

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

/** Square custom checkbox with optional label — the service-interest list style. */
export function Checkbox(props: CheckboxProps): JSX.Element;
