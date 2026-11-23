/* ==========================================================================
   Запись на мастер-класс: программа, дата, свободные слоты, участники,
   пересчёт стоимости и подтверждение.
   ========================================================================== */
(function () {
  'use strict';

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const isPhoneValid = (value) => /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(String(value || '').trim());

  const init = () => {
    const form = qs('#bookingForm');
    if (!form || !window.TN || !window.TNStore) return;

    const programSelect = qs('#bookingProgram');
    const dateInput = qs('#bookingDate');
    const slotsBox = qs('#bookingSlots');
    const participantsSelect = qs('#bookingParticipants');
    const nameInput = qs('#bookingName');
    const phoneInput = qs('#bookingPhone');
    const emailInput = qs('#bookingEmail');
    const commentInput = qs('#bookingComment');
    const agreeInput = qs('#bookingAgree');
    const errorBox = qs('#bookingError');
    const submitButton = qs('#bookingSubmit');
    const detailsBox = qs('#programDetails');
    const priceHint = qs('#programPriceHint');

    const summaryProgram = qs('#summaryProgram');
    const summaryDate = qs('#summaryDate');
    const summaryTime = qs('#summaryTime');
    const summaryParticipants = qs('#summaryParticipants');
    const summaryTotal = qs('#summaryTotal');
    const summaryDuration = qs('#summaryDuration');
    const barTotal = qs('#bookingBarTotal');

    const modalElement = qs('#bookingModal');
    const modal = modalElement && window.bootstrap
      ? window.bootstrap.Modal.getOrCreateInstance(modalElement)
      : null;
    const modalCode = qs('#bookingCode');
    const modalDetails = qs('#bookingModalDetails');
    const modalTotal = qs('#bookingModalTotal');

    let selectedTime = null;

    const params = new URLSearchParams(window.location.search);
    const initialProgram = params.get('program');
    const initialDate = params.get('date');

    if (dateInput) {
      dateInput.min = window.TN.todayISO();
      dateInput.value = initialDate && initialDate >= window.TN.todayISO()
        ? initialDate
        : window.TN.addDaysISO(window.TN.todayISO(), 1);
    }

    if (programSelect) {
      programSelect.innerHTML = window.TN.programOrder
        .map((id) => {
          const program = window.TN.programs[id];
          return `<option value="${id}">${program.title} — ${window.TN.formatPrice(program.price)}</option>`;
        })
        .join('');
      if (initialProgram && window.TN.programs[initialProgram]) {
        programSelect.value = initialProgram;
      }
    }

    const currentProgram = () => window.TN.programs[programSelect ? programSelect.value : 'signature'];
    const currentTotal = () => {
      const program = currentProgram();
      const people = Number(participantsSelect ? participantsSelect.value : 1) || 1;
      return program.price * people;
    };

    const fillParticipants = () => {
      if (!participantsSelect) return;
      const program = currentProgram();
      const previous = Number(participantsSelect.value);
      participantsSelect.innerHTML = '';

      for (let count = program.minPeople; count <= program.maxPeople; count += 1) {
        const option = document.createElement('option');
        option.value = String(count);
        option.textContent = `${count} ${window.TN.plural(count, 'участник', 'участника', 'участников')}`;
        participantsSelect.appendChild(option);
      }

      participantsSelect.value = String(
        previous >= program.minPeople && previous <= program.maxPeople ? previous : program.minPeople
      );
    };

    const renderProgramDetails = () => {
      const program = currentProgram();
      if (detailsBox) {
        detailsBox.innerHTML = `
          <p>${program.description}</p>
          <ul>${program.includes.map((item) => `<li>${item}</li>`).join('')}</ul>`;
      }
      if (priceHint) {
        priceHint.textContent = `${window.TN.formatPrice(program.price)} за участника · ${program.duration} минут`;
      }
    };

    const isSlotBusy = (time) => {
      const date = dateInput ? dateInput.value : window.TN.todayISO();
      const program = currentProgram();
      const seed = `${date}-${program.title}-${time}`;
      let hash = 0;
      for (let index = 0; index < seed.length; index += 1) {
        hash = (hash * 31 + seed.charCodeAt(index)) % 997;
      }
      if (hash % 5 === 0) return true;

      return window.TNStore.getBookings().some((booking) => (
        !booking.cancelled && booking.date === date && booking.time === time
      ));
    };

    const updateSummary = () => {
      const program = currentProgram();
      const people = Number(participantsSelect ? participantsSelect.value : 1) || 1;
      const total = program.price * people;

      if (summaryProgram) summaryProgram.textContent = program.title;
      if (summaryDate) summaryDate.textContent = window.TN.formatDate(dateInput ? dateInput.value : '');
      if (summaryTime) summaryTime.textContent = selectedTime || 'Не выбрано';
      if (summaryParticipants) {
        summaryParticipants.textContent = `${people} ${window.TN.plural(people, 'участник', 'участника', 'участников')}`;
      }
      if (summaryTotal) summaryTotal.textContent = window.TN.formatPrice(total);
      if (summaryDuration) summaryDuration.textContent = `${program.duration} минут`;
      if (barTotal) barTotal.textContent = window.TN.formatPrice(total);
    };

    const renderSlots = () => {
      if (!slotsBox) return;
      selectedTime = null;
      slotsBox.innerHTML = '';

      const date = dateInput ? dateInput.value : '';

      if (!date) {
        slotsBox.innerHTML = '<p class="slots-empty">Сначала выберите дату.</p>';
        updateSummary();
        return;
      }

      window.TN.timeSlots.forEach((time) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'slot-btn';
        button.textContent = time;
        button.dataset.time = time;

        if (isSlotBusy(time)) {
          button.disabled = true;
          button.title = 'Это время уже занято';
          button.setAttribute('aria-label', `${time} — занято`);
        } else {
          button.setAttribute('aria-label', `${time} — свободно`);
        }

        button.addEventListener('click', () => {
          selectedTime = time;
          qsa('.slot-btn', slotsBox).forEach((slot) => slot.classList.toggle('is-selected', slot === button));
          updateSummary();
        });

        slotsBox.appendChild(button);
      });

      updateSummary();
    };

    if (programSelect) {
      programSelect.addEventListener('change', () => {
        fillParticipants();
        renderProgramDetails();
        renderSlots();
      });
    }

    if (dateInput) {
      dateInput.addEventListener('change', () => {
        renderSlots();
        updateSummary();
      });
    }

    if (participantsSelect) {
      participantsSelect.addEventListener('change', () => {
        updateSummary();
      });
    }

    fillParticipants();
    renderProgramDetails();
    renderSlots();

    const profile = window.TNStore.getProfile();
    if (profile) {
      if (nameInput && !nameInput.value) nameInput.value = profile.name;
      if (phoneInput && !phoneInput.value) phoneInput.value = profile.phone;
      if (emailInput && !emailInput.value) emailInput.value = profile.email || '';
    }

    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!errorBox) return;

      const messages = [];

      if (!dateInput || !dateInput.value) messages.push('Выберите дату мастер-класса.');
      if (!selectedTime) messages.push('Выберите свободное время.');
      if (!nameInput || nameInput.value.trim().length < 2) messages.push('Укажите имя — минимум 2 символа.');
      if (!phoneInput || !isPhoneValid(phoneInput.value)) messages.push('Телефон в формате +7 (900) 000-00-00.');
      if (!agreeInput || !agreeInput.checked) messages.push('Нужно согласие на обработку данных.');

      if (messages.length) {
        errorBox.hidden = false;
        errorBox.innerHTML = messages.map((message) => `<div>${message}</div>`).join('');
        errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      errorBox.hidden = true;

      const program = currentProgram();
      const people = Number(participantsSelect.value) || 1;
      const total = program.price * people;

      const booking = window.TNStore.addBooking({
        programId: programSelect.value,
        programTitle: program.title,
        date: dateInput.value,
        time: selectedTime,
        participants: people,
        total,
        name: nameInput.value.trim(),
        phone: phoneInput.value,
        email: emailInput ? emailInput.value.trim() : '',
        comment: commentInput ? commentInput.value.trim() : '',
      });

      window.TNStore.saveProfile({
        name: nameInput.value.trim(),
        phone: phoneInput.value,
        email: emailInput ? emailInput.value.trim() : '',
      });

      if (modalCode) modalCode.textContent = booking.id;
      if (modalTotal) modalTotal.textContent = window.TN.formatPrice(total);
      if (modalDetails) {
        modalDetails.innerHTML = `
          <li><span>Программа</span><span>${program.title}</span></li>
          <li><span>Дата</span><span>${window.TN.formatDate(booking.date)}</span></li>
          <li><span>Время</span><span>${booking.time}</span></li>
          <li><span>Участники</span><span>${people} ${window.TN.plural(people, 'человек', 'человека', 'человек')}</span></li>`;
      }

      if (modal) {
        modal.show();
      } else if (submitButton) {
        submitButton.textContent = 'Запись оформлена';
        submitButton.disabled = true;
      }

      form.reset();
      selectedTime = null;
      if (dateInput) {
        dateInput.value = window.TN.addDaysISO(window.TN.todayISO(), 1);
        dateInput.min = window.TN.todayISO();
      }
      if (programSelect) programSelect.value = 'signature';
      fillParticipants();
      renderProgramDetails();
      renderSlots();

      if (modalElement) {
        modalElement.addEventListener('hidden.bs.modal', () => {
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Записаться';
          }
        }, { once: true });
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
