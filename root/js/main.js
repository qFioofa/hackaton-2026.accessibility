document.addEventListener('DOMContentLoaded', () => {
  
  // === 1. Выпадающие меню (доступные с клавиатуры) ===
  const toggles = document.querySelectorAll('.nav-toggle');
  toggles.forEach(btn => {
    const menu = document.getElementById(btn.getAttribute('aria-controls'));
    if (!menu) return;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      
      // Закрыть все меню
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
        // Фокус на первый элемент меню
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

  // Закрытие меню при клике вне
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

  // === 2. Табы календаря (доступные) ===
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Деактивировать все
      tabBtns.forEach(b => {
        b.setAttribute('aria-selected', 'false');
        b.classList.remove('active');
        const panel = document.getElementById(b.getAttribute('aria-controls'));
        if (panel) {
          panel.hidden = true;
          panel.classList.remove('active');
        }
      });
      
      // Активировать выбранное
      btn.setAttribute('aria-selected', 'true');
      btn.classList.add('active');
      const activePanel = document.getElementById(btn.getAttribute('aria-controls'));
      if (activePanel) {
        activePanel.hidden = false;
        activePanel.classList.add('active');
      }
    });

    // Поддержка клавиатуры для табов
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

  // === 3. Панель доступности ===
  const a11yToggle = document.querySelector('.a11y-toggle');
  const a11yMenu = document.getElementById('a11y-menu');
  
  a11yToggle.addEventListener('click', () => {
    const expanded = a11yToggle.getAttribute('aria-expanded') === 'true';
    a11yToggle.setAttribute('aria-expanded', !expanded);
    a11yMenu.hidden = expanded;
  });

  // Загрузка сохранённых настроек
  const settings = JSON.parse(localStorage.getItem('a11y-settings') || '{}');
  if (settings.theme) document.body.dataset.a11yTheme = settings.theme;
  if (settings.font) document.body.dataset.a11yFont = settings.font;
  if (settings.images) document.body.dataset.a11yImages = settings.images;

  // Обработчики кнопок настроек
  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action; // 'font' или 'theme'
      const value = btn.dataset.value;
      const attr = `data-a11y-${action.charAt(0).toUpperCase() + action.slice(1)}`;
      
      document.body.setAttribute(attr, value);
      
      // Обновить aria-pressed
      btn.parentElement.querySelectorAll('button').forEach(b => 
        b.setAttribute('aria-pressed', 'false')
      );
      btn.setAttribute('aria-pressed', 'true');
      
      // Сохранить
      settings[action] = value;
      localStorage.setItem('a11y-settings', JSON.stringify(settings));
    });
  });

  // Кнопка изображений
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

  // Инициализация текста кнопки изображений
  const imgState = document.body.dataset.a11yImages || 'on';
  imgBtn.textContent = `🖼 Изображения: ${imgState === 'on' ? 'Вкл' : 'Выкл'}`;
  imgBtn.setAttribute('aria-pressed', imgState === 'off' ? 'true' : 'false');

  // === 4. Плавная прокрутка для якорей ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Фокус на секцию для скринридеров
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  });

});