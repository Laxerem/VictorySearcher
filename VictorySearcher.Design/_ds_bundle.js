/* @ds-bundle: {"format":3,"namespace":"VictoryGroupDesignSystem_5427f7","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Eyebrow","sourcePath":"components/display/Eyebrow.jsx"},{"name":"ServiceCard","sourcePath":"components/display/ServiceCard.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"9d7bdb738f4e","components/buttons/IconButton.jsx":"cc7e6a414d3f","components/display/Badge.jsx":"2ab7b55216e9","components/display/Card.jsx":"d17c4d4dae8b","components/display/Eyebrow.jsx":"a26465c613d1","components/display/ServiceCard.jsx":"fef9ca285f31","components/forms/Checkbox.jsx":"02bc211e30ab","components/forms/Input.jsx":"917ead974b9a","ui_kits/website/CtaForm.jsx":"e432e9c77e5e","ui_kits/website/Header.jsx":"aa73012b74ed","ui_kits/website/Hero.jsx":"ed7a5fbf1082","ui_kits/website/Services.jsx":"ffa5433caca8","ui_kits/website/shared.jsx":"e6d00de8b4e6"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.VictoryGroupDesignSystem_5427f7 = window.VictoryGroupDesignSystem_5427f7 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Victory Group primary action button.
 * Sharp-cornered, uppercase, wide-tracked — matches the "ОТПРАВИТЬ" / "ХОЧУ БОЛЬШЕ КЛИЕНТОВ" CTAs.
 */
