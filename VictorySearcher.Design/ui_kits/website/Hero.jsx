function ContactRail() {
  const btn = {
    width: 46, height: 46, borderRadius: '50%', flex: 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: '1px solid var(--border-hairline)', background: 'rgba(5,5,6,0.6)',
    color: 'var(--text-strong)', cursor: 'pointer',
    transition: 'background var(--dur-med) var(--ease-out), border-color var(--dur-med) var(--ease-out)',
  };
  const on = (e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'var(--text-strong)'; };
  const off = (e) => { e.currentTarget.style.background = 'rgba(5,5,6,0.6)'; e.currentTarget.style.borderColor = 'var(--border-hairline)'; };
  return (
    <div style={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 14, zIndex: 10 }}>
      {[<IconChat key="c" />, <IconSend key="s" />, <IconPhone key="p" />].map((ic, i) => (
        <button key={i} style={btn} onMouseEnter={on} onMouseLeave={off}>{ic}</button>
      ))}
    </div>
  );
}

function Hero() {
  return (
    <section style={{ position: 'relative', minHeight: 640, display: 'flex', alignItems: 'center', overflow: 'hidden', borderBottom: '1px solid var(--border-hairline)' }}>
      <img src="../../assets/hero-map.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'right center', opacity: 0.9 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, var(--vg-ink-900) 8%, rgba(5,5,6,0.55) 45%, rgba(5,5,6,0.1) 75%)' }} />
      <div style={{ position: 'relative', maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--gutter)', width: '100%' }}>
        <h1 style={{
          margin: 0, maxWidth: 760,
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(44px, 5.4vw, 76px)',
          lineHeight: 1.04, letterSpacing: '-0.015em', textTransform: 'uppercase', color: 'var(--text-strong)',
        }}>IT-решения для эффективного маркетинга</h1>
        <p style={{ marginTop: 28, fontFamily: 'var(--font-body)', fontSize: 20, color: 'var(--text-body)' }}>Выбирайте работать с лучшими</p>
        <button style={{
          marginTop: 36, background: 'var(--action-fill)', color: 'var(--text-on-light)',
          fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, textTransform: 'uppercase',
          letterSpacing: 'var(--ls-button)', padding: '20px 40px', border: 'none',
          borderRadius: 'var(--radius-sm)', cursor: 'pointer', boxShadow: 'var(--shadow-btn)',
          transition: 'background var(--dur-med) var(--ease-out)',
        }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--action-fill-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'var(--action-fill)'}>
          Хочу больше клиентов
        </button>
      </div>
      <ContactRail />
    </section>
  );
}
Object.assign(window, { Hero, ContactRail });
