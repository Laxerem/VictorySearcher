const VG_DIRECTIONS = [
  'Лидогенерация', 'Дизайн и разработка', 'Продвижение на маркетплейсах',
  'VDL Service (управление себестоимостью проектов)', 'Реклама', 'SEO-продвижение',
  'Управление репутацией', 'Все направления', 'Хочу работать у вас',
];

function CtaCheckbox({ label, checked, onToggle }) {
  return (
    <label onClick={onToggle} style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 13, cursor: 'pointer', userSelect: 'none' }}>
      <span style={{
        flex: 'none', width: 22, height: 22, marginTop: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 'var(--radius-xs)', border: `1px solid ${checked ? 'var(--text-strong)' : 'var(--border-strong)'}`,
        background: checked ? 'var(--action-fill)' : 'transparent', transition: 'all var(--dur-fast) var(--ease-out)',
      }}>
        {checked && <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 7 5 10 11 3" stroke="var(--text-on-light)" strokeWidth="2" strokeLinecap="square" /></svg>}
      </span>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-body)', lineHeight: 1.3 }}>{label}</span>
    </label>
  );
}

function CtaForm() {
  const [phone, setPhone] = React.useState('');
  const [sel, setSel] = React.useState({ 0: true });
  const [sent, setSent] = React.useState(false);
  const toggle = (i) => setSel((s) => ({ ...s, [i]: !s[i] }));

  return (
    <section style={{ position: 'relative', background: 'var(--surface-page)', overflow: 'hidden' }}>
      <img src="../../assets/cta-block.png" alt="" style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '52%', objectFit: 'cover', objectPosition: 'left center', opacity: 0.85 }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, var(--vg-ink-900) 40%, rgba(5,5,6,0.2) 70%, transparent)' }} />
      <div style={{ position: 'relative', maxWidth: 'var(--container-max)', margin: '0 auto', padding: '112px var(--gutter)' }}>
        <div style={{ maxWidth: 620 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--text-muted)' }}>Готовы к взрывному росту?</span>
          <h2 style={{ margin: '20px 0 40px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(34px, 4vw, 52px)', lineHeight: 1.06, letterSpacing: '-0.015em', textTransform: 'uppercase', color: 'var(--text-strong)' }}>Пора переходить от слов к делу</h2>

          {sent ? (
            <div style={{ padding: '40px 0' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, textTransform: 'uppercase', color: 'var(--text-strong)' }}>Заявка отправлена</div>
              <p style={{ marginTop: 12, fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--text-muted)' }}>Менеджер свяжется с вами в ближайшее время.</p>
            </div>
          ) : (
            <>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Укажите номер телефона"
                style={{ width: '100%', boxSizing: 'border-box', padding: '16px 2px', fontFamily: 'var(--font-body)', fontSize: 19, fontWeight: 500, color: 'var(--text-strong)', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-hairline)', outline: 'none' }}
                onFocus={(e) => e.target.style.borderBottomColor = 'var(--text-strong)'}
                onBlur={(e) => e.target.style.borderBottomColor = 'var(--border-hairline)'} />

              <p style={{ margin: '32px 0 20px', fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--text-body)' }}>Выберите интересующее направление:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 32px', marginBottom: 40 }}>
                {VG_DIRECTIONS.map((d, i) => <CtaCheckbox key={i} label={d} checked={!!sel[i]} onToggle={() => toggle(i)} />)}
              </div>

              <button onClick={() => setSent(true)} style={{ width: 320, maxWidth: '100%', background: 'var(--action-fill)', color: 'var(--text-on-light)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, textTransform: 'uppercase', letterSpacing: 'var(--ls-button)', padding: '18px 32px', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', boxShadow: 'var(--shadow-btn)', transition: 'background var(--dur-med) var(--ease-out)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--action-fill-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--action-fill)'}>
                Отправить
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { CtaForm, CtaCheckbox, VG_DIRECTIONS });
