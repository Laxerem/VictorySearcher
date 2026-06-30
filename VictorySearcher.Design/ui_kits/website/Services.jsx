const VG_SERVICES = [
  { title: 'Разработаем фирменный стиль и сайт бренда', body: 'Поможем компании выглядеть современно и надёжно.' },
  { title: 'Укрепим доверие', body: 'Поднимем рейтинг на Яндекс.Картах, Google, 2GIS и других сервисах, чтобы ваши клиенты не сомневались в выборе.' },
  { title: 'Подключим новый канал лидов', body: 'Принесём в ваш отдел продаж горячие заявки и целевые лиды.' },
  { title: 'Увеличим число посетителей из поиска', body: 'Соберём полное семантическое ядро, оптимизируем страницы под ключевые запросы и выведем сайт на первые позиции.' },
  { title: 'Настроим рекламу', body: 'Сформируем максимально эффективные связки Performance и PR-маркетинга для роста продаж.' },
];

function ServiceBlock({ title, body, active, onClick }) {
  const [hover, setHover] = React.useState(false);
  const lit = active || hover;
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', gap: 22, minHeight: 230, padding: 32, cursor: 'pointer',
        background: lit ? 'var(--grad-card)' : 'transparent',
        border: `1px solid ${lit ? 'var(--border-hairline)' : 'transparent'}`,
        borderRadius: 'var(--radius-sm)', boxShadow: lit ? 'var(--shadow-card)' : 'none',
        transition: 'background var(--dur-med) var(--ease-out), border-color var(--dur-med) var(--ease-out)',
      }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <h3 style={{ margin: 0, maxWidth: '80%', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, lineHeight: 1.25, letterSpacing: '-0.01em', textTransform: 'uppercase', color: 'var(--text-strong)' }}>{title}</h3>
        <span style={{ width: 36, height: 36, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-sm)', color: 'var(--text-strong)' }}><IconArrow /></span>
      </div>
      <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.55, color: 'var(--text-muted)' }}>{body}</p>
    </div>
  );
}

function Services() {
  const [active, setActive] = React.useState(1);
  return (
    <section style={{ background: 'var(--surface-page)', padding: '112px 0', borderBottom: '1px solid var(--border-hairline)' }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--gutter)' }}>
        <h2 style={{ margin: '0 0 56px', maxWidth: 720, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(34px, 4vw, 52px)', lineHeight: 1.08, letterSpacing: '-0.015em', textTransform: 'uppercase', color: 'var(--text-strong)' }}>Комплексное продвижение вашего бизнеса</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {VG_SERVICES.map((s, i) => (
            <ServiceBlock key={i} {...s} active={active === i} onClick={() => setActive(i)} />
          ))}
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { Services, ServiceBlock, VG_SERVICES });
