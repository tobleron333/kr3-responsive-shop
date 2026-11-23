/* ==========================================================================
   Переключение светлой и тёмной темы.
   Тема сохраняется в localStorage и применяется до отрисовки страницы.
   ========================================================================== */
(function () {
  'use strict';

  const root = document.documentElement;
  const button = document.getElementById('themeToggle');
  if (!button) return;

  const getTheme = () => (root.getAttribute('data-bs-theme') === 'dark' ? 'dark' : 'light');

  const updateButton = () => {
    const isDark = getTheme() === 'dark';
    const label = isDark ? 'Включить светлую тему' : 'Включить тёмную тему';
    button.setAttribute('aria-pressed', String(isDark));
    button.setAttribute('aria-label', label);
    button.setAttribute('title', label);
  };

  const applyTheme = (theme) => {
    root.setAttribute('data-bs-theme', theme);
    try {
      window.localStorage.setItem('tn_theme', theme);
    } catch (error) { /* localStorage недоступен */ }
    updateButton();
  };

  const toggleTheme = () => {
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (document.startViewTransition && !reduceMotion) {
      document.startViewTransition(() => applyTheme(next));
    } else {
      applyTheme(next);
    }
  };

  button.addEventListener('click', toggleTheme);

  // Если тема была сохранена — синхронизируем подпись кнопки.
  updateButton();
})();