function Button({
  children,
  variant = 'primary',
  // 'primary' | 'secondary' | 'ghost'
  size = 'md',
  // 'sm' | 'md' | 'lg'
  fullWidth = false,
  disabled = false,
  type = 'button',
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: '10px 18px',
      fontSize: 12
    },
    md: {
      padding: '15px 30px',
      fontSize: 13
    },
    lg: {
      padding: '20px 40px',
      fontSize: 14
    }
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
    ...sizes[size]
  };
  const variants = {
    primary: {
      background: 'var(--action-fill)',
      color: 'var(--text-on-light)',
      border: '1px solid var(--action-fill)',
      boxShadow: 'var(--shadow-btn)'
    },
    secondary: {
      background: 'transparent',
      color: 'var(--text-strong)',
      border: '1px solid var(--border-strong)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-body)',
      border: '1px solid transparent'
    }
  };
  const hover = {
    primary: e => {
      e.currentTarget.style.background = 'var(--action-fill-hover)';
    },
    secondary: e => {
      e.currentTarget.style.borderColor = 'var(--text-strong)';
      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
    },
    ghost: e => {
      e.currentTarget.style.color = 'var(--text-strong)';
      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
    }
  };
  const leave = {
    primary: e => {
      e.currentTarget.style.background = 'var(--action-fill)';
    },
    secondary: e => {
      e.currentTarget.style.borderColor = 'var(--border-strong)';
      e.currentTarget.style.background = 'transparent';
    },
    ghost: e => {
      e.currentTarget.style.color = 'var(--text-body)';
      e.currentTarget.style.background = 'transparent';
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    style: {
      ...base,
      ...variants[variant],
      ...style
    },
    onMouseEnter: e => {
      if (!disabled) hover[variant](e);
    },
    onMouseLeave: e => {
      if (!disabled) leave[variant](e);
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = 'translateY(1px)';
    },
    onMouseUp: e => {
      if (!disabled) e.currentTarget.style.transform = 'translateY(0)';
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/buttons/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Icon button. Two shapes:
 *  - 'circle' → the floating contact buttons (WhatsApp / Telegram / phone) on the site edge.
 *  - 'square' → the small "›" affordance in the corner of service blocks.
 */
function IconButton({
  children,
  shape = 'square',
  // 'square' | 'circle'
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
    ...style
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-label": label,
    style: base,
    onMouseEnter: e => {
      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
      e.currentTarget.style.borderColor = 'var(--text-strong)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.borderColor = 'var(--border-hairline)';
    },
    onMouseDown: e => {
      e.currentTarget.style.transform = 'scale(0.94)';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = 'scale(1)';
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Small label/badge. Neutral by default; pass `accent` for a glowing neon variant
 * matching the service category colors (Реклама/Лидогенерация/Digital/Репутация).
 */
function Badge({
  children,
  accent,
  style = {},
  ...rest
}) {
  const map = {
    orange: {
      color: 'var(--accent)',
      glow: 'var(--glow-orange)'
    },
    cyan: {
      color: 'var(--accent-cyan)',
      glow: 'var(--glow-cyan)'
    },
    magenta: {
      color: 'var(--accent-magenta)',
      glow: 'var(--glow-magenta)'
    },
    green: {
      color: 'var(--accent-green)',
      glow: 'var(--glow-green)'
    }
  };
  const a = map[accent];
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
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
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * Base surface card — subtle top-lit dark gradient, hairline border, deep shadow.
 * Sharp corners (Victory uses square cards). Optional hover lift.
 */
function Card({
  children,
  interactive = false,
  padding = 'var(--sp-8)',
  style = {},
  ...rest
}) {
  const [hover, setHover] = useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => interactive && setHover(true),
    onMouseLeave: () => interactive && setHover(false),
    style: {
      position: 'relative',
      background: hover ? 'var(--grad-card-hover)' : 'var(--grad-card)',
      border: '1px solid var(--border-hairline)',
      borderRadius: 'var(--radius-sm)',
      boxShadow: 'var(--shadow-card)',
      padding,
      color: 'var(--text-body)',
      transition: 'background var(--dur-med) var(--ease-out), border-color var(--dur-med) var(--ease-out), transform var(--dur-med) var(--ease-out)',
      transform: hover ? 'translateY(-2px)' : 'translateY(0)',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Wide-tracked uppercase overline that sits above headings
 * (e.g. "ГОТОВЫ К ВЗРЫВНОМУ РОСТУ?", "НАША ИСТОРИЯ").
 */
function Eyebrow({
  children,
  accent,
  style = {},
  ...rest
}) {
  const accentColor = {
    orange: 'var(--accent)',
    cyan: 'var(--accent-cyan)',
    magenta: 'var(--accent-magenta)',
    green: 'var(--accent-green)'
  }[accent];
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-block',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-label)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-eyebrow)',
      color: accentColor || 'var(--text-muted)',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/display/ServiceCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * Branded service / offering block — the "РАЗРАБОТАЕМ ФИРМЕННЫЙ СТИЛЬ", "УКРЕПИМ ДОВЕРИЕ"
 * cards from the "Комплексное продвижение" grid. Uppercase title, muted body,
 * "›" affordance top-right. `active` highlights one block.
 */
function ServiceCard({
  title,
  children,
  active = false,
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const lit = active || hover;
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onClick: onClick,
    style: {
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
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 'var(--sp-4)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      maxWidth: '78%',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--fs-display-s)',
      lineHeight: 'var(--lh-snug)',
      letterSpacing: 'var(--ls-display)',
      textTransform: 'uppercase',
      color: 'var(--text-strong)'
    }
  }, title), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    shape: "square",
    size: 36,
    label: typeof title === 'string' ? title : 'Подробнее'
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 2L10 7L5 12",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "square"
  })))), children && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body-m)',
      lineHeight: 'var(--lh-body)',
      color: 'var(--text-muted)'
    }
  }, children));
}
Object.assign(__ds_scope, { ServiceCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/ServiceCard.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Square custom checkbox — matches the service-interest list in the CTA block.
 */
function Checkbox({
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
  return /*#__PURE__*/React.createElement("label", _extends({
    onClick: toggle,
    style: {
      display: 'inline-flex',
      alignItems: 'flex-start',
      gap: 14,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      userSelect: 'none',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
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
      transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)'
    }
  }, on && /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 13 13",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 7L5 10L11 3",
    stroke: "var(--text-on-light)",
    strokeWidth: "2",
    strokeLinecap: "square"
  }))), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body-m)',
      color: 'var(--text-body)',
      lineHeight: 'var(--lh-snug)'
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * Text input. Two variants:
 *  - 'underline' → the bottom-rule field used in the CTA block ("Укажите номер телефона").
 *  - 'box' → a bordered dark field for forms.
 */
