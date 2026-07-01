/* Victory Group — website UI kit. Shared bits + icons.
   These mirror the design-system primitives cosmetically so the kit renders
   standalone; in production, compose the bundled components instead. */

const VG_NAV = ['О компании', 'Отрасли', 'IT продукты', 'Кейсы', 'Блог', 'Отзывы', 'Карьера', 'Контакты'];

// --- minimal contact glyphs (substitute icons; see README ICONOGRAPHY) ---
function IconChat(p){return(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 3C6.5 3 3 6.6 3 10.8c0 2.2 1.1 4.2 2.9 5.6L5 21l4.4-2.1c.8.2 1.7.3 2.6.3 5.5 0 9-3.6 9-7.8S17.5 3 12 3Z" stroke="currentColor" strokeWidth="1.5"/></svg>);}
function IconSend(p){return(<svg width="19" height="19" viewBox="0 0 24 24" fill="none" {...p}><path d="M21 4 3 11l6 2.5L11 20l3.5-6L21 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>);}
function IconPhone(p){return(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M6 3 9 4l1 4-2 1.5a12 12 0 0 0 6 6L15.5 14l4 1 1 3c0 1.2-1 2.2-2.2 2A16 16 0 0 1 4 6.2 2 2 0 0 1 6 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>);}
function IconGrid(p){return(<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" {...p}>{[0,5,10].map(y=>[0,5,10].map(x=>(<rect key={x+'-'+y} x={x} y={y} width="2.4" height="2.4" rx=".4"/>)))}</svg>);}
function IconArrow(p){return(<svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><path d="M5 2 10 7 5 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square"/></svg>);}
function IconChevDown(p){return(<svg width="10" height="10" viewBox="0 0 12 12" fill="none" {...p}><path d="M2 4 6 8 10 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>);}

Object.assign(window, { VG_NAV, IconChat, IconSend, IconPhone, IconGrid, IconArrow, IconChevDown });
