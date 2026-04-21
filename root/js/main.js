document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('.nav-toggle');
  
  toggles.forEach(btn => {
    const menu = document.getElementById(btn.getAttribute('aria-controls'));
    if (!menu) return;

    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      toggles.forEach(b => {
        const m = document.getElementById(b.getAttribute('aria-controls'));
        if (m) { b.setAttribute('aria-expanded', 'false'); m.hidden = true; }
      });
      btn.setAttribute('aria-expanded', !expanded);
      menu.hidden = expanded;
      if (!expanded) menu.querySelector('a')?.focus();
    });

    menu.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        btn.focus();
        btn.setAttribute('aria-expanded', 'false');
        menu.hidden = true;
      }
    });
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.main-nav')) {
      toggles.forEach(btn => {
        const menu = document.getElementById(btn.getAttribute('aria-controls'));
        if (menu) { btn.setAttribute('aria-expanded', 'false'); menu.hidden = true; }
      });
    }
  });

  const tabBtns = document.querySelectorAll('.tab');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.setAttribute('aria-selected', 'false');
        const p = document.getElementById(b.getAttribute('aria-controls'));
        if (p) { p.hidden = true; p.classList.remove('active'); }
      });
      btn.setAttribute('aria-selected', 'true');
      const active = document.getElementById(btn.getAttribute('aria-controls'));
      if (active) { active.hidden = false; active.classList.add('active'); }
    });
  });
});