/* ==========================================================================
   Рейтинги ароматов на карточках: средний балл и число отзывов.
   ========================================================================== */
(function () {
  'use strict';

  const format = (value) => String(value).replace('.', ',');

  const renderRating = (element) => {
    if (!window.TNStore) return;
    const perfumeId = element.getAttribute('data-rating-for');
    const rating = window.TNStore.getRating(perfumeId);
    const percent = rating.count ? Math.max(0, Math.min(100, (rating.average / 5) * 100)) : 0;

    element.classList.toggle('rating--empty', rating.count === 0);
    element.innerHTML = `
      <span class="stars" aria-hidden="true"><span class="stars__fill" style="width:${percent}%"></span></span>
      <span class="rating__count">${
        rating.count
          ? `${format(rating.average)} · ${rating.count} ${window.TN.plural(rating.count, 'отзыв', 'отзыва', 'отзывов')}`
          : 'Пока нет отзывов'
      }</span>`;
    element.setAttribute(
      'aria-label',
      rating.count
        ? `Рейтинг ${format(rating.average)} из 5, отзывов: ${rating.count}`
        : 'Рейтинг пока не сформирован'
    );
  };

  const init = () => {
    document.querySelectorAll('[data-rating-for]').forEach(renderRating);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
