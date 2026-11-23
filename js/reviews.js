/* ==========================================================================
   Отзывы на странице аромата: средний балл, распределение, сортировка,
   «показать ещё» и форма нового отзыва.
   ========================================================================== */
(function () {
  'use strict';

  const qs = (selector, scope = document) => scope.querySelector(selector);

  const escapeHTML = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const starMarkup = (average) => {
    const percent = Math.max(0, Math.min(100, (average / 5) * 100));
    return `<span class="stars" aria-hidden="true"><span class="stars__fill" style="width:${percent}%"></span></span>`;
  };

  const init = () => {
    const list = qs('#reviewsList');
    if (!list || !window.TN || !window.TNStore) return;

    const params = new URLSearchParams(window.location.search);
    const perfumeId = params.get('id') && window.TN.perfumes[params.get('id')]
      ? params.get('id')
      : window.TN.perfumeOrder[0];

    const averageLabel = qs('#reviewsAverage');
    const countLabel = qs('#reviewsCount');
    const starsBox = qs('#reviewsStars');
    const barsBox = qs('#ratingBars');
    const moreButton = qs('#reviewsMore');
    const sortSelect = qs('#reviewSort');
    const form = qs('#reviewForm');
    const successBox = qs('#reviewSuccess');
    const nameInput = qs('#reviewName');
    const textInput = qs('#reviewText');
    const ratingInputs = Array.from(document.querySelectorAll('input[name="review-rating"]'));

    const state = { sort: 'new', visible: 3 };

    const getSorted = () => {
      const reviews = window.TNStore.getReviews(perfumeId);
      if (state.sort === 'high') {
        return reviews.slice().sort((a, b) => b.rating - a.rating);
      }
      if (state.sort === 'low') {
        return reviews.slice().sort((a, b) => a.rating - b.rating);
      }
      return reviews;
    };

    const renderSummary = () => {
      const rating = window.TNStore.getRating(perfumeId);
      const reviewsWord = window.TN.plural(rating.count, 'отзыв', 'отзыва', 'отзывов');

      if (averageLabel) averageLabel.textContent = rating.count ? String(rating.average).replace('.', ',') : '—';
      if (countLabel) countLabel.textContent = `${rating.count} ${reviewsWord}`;
      if (starsBox) {
        starsBox.innerHTML = starMarkup(rating.average);
        starsBox.setAttribute('aria-label', `Средняя оценка ${rating.average} из 5`);
      }

      if (barsBox) {
        const max = Math.max(1, rating.count);
        const labels = ['1 звезда', '2 звезды', '3 звезды', '4 звезды', '5 звёзд'];
        barsBox.innerHTML = [5, 4, 3, 2, 1]
          .map((stars) => {
            const count = rating.distribution[stars - 1] || 0;
            const percent = Math.round((count / max) * 100);
            return `
              <li class="rating-bar">
                <span>${labels[stars - 1]}</span>
                <span class="rating-bar__track"><span class="rating-bar__fill" style="width:${percent}%"></span></span>
                <span>${count}</span>
              </li>`;
          })
          .join('');
      }
    };

    const renderList = () => {
      const reviews = getSorted();
      const visible = reviews.slice(0, state.visible);

      if (!reviews.length) {
        list.innerHTML = '<p class="reviews-empty">Отзывов пока нет. Станьте первым, кто расскажет об этом аромате.</p>';
      } else {
        list.innerHTML = visible
          .map((review) => {
            const initial = (review.name || 'Г').trim().charAt(0).toUpperCase();
            const verified = review.verified
              ? '<span class="verified-badge">✓ Проверенный покупатель</span>'
              : '';
            return `
              <article class="review-card">
                <div class="review-card__head">
                  <span class="review-avatar" aria-hidden="true">${escapeHTML(initial)}</span>
                  <h4 class="review-card__name">${escapeHTML(review.name)}</h4>
                  ${verified}
                  <time class="review-card__date" datetime="${review.date}">${window.TN.formatDate(review.date)}</time>
                </div>
                <div class="review-card__stars" aria-label="Оценка ${review.rating} из 5">${starMarkup(review.rating)}</div>
                <p class="review-card__text">${escapeHTML(review.text)}</p>
              </article>`;
          })
          .join('');
      }

      if (moreButton) {
        const rest = reviews.length - visible.length;
        moreButton.hidden = rest <= 0;
        moreButton.textContent = rest > 0
          ? `Показать ещё ${rest} ${window.TN.plural(rest, 'отзыв', 'отзыва', 'отзывов')}`
          : 'Показать ещё';
      }
    };

    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        state.sort = sortSelect.value;
        state.visible = 3;
        renderList();
      });
    }

    if (moreButton) {
      moreButton.addEventListener('click', () => {
        state.visible += 3;
        renderList();
      });
    }

    if (form) {
      const profile = window.TNStore.getProfile();
      if (profile && nameInput && !nameInput.value) nameInput.value = profile.name;

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        let valid = true;

        const ratingInput = ratingInputs.find((input) => input.checked);
        const nameError = qs('[data-error-for="reviewName"]');
        const textError = qs('[data-error-for="reviewText"]');

        if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
          nameInput.setAttribute('aria-invalid', 'true');
          if (nameError) nameError.classList.add('is-visible');
          valid = false;
        } else {
          nameInput.removeAttribute('aria-invalid');
          if (nameError) nameError.classList.remove('is-visible');
        }

        if (!textInput.value.trim() || textInput.value.trim().length < 20) {
          textInput.setAttribute('aria-invalid', 'true');
          if (textError) textError.classList.add('is-visible');
          valid = false;
        } else {
          textInput.removeAttribute('aria-invalid');
          if (textError) textError.classList.remove('is-visible');
        }

        if (!ratingInput) valid = false;
        if (!valid) return;

        window.TNStore.addReview({
          perfumeId,
          name: nameInput.value.trim(),
          rating: Number(ratingInput.value),
          text: textInput.value.trim(),
        });

        form.reset();
        const fiveStars = ratingInputs.find((input) => input.value === '5');
        if (fiveStars) fiveStars.checked = true;

        state.sort = 'new';
        state.visible = 3;
        if (sortSelect) sortSelect.value = 'new';

        renderSummary();
        renderList();
        document.dispatchEvent(new CustomEvent('tn:reviews-updated'));

        if (successBox) {
          successBox.classList.add('is-visible');
          successBox.textContent = 'Спасибо! Отзыв опубликован и сохранён в вашем браузере.';
        }
      });

      [nameInput, textInput].forEach((input) => {
        if (!input) return;
        input.addEventListener('input', () => {
          input.removeAttribute('aria-invalid');
          const error = qs(`[data-error-for="${input.id}"]`);
          if (error) error.classList.remove('is-visible');
        });
      });
    }

    renderSummary();
    renderList();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
