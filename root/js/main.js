document.addEventListener('DOMContentLoaded', () => {
  
  // === Выпадающие меню ===
  const toggles = document.querySelectorAll('.nav-toggle');
  toggles.forEach(btn => {
    const menu = document.getElementById(btn.getAttribute('aria-controls'));
    if (!menu) return;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      
      // Закрыть все
      toggles.forEach(b => {
        const m = document.getElementById(b.getAttribute('aria-controls'));
        if (m) {
          b.setAttribute('aria-expanded', 'false');
          m.hidden = true;
        }
      });
      
      // Переключить текущее
      btn.setAttribute('aria-expanded', !expanded);
      menu.hidden = expanded;
      
      if (!expanded) {
        const firstLink = menu.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });

    // Закрытие по Escape
    menu.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        btn.focus();
        btn.setAttribute('aria-expanded', 'false');
        menu.hidden = true;
      }
    });
  });

  // Закрытие при клике вне
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header__nav')) {
      toggles.forEach(btn => {
        const menu = document.getElementById(btn.getAttribute('aria-controls'));
        if (menu) {
          btn.setAttribute('aria-expanded', 'false');
          menu.hidden = true;
        }
      });
    }
  });

  // === Табы календаря ===
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.setAttribute('aria-selected', 'false');
        b.classList.remove('active');
        const panel = document.getElementById(b.getAttribute('aria-controls'));
        if (panel) {
          panel.hidden = true;
          panel.classList.remove('active');
        }
      });
      
      btn.setAttribute('aria-selected', 'true');
      btn.classList.add('active');
      const activePanel = document.getElementById(btn.getAttribute('aria-controls'));
      if (activePanel) {
        activePanel.hidden = false;
        activePanel.classList.add('active');
      }
    });

    // Клавиатура: стрелки между табами
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const btns = Array.from(tabBtns);
        const idx = btns.indexOf(btn);
        const next = e.key === 'ArrowRight' 
          ? btns[(idx + 1) % btns.length] 
          : btns[(idx - 1 + btns.length) % btns.length];
        next.focus();
        next.click();
      }
    });
  });

  // === Плавная прокрутка для якорей ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  });

});