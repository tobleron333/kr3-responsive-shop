/* ==========================================================================
   Страница аромата: данные из URL, объём, характеристики, похожие ароматы.
   ========================================================================== */
(function () {
  'use strict';

  const qs = (selector, scope = document) => scope.querySelector(selector);

  const getPerfumeId = () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    return id && window.TN.perfumes[id] ? id : window.TN.perfumeOrder[0];
  };

  const starMarkup = (average) => {
    const percent = Math.max(0, Math.min(100, (average / 5) * 100));
    return `<span class="stars" aria-hidden="true"><span class="stars__fill" style="width:${percent}%"></span></span>`;
  };

  const cardMarkup = (id) => {
    const perfume = window.TN.perfumes[id];
    const rating = window.TNStore.getRating(id);
    const badge = perfume.badge
      ? `<span class="badge ${perfume.badgeClass} product-card__badge">${perfume.badge}</span>`
      : '';

    return `
      <article class="product-card">
        <a class="product-card__media" href="product.html?id=${id}" aria-label="${perfume.title}">
          <img src="${perfume.image}" alt="${perfume.title}" width="400" height="500" loading="lazy">
          ${badge}
        </a>
        <div class="product-card__body">
          <p class="product-card__family">${perfume.familyLabel}</p>
          <h3 class="product-card__title"><a href="product.html?id=${id}">${perfume.title}</a></h3>
          <p class="product-card__notes">${perfume.cardNotes}</p>
          <div class="product-card__meta">
            <span class="product-card__price">от ${window.TN.formatPrice(perfume.price)}</span>
            <span class="rating" aria-label="Рейтинг ${String(rating.average).replace('.', ',')} из 5">
              ${starMarkup(rating.average)}
              <span class="rating__count">${rating.count || '—'}</span>
            </span>
          </div>
        </div>
      </article>`;
  };

  const init = () => {
    const title = qs('#productTitle');
    if (!title || !window.TN || !window.TNStore) return;

    const id = getPerfumeId();
    const perfume = window.TN.perfumes[id];
    const rating = window.TNStore.getRating(id);
    const reviewsLabel = `${rating.count} ${window.TN.plural(rating.count, 'отзыв', 'отзыва', 'отзывов')}`;
    const volumes = Object.keys(perfume.volumePrices).map(Number).sort((a, b) => a - b);
    let currentVolume = volumes[0];
    let currentPrice = perfume.volumePrices[currentVolume];

    document.title = `${perfume.title} — купить аромат | Тихая нота`;
    const description = qs('meta[name="description"]');
    if (description) {
      description.setAttribute(
        'content',
        `${perfume.title} — ${perfume.familyLabel.toLowerCase()} аромат от мастерской «Тихая нота». ${perfume.subtitle}`
      );
    }

    const setText = (selector, value) => {
      const element = qs(selector);
      if (element) element.textContent = value;
    };

    setText('#breadcrumbProduct', perfume.title);
    setText('#productFamily', `${perfume.familyLabel} · ${perfume.intensityLabel} · ${perfume.seasonLabel}`);
    setText('#productTitle', perfume.title);
    setText('#productSubtitle', perfume.subtitle);
    setText('#productDescription', perfume.description);
    setText('#productStory', perfume.story);
    setText('#noteTop', perfume.notes.top);
    setText('#noteHeart', perfume.notes.heart);
    setText('#noteBase', perfume.notes.base);
    setText('#productWarning', perfume.warning);

    const image = qs('#productImage');
    if (image) {
      image.src = perfume.image;
      image.alt = `Аромат «${perfume.title}»`;
    }

    const badge = qs('#productBadge');
    if (badge) {
      if (perfume.badge) {
        badge.textContent = perfume.badge;
        badge.className = `badge ${perfume.badgeClass} product-card__badge`;
        badge.hidden = false;
      } else {
        badge.hidden = true;
      }
    }

    const ratingBox = qs('#productRating');
    if (ratingBox) {
      ratingBox.innerHTML = `
        <span class="rating">
          ${starMarkup(rating.average)}
          <span class="rating__count">${rating.count ? `${String(rating.average).replace('.', ',')} · ${reviewsLabel}` : 'Пока нет отзывов'}</span>
        </span>
        <a class="ms-3 small text-uppercase" href="#reviews" style="letter-spacing:.1em;font-size:.66rem;">Читать отзывы</a>`;
    }

    const meta = qs('#productMeta');
    if (meta) {
      const rows = [
        ['Концентрация', perfume.concentration],
        ['Стойкость', perfume.longevity],
        ['Шлейф', perfume.sillage],
        ['Год выпуска', perfume.year],
      ];
      meta.innerHTML = rows.map(([label, value]) => `<li><span>${label}</span><span>${value}</span></li>`).join('');
    }

    const specs = qs('#specsBody');
    if (specs) {
      const rows = [
        ['Семейство', perfume.familyLabel],
        ['Интенсивность', perfume.intensityLabel],
        ['Сезон', perfume.seasonLabel],
        ['Концентрация', perfume.concentration],
        ['Стойкость', perfume.longevity],
        ['Шлейф', perfume.sillage],
        ['Год выпуска', perfume.year],
        ['Объём', `${volumes.join(' / ')} мл`],
      ];
      specs.innerHTML = rows
        .map(([label, value]) => `<tr><th scope="row">${label}</th><td data-label="${label}">${value}</td></tr>`)
        .join('');
    }

    const note = qs('#productWarningBox');
    if (note && !perfume.warning) note.hidden = true;

    const volumeSwitch = qs('#volumeSwitch');
    const priceLabel = qs('#productPrice');
    const volumeLabel = qs('#productVolumeLabel');
    const stickyPrice = qs('#stickyPrice');
    const stickyVolume = qs('#stickyVolume');
    const orderButtons = Array.from(document.querySelectorAll('[data-order-perfume]'));

    const applyVolume = (volume) => {
      currentVolume = Number(volume);
      currentPrice = perfume.volumePrices[currentVolume] || perfume.price;

      if (priceLabel) priceLabel.textContent = window.TN.formatPrice(currentPrice);
      if (volumeLabel) volumeLabel.textContent = `/ ${currentVolume} мл`;
      if (stickyPrice) stickyPrice.textContent = window.TN.formatPrice(currentPrice);
      if (stickyVolume) stickyVolume.textContent = `${currentVolume} мл`;

      orderButtons.forEach((button) => {
        button.setAttribute('data-order-perfume', id);
        button.setAttribute('data-volume', String(currentVolume));
        button.setAttribute('data-price', String(currentPrice));
      });

      if (volumeSwitch) {
        volumeSwitch.querySelectorAll('.volume-option').forEach((option) => {
          const isActive = Number(option.getAttribute('data-volume')) === currentVolume;
          option.classList.toggle('is-active', isActive);
          option.setAttribute('aria-pressed', String(isActive));
        });
      }
    };

    if (volumeSwitch) {
      volumeSwitch.innerHTML = volumes
        .map((volume) => {
          const price = perfume.volumePrices[volume];
          return `<button class="volume-option" type="button" data-volume="${volume}" aria-pressed="false">${volume} мл — ${window.TN.formatPrice(price)}</button>`;
        })
        .join('');

      volumeSwitch.addEventListener('click', (event) => {
        const option = event.target.closest('.volume-option');
        if (!option) return;
        applyVolume(option.getAttribute('data-volume'));
      });
    }

    const bookButton = qs('#productBookBtn');
    if (bookButton) bookButton.href = 'order.html?program=signature';

    applyVolume(currentVolume);

    const similar = qs('#similarGrid');
    if (similar) {
      const sameFamily = window.TN.perfumeOrder.filter((item) => item !== id && window.TN.perfumes[item].family === perfume.family);
      const others = window.TN.perfumeOrder.filter((item) => item !== id && !sameFamily.includes(item));
      const picks = sameFamily.concat(others).slice(0, 3);
      similar.innerHTML = picks.map(cardMarkup).join('');
    }

    document.addEventListener('tn:reviews-updated', () => {
      const nextRating = window.TNStore.getRating(id);
      if (!ratingBox) return;
      ratingBox.innerHTML = `
        <span class="rating">
          ${starMarkup(nextRating.average)}
          <span class="rating__count">${nextRating.count ? `${String(nextRating.average).replace('.', ',')} · ${nextRating.count} ${window.TN.plural(nextRating.count, 'отзыв', 'отзыва', 'отзывов')}` : 'Пока нет отзывов'}</span>
        </span>
        <a class="ms-3 small text-uppercase" href="#reviews" style="letter-spacing:.1em;font-size:.66rem;">Читать отзывы</a>`;
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
