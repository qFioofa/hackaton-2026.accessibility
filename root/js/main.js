(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    initSkipFocus();
    initExternalLinks();
    initFilterPanel();
    initFormValidation();
  });

  function initSkipFocus() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.setAttribute('tabindex', '-1');
        target.focus();
      });
    });
  }

  function initExternalLinks() {
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
      if (!link.getAttribute('rel')?.includes('noopener')) {
        link.setAttribute('rel', (link.getAttribute('rel') || '') + ' noopener noreferrer');
      }
      if (!link.getAttribute('aria-label')?.includes('новой')) {
        link.setAttribute('aria-label', (link.textContent.trim() + ' (откроется в новой вкладке)'));
      }
    });
  }

  function initFilterPanel() {
    const toggle = document.getElementById('filter-toggle');
    const panel = document.getElementById('filter-panel');
    const closeBtn = document.getElementById('filter-close');
    const status = document.getElementById('form-status');

    if (!toggle || !panel) return;

    toggle.addEventListener('click', function() {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
      panel.hidden = expanded;
      
      if (!expanded) {
        status.textContent = 'Панель фильтра открыта. Заполните параметры поиска.';
        panel.querySelector('input, select')?.focus();
      } else {
        status.textContent = 'Панель фильтра закрыта.';
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        toggle.setAttribute('aria-expanded', 'false');
        panel.hidden = true;
        status.textContent = 'Фильтр закрыт.';
        toggle.focus();
      });
    }

    document.getElementById('filter-reset')?.addEventListener('click', function() {
      document.getElementById('ekp-form')?.reset();
      status.textContent = 'Фильтр сброшен. Показаны все мероприятия.';
    });
  }

  function initFormValidation() {
    const form = document.getElementById('ekp-form');
    const error = document.getElementById('form-error');
    const status = document.getElementById('form-status');
    const submitBtn = form?.querySelector('button[type="submit"]');

    if (!form || !submitBtn) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      error.textContent = '';
      
      const from = document.getElementById('date-from').value;
      const to = document.getElementById('date-to').value;
      
      if (from && to && new Date(from) > new Date(to)) {
        error.textContent = 'Дата начала не может быть позже даты окончания.';
        document.getElementById('date-from').focus();
        return;
      }

      status.textContent = 'Поиск мероприятий...';
      submitBtn.disabled = true;
      submitBtn.textContent = '🔄 Поиск...';

      setTimeout(function() {
        submitBtn.disabled = false;
        submitBtn.textContent = '🔍 Найти мероприятия';
        status.textContent = 'Найдено 3 мероприятия. Результаты обновлены.';
        document.getElementById('results-heading')?.scrollIntoView({ behavior: 'smooth' });
      }, 600);
    });
  }
})();