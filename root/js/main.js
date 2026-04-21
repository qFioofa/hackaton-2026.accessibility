/**
 * ФГИС «Спорт» — Скрипты с полной поддержкой доступности
 * Соответствие: ГОСТ Р 52872-2019, WCAG 2.1 Level AA
 */

(function() {
  'use strict';

  // === КОНСТАНТЫ ===
  const SELECTORS = {
    navToggle: '.nav-toggle',
    navDropdown: '.nav-dropdown',
    filterToggle: '#filter-toggle-btn',
    filterPanel: '#filter-panel',
    filterForm: '#ekp-search-form',
    filterReset: '#filter-reset-btn',
    filterClose: '#filter-close-btn',
    formStatus: '#form-status',
    formError: '#form-error',
    tabBtn: '.tab-btn',
    tabPanel: '.tab-panel',
    pageBtn: '.page-btn:not([disabled])',
    anchorLink: 'a[href^="#"]'
  };

  const ARIA = {
    expanded: 'aria-expanded',
    hidden: 'hidden',
    selected: 'aria-selected',
    current: 'aria-current',
    live: 'aria-live',
    controls: 'aria-controls'
  };

  const KEY = {
    ESCAPE: 'Escape',
    ENTER: 'Enter',
    SPACE: ' ',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    TAB: 'Tab'
  };

  // === ИНИЦИАЛИЗАЦИЯ ===
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initNavMenus();
    initEkpFilter();
    initTabs();
    initPagination();
    initSmoothScroll();
    initExternalLinks();
  }

  // === 1. ВЫПАДАЮЩИЕ МЕНЮ НАВИГАЦИИ ===
  function initNavMenus() {
    const toggles = document.querySelectorAll(SELECTORS.navToggle);
    
    toggles.forEach(toggle => {
      const menuId = toggle.getAttribute(ARIA.controls);
      const menu = document.getElementById(menuId);
      
      if (!menu) return;

      // Обработчик клика
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMenu(toggle, menu);
      });

      // Обработчик клавиатуры
      toggle.addEventListener('keydown', (e) => {
        handleNavKeydown(e, toggle, menu);
      });

      // Закрытие меню по Escape
      menu.addEventListener('keydown', (e) => {
        if (e.key === KEY.ESCAPE) {
          e.preventDefault();
          closeMenu(toggle, menu);
          toggle.focus();
        }
      });

      // Закрытие при потере фокуса (с задержкой для перехода в меню)
      menu.addEventListener('focusout', (e) => {
        setTimeout(() => {
          if (!menu.contains(document.activeElement) && 
              document.activeElement !== toggle) {
            closeMenu(toggle, menu);
          }
        }, 100);
      });
    });

    // Закрытие всех меню при клике вне навигации
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.main-nav')) {
        toggles.forEach(toggle => {
          const menu = document.getElementById(toggle.getAttribute(ARIA.controls));
          if (menu && !menu[ARIA.hidden]) {
            closeMenu(toggle, menu);
          }
        });
      }
    });

    // Закрытие при изменении размера окна (мобильный вид)
    window.addEventListener('resize', () => {
      if (window.innerWidth < 768) {
        toggles.forEach(toggle => {
          const menu = document.getElementById(toggle.getAttribute(ARIA.controls));
          if (menu) closeMenu(toggle, menu);
        });
      }
    });
  }

  function toggleMenu(toggle, menu) {
    const isExpanded = toggle.getAttribute(ARIA.expanded) === 'true';
    
    // Закрыть все остальные меню
    document.querySelectorAll(SELECTORS.navToggle).forEach(otherToggle => {
      if (otherToggle !== toggle) {
        const otherMenu = document.getElementById(otherToggle.getAttribute(ARIA.controls));
        if (otherMenu) closeMenu(otherToggle, otherMenu);
      }
    });

    // Переключить текущее
    if (isExpanded) {
      closeMenu(toggle, menu);
    } else {
      openMenu(toggle, menu);
    }
  }

  function openMenu(toggle, menu) {
    toggle.setAttribute(ARIA.expanded, 'true');
    menu[ARIA.hidden] = false;
    
    // Фокус на первый интерактивный элемент
    const firstInteractive = menu.querySelector('a, button, input');
    if (firstInteractive) {
      setTimeout(() => firstInteractive.focus(), 100);
    }
  }

  function closeMenu(toggle, menu) {
    toggle.setAttribute(ARIA.expanded, 'false');
    menu[ARIA.hidden] = true;
  }

  function handleNavKeydown(e, toggle, menu) {
    switch (e.key) {
      case KEY.ENTER:
      case KEY.SPACE:
        e.preventDefault();
        toggleMenu(toggle, menu);
        break;
      case KEY.ARROW_DOWN:
        e.preventDefault();
        if (menu[ARIA.hidden]) {
          openMenu(toggle, menu);
        } else {
          focusNextInMenu(menu);
        }
        break;
      case KEY.ARROW_UP:
        e.preventDefault();
        focusPrevInMenu(menu);
        break;
    }
  }

  function focusNextInMenu(menu) {
    const items = Array.from(menu.querySelectorAll('a, button'));
    const active = document.activeElement;
    const idx = items.indexOf(active);
    const next = items[Math.min(idx + 1, items.length - 1)];
    if (next) next.focus();
  }

  function focusPrevInMenu(menu) {
    const items = Array.from(menu.querySelectorAll('a, button'));
    const active = document.activeElement;
    const idx = items.indexOf(active);
    const prev = items[Math.max(idx - 1, 0)];
    if (prev) prev.focus();
  }

  // === 2. ФИЛЬТР ЕКП (только на странице /ekp/) ===
  function initEkpFilter() {
    const filterToggle = document.querySelector(SELECTORS.filterToggle);
    const filterPanel = document.querySelector(SELECTORS.filterPanel);
    
    if (!filterToggle || !filterPanel) return;

    const form = document.querySelector(SELECTORS.filterForm);
    const resetBtn = document.querySelector(SELECTORS.filterReset);
    const closeBtn = document.querySelector(SELECTORS.filterClose);
    const statusEl = document.querySelector(SELECTORS.formStatus);
    const errorEl = document.querySelector(SELECTORS.formError);

    // Открытие/закрытие панели фильтра
    filterToggle.addEventListener('click', () => {
      const isExpanded = filterToggle.getAttribute(ARIA.expanded) === 'true';
      
      filterToggle.setAttribute(ARIA.expanded, !isExpanded);
      filterPanel[ARIA.hidden] = isExpanded;
      
      if (!isExpanded) {
        // Фокус на первое поле при открытии
        const firstField = filterPanel.querySelector('input, select');
        if (firstField) {
          setTimeout(() => firstField.focus(), 100);
        }
        announceToScreenReader(statusEl, 'Панель фильтра открыта. Заполните параметры и нажмите "Найти мероприятия".');
      } else {
        announceToScreenReader(statusEl, 'Панель фильтра закрыта.');
      }
    });

    // Закрытие по кнопке
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        filterToggle.setAttribute(ARIA.expanded, 'false');
        filterPanel[ARIA.hidden] = true;
        filterToggle.focus();
        announceToScreenReader(statusEl, 'Фильтр закрыт без применения.');
      });
    }

    // Сброс формы
    if (resetBtn && form) {
      resetBtn.addEventListener('click', () => {
        form.reset();
        announceToScreenReader(statusEl, 'Фильтр сброшен. Показаны все мероприятия.');
        // В реальности: вызвать загрузку всех мероприятий
      });
    }

    // Отправка формы
    if (form) {
      form.addEventListener('submit', handleFormSubmit);
    }

    // Валидация дат в реальном времени
    const dateFrom = document.getElementById('date-from');
    const dateTo = document.getElementById('date-to');
    
    if (dateFrom && dateTo) {
      [dateFrom, dateTo].forEach(input => {
        input.addEventListener('change', validateDateRange);
      });
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const statusEl = document.querySelector(SELECTORS.formStatus);
    const errorEl = document.querySelector(SELECTORS.formError);
    
    // Сброс ошибок
    errorEl.textContent = '';
    
    // Валидация
    if (!validateForm(form, errorEl)) {
      return;
    }
    
    // Симуляция поиска (в реальности: fetch к API)
    announceToScreenReader(statusEl, 'Поиск мероприятий...');
    
    // Показать индикатор загрузки (опционально)
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = '🔄 Поиск...';
    
    // Демо-ответ через 800мс
    setTimeout(() => {
      // Обновление результатов (демо)
      const countEl = document.getElementById('results-count');
      if (countEl) countEl.textContent = '3';
      
      // Уведомление для скринридера
      announceToScreenReader(statusEl, 'Найдено 3 мероприятия. Результаты обновлены.');
      
      // Фокус на заголовок результатов
      const resultsHeading = document.getElementById('results-heading');
      if (resultsHeading) {
        resultsHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        resultsHeading.setAttribute('tabindex', '-1');
        resultsHeading.focus();
      }
      
      // Восстановление кнопки
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }, 800);
  }

  function validateForm(form, errorEl) {
    const dateFrom = document.getElementById('date-from')?.value;
    const dateTo = document.getElementById('date-to')?.value;
    
    if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
      errorEl.textContent = 'Ошибка: дата "с" не может быть позже даты "по".';
      document.getElementById('date-from').focus();
      return false;
    }
    
    return true;
  }

  function validateDateRange() {
    const dateFrom = document.getElementById('date-from')?.value;
    const dateTo = document.getElementById('date-to')?.value;
    const errorEl = document.querySelector(SELECTORS.formError);
    
    if (dateFrom && dateTo && new Date(dateFrom) > new Date(dateTo)) {
      errorEl.textContent = 'Дата начала не может быть позже даты окончания.';
      return false;
    }
    
    if (errorEl) errorEl.textContent = '';
    return true;
  }

  function announceToScreenReader(element, message) {
    if (!element) return;
    // Очистка и установка нового сообщения
    element.textContent = '';
    setTimeout(() => {
      element.textContent = message;
    }, 100);
  }

  // === 3. ТАБЫ (для переключения Спортивные/Физкультурные) ===
  function initTabs() {
    const tabBtns = document.querySelectorAll(SELECTORS.tabBtn);
    
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => activateTab(btn));
      
      // Навигация стрелками
      btn.addEventListener('keydown', (e) => {
        handleTabKeydown(e, btn);
      });
    });
  }

  function activateTab(selectedBtn) {
    const tabList = selectedBtn.closest('[role="tablist"]');
    if (!tabList) return;
    
    // Деактивировать все табы
    tabList.querySelectorAll(SELECTORS.tabBtn).forEach(btn => {
      btn.setAttribute(ARIA.selected, 'false');
      btn.classList.remove('active');
      
      const panel = document.getElementById(btn.getAttribute(ARIA.controls));
      if (panel) {
        panel[ARIA.hidden] = true;
        panel.classList.remove('active');
      }
    });
    
    // Активировать выбранный
    selectedBtn.setAttribute(ARIA.selected, 'true');
    selectedBtn.classList.add('active');
    
    const activePanel = document.getElementById(selectedBtn.getAttribute(ARIA.controls));
    if (activePanel) {
      activePanel[ARIA.hidden] = false;
      activePanel.classList.add('active');
      
      // Фокус на первый интерактивный элемент в панели
      const firstInteractive = activePanel.querySelector('a, button');
      if (firstInteractive) {
        setTimeout(() => firstInteractive.focus(), 50);
      }
    }
  }

  function handleTabKeydown(e, currentBtn) {
    const tabList = currentBtn.closest('[role="tablist"]');
    if (!tabList) return;
    
    const tabs = Array.from(tabList.querySelectorAll(SELECTORS.tabBtn));
    const currentIndex = tabs.indexOf(currentBtn);
    
    let nextIndex;
    
    switch (e.key) {
      case KEY.ARROW_RIGHT:
      case KEY.ARROW_DOWN:
        e.preventDefault();
        nextIndex = (currentIndex + 1) % tabs.length;
        break;
      case KEY.ARROW_LEFT:
      case KEY.ARROW_UP:
        e.preventDefault();
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case KEY.HOME:
        e.preventDefault();
        nextIndex = 0;
        break;
      case KEY.END:
        e.preventDefault();
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }
    
    if (nextIndex !== undefined) {
      tabs[nextIndex].focus();
      activateTab(tabs[nextIndex]);
    }
  }

  // === 4. ПАГИНАЦИЯ ===
  function initPagination() {
    const pageBtns = document.querySelectorAll(SELECTORS.pageBtn);
    
    pageBtns.forEach(btn => {
      btn.addEventListener('keydown', (e) => {
        handlePaginationKeydown(e, btn);
      });
    });
  }

  function handlePaginationKeydown(e, currentBtn) {
    const container = currentBtn.closest('.pagination');
    if (!container) return;
    
    const buttons = Array.from(container.querySelectorAll(SELECTORS.pageBtn));
    const currentIndex = buttons.indexOf(currentBtn);
    
    switch (e.key) {
      case KEY.ARROW_RIGHT:
        e.preventDefault();
        if (currentIndex < buttons.length - 1) {
          buttons[currentIndex + 1].focus();
        }
        break;
      case KEY.ARROW_LEFT:
        e.preventDefault();
        if (currentIndex > 0) {
          buttons[currentIndex - 1].focus();
        }
        break;
    }
  }

  // === 5. ПЛАВНАЯ ПРОКРУТКА ДЛЯ ЯКОРЕЙ ===
  function initSmoothScroll() {
    document.querySelectorAll(SELECTORS.anchorLink).forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (!target) return;
        
        e.preventDefault();
        
        // Плавная прокрутка
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Управление фокусом для скринридеров
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        
        // Обновление URL без прокрутки
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      });
    });
  }

  // === 6. ВНЕШНИЕ ССЫЛКИ: ДОБАВЛЕНИЕ ARIA-АТРИБУТОВ ===
  function initExternalLinks() {
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
      // Добавляем rel="noopener noreferrer" если нет
      const rel = link.getAttribute('rel') || '';
      if (!rel.includes('noopener')) {
        link.setAttribute('rel', `${rel} noopener noreferrer`.trim());
      }
      
      // Убеждаемся, что есть sr-only текст
      if (!link.querySelector('.sr-only') && !link.getAttribute('aria-label')?.includes('новой')) {
        const srText = document.createElement('span');
        srText.className = 'sr-only';
        srText.textContent = '(откроется в новой вкладке)';
        link.appendChild(srText);
      }
    });
  }

  // === УТИЛИТЫ ===
  
  // Debounce для resize
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Проверка, является ли элемент интерактивным
  function isInteractive(el) {
    return ['a', 'button', 'input', 'select', 'textarea'].includes(el.tagName.toLowerCase()) ||
           el.getAttribute('tabindex') !== null;
  }

})();