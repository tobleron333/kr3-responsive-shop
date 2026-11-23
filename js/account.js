/* ==========================================================================
   Личный кабинет: вход по имени и телефону, статистика, заказы, записи,
   бонусные баллы, отмена записи и выход.
   ========================================================================== */
(function () {
  'use strict';

  const qs = (selector, scope = document) => scope.querySelector(selector);

  const isPhoneValid = (value) => /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(String(value || '').trim());

  const init = () => {
    const authView = qs('#authView');
    const accountView = qs('#accountView');
    if (!authView || !accountView || !window.TNStore) return;

    const loginForm = qs('#loginForm');
    const loginName = qs('#loginName');
    const loginPhone = qs('#loginPhone');
    const loginError = qs('#loginError');
    const logoutButton = qs('#logoutBtn');
    const ordersList = qs('#ordersList');
    const bookingsList = qs('#bookingsList');
    const bonusPoints = qs('#bonusPoints');
    const userName = qs('#accountName');
    const userPhone = qs('#accountPhone');

    const renderStats = () => {
      const stats = window.TNStore.getStats();
      const statOrders = qs('#statOrders');
      const statBookings = qs('#statBookings');
      const statBonuses = qs('#statBonuses');

      if (statOrders) statOrders.textContent = String(stats.orders);
      if (statBookings) statBookings.textContent = String(stats.bookings);
      if (statBonuses) statBonuses.textContent = String(stats.bonuses);
      if (bonusPoints) bonusPoints.textContent = String(stats.bonuses);
    };

    const renderOrders = () => {
      if (!ordersList) return;
      const orders = window.TNStore.getOrders();

      if (!orders.length) {
        ordersList.innerHTML = `
          <div class="account-empty">
            <p>Заказов пока нет. Выберите аромат в каталоге — и он появится здесь.</p>
            <a class="btn btn-outline-primary" href="catalog.html">Перейти в каталог</a>
          </div>`;
        return;
      }

      ordersList.innerHTML = orders
        .map((order) => {
          const perfume = window.TN.perfumes[order.perfumeId];
          const image = perfume ? perfume.image : 'images/perfume-9.jpg';
          return `
            <article class="record-card">
              <div class="record-card__media">
                <img src="${image}" alt="${order.perfumeTitle}" width="92" height="92" loading="lazy">
              </div>
              <div>
                <h3 class="record-card__title">${order.perfumeTitle}</h3>
                <p class="record-card__meta">
                  ${order.volume} мл · ${window.TN.formatPrice(order.price)}<br>
                  Заказ ${order.id} от ${window.TN.formatDate(order.createdAt.slice(0, 10))}
                </p>
              </div>
              <div class="record-card__side">
                <span class="status-badge status-badge--done">Принят</span>
                <span class="record-card__total">${window.TN.formatPrice(order.price)}</span>
                <div class="record-card__actions">
                  <a class="btn btn-outline-primary" href="product.html?id=${order.perfumeId}#reviews">Оставить отзыв</a>
                </div>
              </div>
            </article>`;
        })
        .join('');
    };

    const renderBookings = () => {
      if (!bookingsList) return;
      const bookings = window.TNStore.getBookings();

      if (!bookings.length) {
        bookingsList.innerHTML = `
          <div class="account-empty">
            <p>Записей на мастер-класс пока нет. Соберите свой аромат в мастерской.</p>
            <a class="btn btn-outline-primary" href="order.html">Выбрать программу</a>
          </div>`;
        return;
      }

      bookingsList.innerHTML = bookings
        .map((booking) => {
          const status = window.TNStore.getBookingStatus(booking);
          const program = window.TN.programs[booking.programId];
          const image = program ? program.image : 'images/masterclass.jpg';
          const statusMap = {
            upcoming: { label: 'Предстоит', className: 'status-badge--upcoming' },
            done: { label: 'Прошёл', className: 'status-badge--done' },
            cancelled: { label: 'Отменён', className: 'status-badge--cancelled' },
          };
          const statusInfo = statusMap[status];

          const actions = [];
          if (status === 'upcoming') {
            actions.push(`<button class="btn btn-outline-primary" type="button" data-cancel-booking="${booking.id}">Отменить</button>`);
          }
          if (status === 'done') {
            actions.push('<a class="btn btn-outline-primary" href="order.html">Записаться снова</a>');
          }

          return `
            <article class="record-card">
              <div class="record-card__media">
                <img src="${image}" alt="${booking.programTitle}" width="92" height="92" loading="lazy">
              </div>
              <div>
                <h3 class="record-card__title">${booking.programTitle}</h3>
                <p class="record-card__meta">
                  ${window.TN.formatDate(booking.date)}, ${booking.time}<br>
                  ${booking.participants} ${window.TN.plural(booking.participants, 'участник', 'участника', 'участников')} · запись ${booking.id}
                </p>
              </div>
              <div class="record-card__side">
                <span class="status-badge ${statusInfo.className}">${statusInfo.label}</span>
                <span class="record-card__total">${window.TN.formatPrice(booking.total)}</span>
                ${actions.length ? `<div class="record-card__actions">${actions.join('')}</div>` : ''}
              </div>
            </article>`;
        })
        .join('');
    };

    const renderAccount = () => {
      const profile = window.TNStore.getProfile();
      if (!profile) {
        authView.hidden = false;
        accountView.hidden = true;
        return;
      }

      authView.hidden = true;
      accountView.hidden = false;
      if (userName) userName.textContent = profile.name;
      if (userPhone) userPhone.textContent = profile.phone || 'Телефон не указан';
      renderStats();
      renderOrders();
      renderBookings();
    };

    if (loginForm) {
      loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let valid = true;

        if (!loginName.value.trim() || loginName.value.trim().length < 2) {
          loginName.setAttribute('aria-invalid', 'true');
          valid = false;
        } else {
          loginName.removeAttribute('aria-invalid');
        }

        if (!isPhoneValid(loginPhone.value)) {
          loginPhone.setAttribute('aria-invalid', 'true');
          valid = false;
        } else {
          loginPhone.removeAttribute('aria-invalid');
        }

        if (!valid) {
          if (loginError) {
            loginError.classList.add('is-visible');
            loginError.textContent = 'Проверьте имя и телефон: телефон в формате +7 (900) 000-00-00.';
          }
          return;
        }

        window.TNStore.saveProfile({
          name: loginName.value.trim(),
          phone: loginPhone.value,
        });

        if (loginError) loginError.classList.remove('is-visible');
        renderAccount();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      [loginName, loginPhone].forEach((input) => {
        if (!input) return;
        input.addEventListener('input', () => {
          input.removeAttribute('aria-invalid');
          if (loginError) loginError.classList.remove('is-visible');
        });
      });
    }

    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        window.TNStore.clearProfile();
        if (loginForm) loginForm.reset();
        renderAccount();
      });
    }

    if (bookingsList) {
      bookingsList.addEventListener('click', (event) => {
        const button = event.target.closest('[data-cancel-booking]');
        if (!button) return;
        const confirmed = window.confirm('Отменить запись? Освободившееся время смогут занять другие гости.');
        if (!confirmed) return;

        window.TNStore.cancelBooking(button.getAttribute('data-cancel-booking'));
        renderStats();
        renderBookings();
      });
    }

    renderAccount();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
