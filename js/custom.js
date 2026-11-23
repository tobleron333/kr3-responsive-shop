/* ==========================================================================
   Общие сценарии: кнопка «наверх», появление блоков, быстрое оформление заказа,
   маска телефона.
   ========================================================================== */
(function () {
  'use strict';

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const normalizePhone = (value) => {
    let digits = String(value || '').replace(/\D/g, '');
    if (!digits) return '';
    if (digits[0] === '8') digits = `7${digits.slice(1)}`;
    if (digits[0] !== '7') digits = `7${digits}`;
    digits = digits.slice(0, 11);
    let result = '+7';
    if (digits.length > 1) result += ` (${digits.slice(1, 4)}`;
    if (digits.length >= 4) result += ')';
    if (digits.length > 4) result += ` ${digits.slice(4, 7)}`;
    if (digits.length > 7) result += `-${digits.slice(7, 9)}`;
    if (digits.length > 9) result += `-${digits.slice(9, 11)}`;
    return result;
  };

  const isPhoneValid = (value) => /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(String(value || '').trim());

  const showFieldError = (field, message) => {
    const error = qs(`[data-error-for="${field.id}"]`);
    if (message) {
      field.setAttribute('aria-invalid', 'true');
      if (error) {
        error.textContent = message;
        error.classList.add('is-visible');
      }
    } else {
      field.removeAttribute('aria-invalid');
      if (error) {
        error.textContent = '';
        error.classList.remove('is-visible');
      }
    }
  };

  /* Телефонная маска ------------------------------------------------------ */
  const initPhones = () => {
    qsa('input[type="tel"]').forEach((input) => {
      input.addEventListener('input', () => {
        input.value = normalizePhone(input.value);
        if (input.getAttribute('aria-invalid') === 'true') {
          showFieldError(input, '');
        }
      });
    });
  };

  /* Кнопка «наверх» ------------------------------------------------------- */
  const initScrollTop = () => {
    const button = qs('#scrollTop');
    if (!button) return;

    const update = () => {
      button.classList.toggle('is-visible', window.scrollY > 420);
    };

    window.addEventListener('scroll', update, { passive: true });
    update();

    button.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  /* Появление блоков ------------------------------------------------------ */
  const initReveal = () => {
    const items = qsa('[data-reveal]');
    if (!items.length) return;

    document.documentElement.classList.add('js-reveal');

    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach((item) => observer.observe(item));
  };

  /* Быстрое оформление заказа --------------------------------------------- */
  const initOrderModal = () => {
    const modalElement = qs('#orderModal');
    if (!modalElement || !window.bootstrap || !window.TN || !window.TNStore) return;

    const modal = window.bootstrap.Modal.getOrCreateInstance(modalElement);
    const form = qs('#orderForm');
    const title = qs('#orderModalTitle');
    const perfumeInput = qs('#orderPerfumeId');
    const volumeInput = qs('#orderVolume');
    const priceInput = qs('#orderPrice');
    const productBox = qs('#orderProduct');
    const success = qs('#orderSuccess');
    const successNumber = qs('#orderNumber');
    const submitButton = qs('#orderSubmit');
    const nameInput = qs('#orderName');
    const phoneInput = qs('#orderPhone');
    const commentInput = qs('#orderComment');

    const setProduct = (perfumeId, volume, price) => {
      const perfume = window.TN.perfumes[perfumeId];
      if (!perfume) return;

      const selectedVolume = Number(volume) || 50;
      const selectedPrice = Number(price) || perfume.volumePrices[selectedVolume] || perfume.price;

      perfumeInput.value = perfumeId;
      volumeInput.value = String(selectedVolume);
      priceInput.value = String(selectedPrice);

      if (productBox) {
        productBox.innerHTML = `
          <img src="${perfume.image}" alt="${perfume.title}" width="72" height="90" loading="lazy">
          <div>
            <strong>${perfume.title}</strong>
            <span>${selectedVolume} мл · ${window.TN.formatPrice(selectedPrice)}</span>
          </div>`;
      }

      if (title) title.textContent = 'Оформление заказа';
      modalElement.querySelector('.modal-body')?.classList.remove('is-success');
      success?.classList.remove('is-visible');
      form?.classList.remove('d-none');
      if (submitButton) submitButton.classList.remove('d-none');
    };

    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-order-perfume]');
      if (!trigger) return;
      event.preventDefault();
      setProduct(
        trigger.getAttribute('data-order-perfume'),
        trigger.getAttribute('data-volume'),
        trigger.getAttribute('data-price')
      );
      const profile = window.TNStore.getProfile();
      if (profile) {
        if (nameInput && !nameInput.value) nameInput.value = profile.name;
        if (phoneInput && !phoneInput.value) phoneInput.value = profile.phone;
      }
      modal.show();
    });
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      let valid = true;

      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        showFieldError(nameInput, 'Укажите имя — минимум 2 символа');
        valid = false;
      } else {
        showFieldError(nameInput, '');
      }

      if (!isPhoneValid(phoneInput.value)) {
        showFieldError(phoneInput, 'Телефон в формате +7 (900) 000-00-00');
        valid = false;
      } else {
        showFieldError(phoneInput, '');
      }

      if (!valid) return;

      const perfumeId = perfumeInput.value;
      const perfume = window.TN.perfumes[perfumeId];
      const order = window.TNStore.addOrder({
        perfumeId,
        perfumeTitle: perfume ? perfume.title : 'Аромат',
        volume: Number(volumeInput.value) || 50,
        price: Number(priceInput.value) || 0,
        name: nameInput.value.trim(),
        phone: phoneInput.value,
        comment: commentInput ? commentInput.value.trim() : '',
      });

      window.TNStore.saveProfile({
        name: nameInput.value.trim(),
        phone: phoneInput.value,
        email: window.TNStore.getProfile()?.email || '',
      });

      if (successNumber) successNumber.textContent = order.id;
      success?.classList.add('is-visible');
      form.classList.add('d-none');
      submitButton?.classList.add('d-none');
      if (title) title.textContent = 'Заказ принят';

      form.reset();
      perfumeInput.value = '';
      volumeInput.value = '';
      priceInput.value = '';
      qsa('[aria-invalid="true"]', form).forEach((field) => field.removeAttribute('aria-invalid'));
    });

    modalElement.addEventListener('hidden.bs.modal', () => {
      success?.classList.remove('is-visible');
      form.classList.remove('d-none');
      submitButton?.classList.remove('d-none');
      if (title) title.textContent = 'Оформление заказа';
    });
  };

  const init = () => {
    initPhones();
    initScrollTop();
    initReveal();
    initOrderModal();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
