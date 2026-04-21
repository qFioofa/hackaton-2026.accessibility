document.addEventListener('DOMContentLoaded', () => {
  // === 1. Выпадающие меню (доступные) ===
  const toggles = document.querySelectorAll('.nav-toggle');
  toggles.forEach(btn => {
    const menu = document.getElementById(btn.getAttribute('aria-controls'));
    if (!menu) return;

    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !expanded);
      menu.hidden = expanded;
      if (!expanded) menu.querySelector('a')?.focus();
    });

    // Закрытие по Esc
    menu.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        btn.focus();
        btn.setAttribute('aria-expanded', 'false');
        menu.hidden = true;
      }
    });
  });

  // === 2. Табы календаря ===
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.setAttribute('aria-selected', 'false');
        const panel = document.getElementById(b.getAttribute('aria-controls'));
        if (panel) panel.hidden = true;
      });
      btn.setAttribute('aria-selected', 'true');
      const activePanel = document.getElementById(btn.getAttribute('aria-controls'));
      if (activePanel) activePanel.hidden = false;
    });
  });

  // === 3. Панель доступности ===
  const a11yToggle = document.querySelector('.a11y-toggle');
  const a11yMenu = document.getElementById('a11y-menu');
  a11yToggle.addEventListener('click', () => {
    const expanded = a11yToggle.getAttribute('aria-expanded') === 'true';
    a11yToggle.setAttribute('aria-expanded', !expanded);
    a11yMenu.hidden = expanded;
  });

  const settings = JSON.parse(localStorage.getItem('a11y-settings') || '{}');
  document.body.dataset.a11yTheme = settings.theme || 'default';
  document.body.dataset.a11yFont = settings.font || 'normal';
  document.body.dataset.a11yImages = settings.images || 'on';

  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const value = btn.dataset.value;
      document.body.dataset[`a11y${action.charAt(0).toUpperCase() + action.slice(1)}`] = value;
      
      btn.parentElement.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      
      settings[action] = value;
      localStorage.setItem('a11y-settings', JSON.stringify(settings));
    });
  });

  const imgBtn = document.getElementById('a11y-images-btn');
  imgBtn.addEventListener('click', () => {
    const current = document.body.dataset.a11yImages;
    const next = current === 'on' ? 'off' : 'on';
    document.body.dataset.a11yImages = next;
    imgBtn.textContent = `🖼 Изображения: ${next === 'on' ? 'Вкл' : 'Выкл'}`;
    imgBtn.setAttribute('aria-pressed', next === 'off' ? 'true' : 'false');
    settings.images = next;
    localStorage.setItem('a11y-settings', JSON.stringify(settings));
  });

  // Инициализация кнопки изображений
  imgBtn.textContent = `🖼 Изображения: ${settings.images === 'off' ? 'Выкл' : 'Вкл'}`;
  imgBtn.setAttribute('aria-pressed', settings.images === 'off' ? 'true' : 'false');
});