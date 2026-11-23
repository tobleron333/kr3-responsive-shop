/* ==========================================================================
   Каталог: фильтры по семейству, интенсивности, сезону и цене, сортировка,
   счётчик результатов и чипы активных фильтров.
   ========================================================================== */
(function () {
  'use strict';

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const init = () => {
    const grid = qs('#catalogGrid');
    if (!grid || !window.TN) return;

    const familySelect = qs('#filterFamily');
    const intensitySelect = qs('#filterIntensity');
    const seasonSelect = qs('#filterSeason');
    const priceMin = qs('#filterPriceMin');
    const priceMax = qs('#filterPriceMax');
    const resetButton = qs('#filterReset');
    const sortSelect = qs('#catalogSort');
    const countLabel = qs('#catalogCount');
    const emptyState = qs('#catalogEmpty');
    const chipsBox = qs('#filterChips');
    const filtersCount = qs('#filtersCount');
    const applyButton = qs('#filtersApply');
    const applyText = qs('#filtersApplyText');
    const filtersPanel = qs('#catalogFilters');

    if (!familySelect || !intensitySelect || !seasonSelect || !priceMin || !priceMax) return;

    const cards = qsa('[data-perfume]', grid);
    const originalOrder = cards.slice();

    const priceBounds = { min: 0, max: 15000 };

    const getState = () => ({
      family: familySelect.value,
      intensity: intensitySelect.value,
      season: seasonSelect.value,
      min: priceMin.value === '' ? priceBounds.min : Number(priceMin.value),
      max: priceMax.value === '' ? priceBounds.max : Number(priceMax.value),
    });

    const matches = (card, state) => {
      const family = card.getAttribute('data-family');
      const intensity = card.getAttribute('data-intensity');
      const seasons = (card.getAttribute('data-seasons') || '').split(' ');
      const price = Number(card.getAttribute('data-price')) || 0;

      const familyMatch = state.family === 'all' || family === state.family;
      const intensityMatch = state.intensity === 'all' || intensity === state.intensity;
      const seasonMatch = state.season === 'all' || seasons.includes(state.season);
      const priceMatch = price >= state.min && price <= state.max;

      return familyMatch && intensityMatch && seasonMatch && priceMatch;
    };

    const sortCards = (visibleCards) => {
      const mode = sortSelect ? sortSelect.value : 'default';

      if (mode === 'default') {
        originalOrder.forEach((card) => grid.appendChild(card));
        return;
      }

      const sorted = visibleCards.slice().sort((a, b) => {
        if (mode === 'price-asc') {
          return Number(a.getAttribute('data-price')) - Number(b.getAttribute('data-price'));
        }
        if (mode === 'price-desc') {
          return Number(b.getAttribute('data-price')) - Number(a.getAttribute('data-price'));
        }
        return (a.getAttribute('data-title') || '').localeCompare(b.getAttribute('data-title') || '', 'ru');
      });

      sorted.forEach((card) => grid.appendChild(card));
    };

    const buildChips = (state) => {
      if (!chipsBox) return;
      chipsBox.innerHTML = '';

      const chips = [];
      if (state.family !== 'all') {
        chips.push({ key: 'family', label: window.TN.families[state.family] || state.family });
      }
      if (state.intensity !== 'all') {
        chips.push({ key: 'intensity', label: window.TN.intensities[state.intensity] || state.intensity });
      }
      if (state.season !== 'all') {
        chips.push({ key: 'season', label: window.TN.seasons[state.season] || state.season });
      }
      if (state.min > priceBounds.min || state.max < priceBounds.max) {
        chips.push({
          key: 'price',
          label: `${window.TN.formatPrice(state.min)} — ${state.max >= priceBounds.max ? 'без ограничений' : window.TN.formatPrice(state.max)}`,
        });
      }

      chips.forEach((chip) => {
        const element = document.createElement('span');
        element.className = 'filter-chip';
        element.innerHTML = `${chip.label}<button type="button" aria-label="Убрать фильтр: ${chip.label}" data-chip="${chip.key}">×</button>`;
        chipsBox.appendChild(element);
      });

      chipsBox.hidden = chips.length === 0;
    };

    const applyFilters = () => {
      const state = getState();
      let visible = [];

      cards.forEach((card) => {
        const show = matches(card, state);
        card.hidden = !show;
        card.style.display = show ? '' : 'none';
        if (show) visible.push(card);
      });

      sortCards(visible);

      if (countLabel) {
        countLabel.innerHTML = `<strong>${visible.length}</strong> из ${cards.length} ароматов`;
        countLabel.setAttribute('aria-live', 'polite');
      }

      if (emptyState) emptyState.hidden = visible.length > 0;
      if (applyText) {
        applyText.textContent = `Показать ${visible.length} ${window.TN.plural(visible.length, 'аромат', 'аромата', 'ароматов')}`;
      }

      const activeCount = [
        state.family !== 'all',
        state.intensity !== 'all',
        state.season !== 'all',
        state.min > priceBounds.min || state.max < priceBounds.max,
      ].filter(Boolean).length;

      if (filtersCount) {
        filtersCount.textContent = String(activeCount);
        filtersCount.hidden = activeCount === 0;
      }

      buildChips(state);
    };

    const resetFilters = () => {
      familySelect.value = 'all';
      intensitySelect.value = 'all';
      seasonSelect.value = 'all';
      priceMin.value = String(priceBounds.min);
      priceMax.value = String(priceBounds.max);
      if (sortSelect) sortSelect.value = 'default';
      applyFilters();
    };

    [familySelect, intensitySelect, seasonSelect].forEach((select) => {
      select.addEventListener('change', applyFilters);
    });

    [priceMin, priceMax].forEach((input) => {
      input.addEventListener('input', () => {
        if (priceMin.value !== '' && priceMax.value !== '' && Number(priceMin.value) > Number(priceMax.value)) {
          const swap = priceMin.value;
          priceMin.value = priceMax.value;
          priceMax.value = swap;
        }
        applyFilters();
      });
    });

    if (sortSelect) sortSelect.addEventListener('change', applyFilters);
    if (resetButton) resetButton.addEventListener('click', resetFilters);

    if (chipsBox) {
      chipsBox.addEventListener('click', (event) => {
        const button = event.target.closest('[data-chip]');
        if (!button) return;
        const key = button.getAttribute('data-chip');
        if (key === 'family') familySelect.value = 'all';
        if (key === 'intensity') intensitySelect.value = 'all';
        if (key === 'season') seasonSelect.value = 'all';
        if (key === 'price') {
          priceMin.value = String(priceBounds.min);
          priceMax.value = String(priceBounds.max);
        }
        applyFilters();
      });
    }

    if (applyButton && filtersPanel && window.bootstrap) {
      applyButton.addEventListener('click', () => {
        const instance = window.bootstrap.Offcanvas.getInstance(filtersPanel);
        if (instance) instance.hide();
      });
    }

    applyFilters();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
