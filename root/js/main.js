document.addEventListener('DOMContentLoaded', () => {
  
  // === 1. Выпадающие меню в шапке (доступные) ===
  const navToggles = document.querySelectorAll('.nav-toggle');
  navToggles.forEach(btn => {
    const menu = document.getElementById(btn.getAttribute('aria-controls'));
    if (!menu) return;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      
      // Закрыть все меню
      navToggles.forEach(b => {
        const m = document.getElementById(b.getAttribute('aria-controls'));
        if (m) { b.setAttribute('aria-expanded', 'false'); m.hidden = true; }
      });
      
      // Переключить текущее
      btn.setAttribute('aria-expanded', !expanded);
      menu.hidden = expanded;
      
      // Фокус на первый элемент меню при открытии
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

  // Закрытие меню при клике вне
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.main-nav')) {
      navToggles.forEach(btn => {
        const menu = document.getElementById(btn.getAttribute('aria-controls'));
        if (menu) { btn.setAttribute('aria-expanded', 'false'); menu.hidden = true; }
      });
    }
  });

  // === 2. Фильтр ЕКП (только на странице /ekp/) ===
  const filterToggle = document.getElementById('filter-toggle');
  const filterPanel = document.getElementById('filter-panel');
  const filterClose = document.getElementById('filter-close');
  const filterReset = document.getElementById('filter-reset');
  const ekpForm = document.getElementById('ekp-form');
  const formStatus = document.getElementById('form-status');
  const formError = document.getElementById('form-error');

  if (filterToggle && filterPanel) {
    // Открытие/закрытие фильтра
    filterToggle.addEventListener('click', () => {
      const expanded = filterToggle.getAttribute('aria-expanded') === 'true';
      filterToggle.setAttribute('aria-expanded', !expanded);
      filterPanel.hidden = expanded;
      
      if (!expanded) {
        // Фокус на первое поле при открытии
        filterPanel.querySelector('input, select, button')?.focus();
        formStatus.textContent = 'Панель фильтра открыта. Заполните поля и нажмите "Найти мероприятия".';
      } else {
        formStatus.textContent = 'Панель фильтра закрыта.';
      }
    });

    if (filterClose) {
      filterClose.addEventListener('click', () => {
        filterToggle.setAttribute('aria-expanded', 'false');
        filterPanel.hidden = true;
        filterToggle.focus();
        formStatus.textContent = 'Фильтр закрыт.';
      });
    }

    // Сброс формы
    if (filterReset && ekpForm) {
      filterReset.addEventListener('click', () => {
        ekpForm.reset();
        formStatus.textContent = 'Фильтр сброшен. Показаны все мероприятия.';
        // Здесь можно добавить вызов API для перезагрузки результатов
      });
    }

    // Отправка формы (демо-режим)
    if (ekpForm) {
      ekpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Валидация дат
        const dateFrom = document.getElementById('date-from').value;
        const dateTo = document.getElementById('date-to').value;
        
        if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
          formError.textContent = 'Ошибка: дата "с" не может быть позже даты "по".';
          document.getElementById('date-from').focus();
          return;
        }
        
        formError.textContent = '';
        
        // Симуляция поиска (в реальности — fetch к API)
        formStatus.textContent = 'Поиск мероприятий...';
        
        // Демо-ответ через 500мс
        setTimeout(() => {
          const count = document.getElementById('results-count');
          if (count) count.textContent = '3'; // В реальности — ответ от сервера
          formStatus.textContent = 'Найдено 3 мероприятия. Результаты обновлены.';
          
          // Фокус на заголовок результатов для скринридера
          document.getElementById('results-h')?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      });
    }
  }

  // === 3. Пагинация (клавиатура) ===
  const pageBtns = document.querySelectorAll('.page-btn:not([disabled])');
  pageBtns.forEach(btn => {
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const btns = Array.from(pageBtns);
        const idx = btns.indexOf(btn);
        const next = e.key === 'ArrowRight' 
          ? btns[Math.min(idx + 1, btns.length - 1)] 
          : btns[Math.max(idx - 1, 0)];
        next.focus();
      }
    });
  });

  // === 4. Плавная прокрутка для якорей ===
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