function Input({
  variant = 'underline',
  // 'underline' | 'box'
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
    transition: 'border-color var(--dur-med) var(--ease-out), background var(--dur-med) var(--ease-out)'
  };
  const variants = {
    underline: {
      padding: '16px 2px',
      border: 'none',
      borderBottom: `1px solid ${focused ? 'var(--text-strong)' : 'var(--border-hairline)'}`,
      borderRadius: 0
    },
    box: {
      padding: '15px 18px',
      border: `1px solid ${focused ? 'var(--text-strong)' : 'var(--border-hairline)'}`,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--surface-card)'
    }
  };
  return /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    placeholder: placeholder,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    disabled: disabled,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      ...common,
      ...variants[variant],
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/CtaForm.jsx
try { (() => {
const VG_DIRECTIONS = ['Лидогенерация', 'Дизайн и разработка', 'Продвижение на маркетплейсах', 'VDL Service (управление себестоимостью проектов)', 'Реклама', 'SEO-продвижение', 'Управление репутацией', 'Все направления', 'Хочу работать у вас'];
function CtaCheckbox({
  label,
  checked,
  onToggle
}) {
  return /*#__PURE__*/React.createElement("label", {
    onClick: onToggle,
    style: {
      display: 'inline-flex',
      alignItems: 'flex-start',
      gap: 13,
      cursor: 'pointer',
      userSelect: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      width: 22,
      height: 22,
      marginTop: 1,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-xs)',
      border: `1px solid ${checked ? 'var(--text-strong)' : 'var(--border-strong)'}`,
      background: checked ? 'var(--action-fill)' : 'transparent',
      transition: 'all var(--dur-fast) var(--ease-out)'
    }
  }, checked && /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 13 13",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 7 5 10 11 3",
    stroke: "var(--text-on-light)",
    strokeWidth: "2",
    strokeLinecap: "square"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--text-body)',
      lineHeight: 1.3
    }
  }, label));
}
function CtaForm() {
  const [phone, setPhone] = React.useState('');
  const [sel, setSel] = React.useState({
    0: true
  });
  const [sent, setSent] = React.useState(false);
  const toggle = i => setSel(s => ({
    ...s,
    [i]: !s[i]
  }));
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      background: 'var(--surface-page)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/cta-block.png",
    alt: "",
    style: {
      position: 'absolute',
      right: 0,
      top: 0,
      height: '100%',
      width: '52%',
      objectFit: 'cover',
      objectPosition: 'left center',
      opacity: 0.85
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(90deg, var(--vg-ink-900) 40%, rgba(5,5,6,0.2) 70%, transparent)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '112px var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 620
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.22em',
      color: 'var(--text-muted)'
    }
  }, "Готовы к взрывному росту?"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '20px 0 40px',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'clamp(34px, 4vw, 52px)',
      lineHeight: 1.06,
      letterSpacing: '-0.015em',
      textTransform: 'uppercase',
      color: 'var(--text-strong)'
    }
  }, "Пора переходить от слов к делу"), sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '40px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 26,
      textTransform: 'uppercase',
      color: 'var(--text-strong)'
    }
  }, "Заявка отправлена"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 12,
      fontFamily: 'var(--font-body)',
      fontSize: 16,
      color: 'var(--text-muted)'
    }
  }, "Менеджер свяжется с вами в ближайшее время.")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
    value: phone,
    onChange: e => setPhone(e.target.value),
    placeholder: "Укажите номер телефона",
    style: {
      width: '100%',
      boxSizing: 'border-box',
      padding: '16px 2px',
      fontFamily: 'var(--font-body)',
      fontSize: 19,
      fontWeight: 500,
      color: 'var(--text-strong)',
      background: 'transparent',
      border: 'none',
      borderBottom: '1px solid var(--border-hairline)',
      outline: 'none'
    },
    onFocus: e => e.target.style.borderBottomColor = 'var(--text-strong)',
    onBlur: e => e.target.style.borderBottomColor = 'var(--border-hairline)'
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '32px 0 20px',
      fontFamily: 'var(--font-body)',
      fontSize: 16,
      color: 'var(--text-body)'
    }
  }, "Выберите интересующее направление:"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '18px 32px',
      marginBottom: 40
    }
  }, VG_DIRECTIONS.map((d, i) => /*#__PURE__*/React.createElement(CtaCheckbox, {
    key: i,
    label: d,
    checked: !!sel[i],
    onToggle: () => toggle(i)
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setSent(true),
    style: {
      width: 320,
      maxWidth: '100%',
      background: 'var(--action-fill)',
      color: 'var(--text-on-light)',
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: 14,
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-button)',
      padding: '18px 32px',
      border: 'none',
      borderRadius: 'var(--radius-sm)',
      cursor: 'pointer',
      boxShadow: 'var(--shadow-btn)',
      transition: 'background var(--dur-med) var(--ease-out)'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--action-fill-hover)',
    onMouseLeave: e => e.currentTarget.style.background = 'var(--action-fill)'
  }, "Отправить")))));
}
Object.assign(window, {
  CtaForm,
  CtaCheckbox,
  VG_DIRECTIONS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/CtaForm.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Header.jsx
try { (() => {
function Header() {
  const link = {
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--text-body)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    cursor: 'pointer',
    transition: 'color var(--dur-fast) var(--ease-out)',
    whiteSpace: 'nowrap'
  };
  const dropdowns = {
    'О компании': true,
    'Отрасли': true
  };
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 30,
      display: 'flex',
      alignItems: 'stretch',
      borderBottom: '1px solid var(--border-hairline)',
      background: 'rgba(5,5,6,0.82)',
      backdropFilter: 'blur(12px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      padding: '0 36px',
      borderRight: '1px solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo.png",
    alt: "Victory Group",
    style: {
      height: 30
    }
  })), /*#__PURE__*/React.createElement("button", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '0 28px',
      borderRight: '1px solid var(--border-hairline)',
      background: 'transparent',
      border: 'none',
      borderRightWidth: 1,
      borderRightStyle: 'solid',
      borderRightColor: 'var(--border-hairline)',
      color: 'var(--text-strong)',
      cursor: 'pointer',
      font: 'inherit'
    }
  }, /*#__PURE__*/React.createElement(IconGrid, {
    style: {
      color: 'var(--text-strong)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.08em'
    }
  }, "Все продукты")), /*#__PURE__*/React.createElement("nav", {
    style: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      gap: 26,
      padding: '20px 36px'
    }
  }, VG_NAV.map(l => /*#__PURE__*/React.createElement("span", {
    key: l,
    style: link,
    onMouseEnter: e => e.currentTarget.style.color = 'var(--text-strong)',
    onMouseLeave: e => e.currentTarget.style.color = 'var(--text-body)'
  }, l, dropdowns[l] && /*#__PURE__*/React.createElement(IconChevDown, {
    style: {
      opacity: 0.6
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-end',
      padding: '0 36px',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 22,
      color: 'var(--text-strong)',
      letterSpacing: '-0.01em'
    }
  }, "8 800 101-06-69"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--text-muted)',
      cursor: 'pointer'
    }
  }, "Заказать звонок")));
}
Object.assign(window, {
  Header
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Hero.jsx
try { (() => {
function ContactRail() {
  const btn = {
    width: 46,
    height: 46,
    borderRadius: '50%',
    flex: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--border-hairline)',
    background: 'rgba(5,5,6,0.6)',
    color: 'var(--text-strong)',
    cursor: 'pointer',
    transition: 'background var(--dur-med) var(--ease-out), border-color var(--dur-med) var(--ease-out)'
  };
  const on = e => {
    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
    e.currentTarget.style.borderColor = 'var(--text-strong)';
  };
  const off = e => {
    e.currentTarget.style.background = 'rgba(5,5,6,0.6)';
    e.currentTarget.style.borderColor = 'var(--border-hairline)';
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 24,
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      zIndex: 10
    }
  }, [/*#__PURE__*/React.createElement(IconChat, {
    key: "c"
  }), /*#__PURE__*/React.createElement(IconSend, {
    key: "s"
  }), /*#__PURE__*/React.createElement(IconPhone, {
    key: "p"
  })].map((ic, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    style: btn,
    onMouseEnter: on,
    onMouseLeave: off
  }, ic)));
}
function Hero() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      minHeight: 640,
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      borderBottom: '1px solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/hero-map.png",
    alt: "",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'right center',
      opacity: 0.9
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(90deg, var(--vg-ink-900) 8%, rgba(5,5,6,0.55) 45%, rgba(5,5,6,0.1) 75%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '0 var(--gutter)',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      maxWidth: 760,
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'clamp(44px, 5.4vw, 76px)',
      lineHeight: 1.04,
      letterSpacing: '-0.015em',
      textTransform: 'uppercase',
      color: 'var(--text-strong)'
    }
  }, "IT-решения для эффективного маркетинга"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 28,
      fontFamily: 'var(--font-body)',
      fontSize: 20,
      color: 'var(--text-body)'
    }
  }, "Выбирайте работать с лучшими"), /*#__PURE__*/React.createElement("button", {
    style: {
      marginTop: 36,
      background: 'var(--action-fill)',
      color: 'var(--text-on-light)',
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: 14,
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-button)',
      padding: '20px 40px',
      border: 'none',
      borderRadius: 'var(--radius-sm)',
      cursor: 'pointer',
      boxShadow: 'var(--shadow-btn)',
      transition: 'background var(--dur-med) var(--ease-out)'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--action-fill-hover)',
    onMouseLeave: e => e.currentTarget.style.background = 'var(--action-fill)'
  }, "Хочу больше клиентов")), /*#__PURE__*/React.createElement(ContactRail, null));
}
Object.assign(window, {
  Hero,
  ContactRail
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Services.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const VG_SERVICES = [{
  title: 'Разработаем фирменный стиль и сайт бренда',
  body: 'Поможем компании выглядеть современно и надёжно.'
}, {
  title: 'Укрепим доверие',
  body: 'Поднимем рейтинг на Яндекс.Картах, Google, 2GIS и других сервисах, чтобы ваши клиенты не сомневались в выборе.'
}, {
  title: 'Подключим новый канал лидов',
  body: 'Принесём в ваш отдел продаж горячие заявки и целевые лиды.'
}, {
  title: 'Увеличим число посетителей из поиска',
  body: 'Соберём полное семантическое ядро, оптимизируем страницы под ключевые запросы и выведем сайт на первые позиции.'
}, {
  title: 'Настроим рекламу',
  body: 'Сформируем максимально эффективные связки Performance и PR-маркетинга для роста продаж.'
}];
function ServiceBlock({
  title,
  body,
  active,
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  const lit = active || hover;
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onClick: onClick,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 22,
      minHeight: 230,
      padding: 32,
      cursor: 'pointer',
      background: lit ? 'var(--grad-card)' : 'transparent',
      border: `1px solid ${lit ? 'var(--border-hairline)' : 'transparent'}`,
      borderRadius: 'var(--radius-sm)',
      boxShadow: lit ? 'var(--shadow-card)' : 'none',
      transition: 'background var(--dur-med) var(--ease-out), border-color var(--dur-med) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      maxWidth: '80%',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 22,
      lineHeight: 1.25,
      letterSpacing: '-0.01em',
      textTransform: 'uppercase',
      color: 'var(--text-strong)'
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      flex: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid var(--border-hairline)',
      borderRadius: 'var(--radius-sm)',
      color: 'var(--text-strong)'
    }
  }, /*#__PURE__*/React.createElement(IconArrow, null))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-body)',
      fontSize: 16,
      lineHeight: 1.55,
      color: 'var(--text-muted)'
    }
  }, body));
}
function Services() {
  const [active, setActive] = React.useState(1);
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-page)',
      padding: '112px 0',
      borderBottom: '1px solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '0 var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 56px',
      maxWidth: 720,
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'clamp(34px, 4vw, 52px)',
      lineHeight: 1.08,
      letterSpacing: '-0.015em',
      textTransform: 'uppercase',
      color: 'var(--text-strong)'
    }
  }, "Комплексное продвижение вашего бизнеса"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 16
    }
  }, VG_SERVICES.map((s, i) => /*#__PURE__*/React.createElement(ServiceBlock, _extends({
    key: i
  }, s, {
    active: active === i,
    onClick: () => setActive(i)
  }))))));
}
Object.assign(window, {
  Services,
  ServiceBlock,
  VG_SERVICES
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Services.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/shared.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Victory Group — website UI kit. Shared bits + icons.
   These mirror the design-system primitives cosmetically so the kit renders
   standalone; in production, compose the bundled components instead. */

const VG_NAV = ['О компании', 'Отрасли', 'IT продукты', 'Кейсы', 'Блог', 'Отзывы', 'Карьера', 'Контакты'];

// --- minimal contact glyphs (substitute icons; see README ICONOGRAPHY) ---
function IconChat(p) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M12 3C6.5 3 3 6.6 3 10.8c0 2.2 1.1 4.2 2.9 5.6L5 21l4.4-2.1c.8.2 1.7.3 2.6.3 5.5 0 9-3.6 9-7.8S17.5 3 12 3Z",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }));
}
function IconSend(p) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "19",
    height: "19",
    viewBox: "0 0 24 24",
    fill: "none"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M21 4 3 11l6 2.5L11 20l3.5-6L21 4Z",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinejoin: "round"
  }));
}
function IconPhone(p) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M6 3 9 4l1 4-2 1.5a12 12 0 0 0 6 6L15.5 14l4 1 1 3c0 1.2-1 2.2-2.2 2A16 16 0 0 1 4 6.2 2 2 0 0 1 6 4Z",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinejoin: "round"
  }));
}
function IconGrid(p) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "currentColor"
  }, p), [0, 5, 10].map(y => [0, 5, 10].map(x => /*#__PURE__*/React.createElement("rect", {
    key: x + '-' + y,
    x: x,
    y: y,
    width: "2.4",
    height: "2.4",
    rx: ".4"
  }))));
}
function IconArrow(p) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M5 2 10 7 5 12",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "square"
  }));
}
function IconChevDown(p) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: "10",
    height: "10",
    viewBox: "0 0 12 12",
    fill: "none"
  }, p), /*#__PURE__*/React.createElement("path", {
    d: "M2 4 6 8 10 4",
    stroke: "currentColor",
    strokeWidth: "1.4",
    strokeLinecap: "round"
  }));
}
Object.assign(window, {
  VG_NAV,
  IconChat,
  IconSend,
  IconPhone,
  IconGrid,
  IconArrow,
  IconChevDown
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/shared.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.ServiceCard = __ds_scope.ServiceCard;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

})();
