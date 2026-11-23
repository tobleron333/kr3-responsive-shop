/* ==========================================================================
   Контакты: переключение бутика на карте.
   ========================================================================== */
(function () {
  'use strict';

  const init = () => {
    const map = document.querySelector('#studioMap');
    const buttons = Array.from(document.querySelectorAll('[data-map-lat][data-map-lon]'));
    const label = document.querySelector('#mapLocationName');
    if (!map || !buttons.length) return;

    const setLocation = (button) => {
      const lat = button.getAttribute('data-map-lat');
      const lon = button.getAttribute('data-map-lon');
      const name = button.getAttribute('data-map-name') || '';
      const address = button.getAttribute('data-map-address') || '';

      map.src = `https://yandex.ru/map-widget/v1/?ll=${lon}%2C${lat}&z=16&pt=${lon},${lat},pm2rdm&l=map`;
      map.setAttribute('title', `Карта: ${name}, ${address}`);

      buttons.forEach((item) => item.classList.toggle('is-active', item === button));
      if (label) label.textContent = `${name} — ${address}`;
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        setLocation(button);
        const mapCard = document.querySelector('#mapCard');
        if (mapCard && button.hasAttribute('data-map-scroll')) {
          mapCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });

    const initial = buttons.find((button) => button.classList.contains('is-active')) || buttons[0];
    if (initial) setLocation(initial);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
