function Header() {
  const link = {
    fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-body)',
    display: 'inline-flex', alignItems: 'center', gap: 5, cursor: 'pointer',
    transition: 'color var(--dur-fast) var(--ease-out)', whiteSpace: 'nowrap',
  };
  const dropdowns = { 'О компании': true, 'Отрасли': true };

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 30,
      display: 'flex', alignItems: 'stretch',
      borderBottom: '1px solid var(--border-hairline)',
      background: 'rgba(5,5,6,0.82)', backdropFilter: 'blur(12px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 36px', borderRight: '1px solid var(--border-hairline)' }}>
        <img src="../../assets/logo.png" alt="Victory Group" style={{ height: 30 }} />
      </div>
      <button style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '0 28px',
        borderRight: '1px solid var(--border-hairline)', background: 'transparent', border: 'none',
        borderRightWidth: 1, borderRightStyle: 'solid', borderRightColor: 'var(--border-hairline)',
        color: 'var(--text-strong)', cursor: 'pointer', font: 'inherit',
      }}>
        <IconGrid style={{ color: 'var(--text-strong)' }} />
        <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Все продукты</span>
      </button>

      <nav style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 26, padding: '20px 36px' }}>
        {VG_NAV.map((l) => (
          <span key={l} style={link}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-strong)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-body)'}>
            {l}{dropdowns[l] && <IconChevDown style={{ opacity: 0.6 }} />}
          </span>
        ))}
      </nav>

      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', padding: '0 36px', gap: 2 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--text-strong)', letterSpacing: '-0.01em' }}>8 800 101-06-69</span>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-muted)', cursor: 'pointer' }}>Заказать звонок</span>
      </div>
    </header>
  );
}
Object.assign(window, { Header });
