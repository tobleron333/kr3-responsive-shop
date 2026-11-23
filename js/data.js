/* ==========================================================================
   «Тихая нота» — общие данные сайта: ароматы, мастер-классы, слоты, утилиты.
   ========================================================================== */
(function () {
  'use strict';

  const perfumes = {
    'paper-smoke': {
      title: 'Бумага и дым',
      subtitle: 'Тихий кабинет, стопка писем и тлеющая сигара где-то в соседней комнате.',
      family: 'woody',
      familyLabel: 'Древесные',
      intensity: 'medium',
      intensityLabel: 'Средняя',
      seasons: ['autumn', 'winter'],
      seasonLabel: 'Осень — зима',
      price: 8900,
      volumePrices: { 50: 8900, 100: 11500 },
      image: 'images/perfume-1.jpg',
      badge: 'Хит',
      badgeClass: 'bg-warning',
      notes: { top: 'Бергамот, чёрный перец', heart: 'Ладан, бумага', base: 'Кедр, ветивер' },
      cardNotes: 'Бергамот · ладан · кедр',
      concentration: 'Eau de parfum',
      longevity: '6–8 часов',
      sillage: 'Умеренный',
      year: 2024,
      description: 'Аромат для тех, кто любит тишину с характером. Сухая бумага и ладан звучат почти архитектурно, а кедр и ветивер держат композицию у самой кожи.',
      story: 'Мы собирали его как кабинет: старые книги, деревянный стол, чернила и прохлада за окном. Это аромат сосредоточенности, а не первого впечатления.',
      warning: 'Содержит натуральные эфирные масла. Перед первым использованием нанесите на внутренний сгиб локтя и подождите 30 минут.',
      quiz: { occasion: ['office', 'daily'], mood: ['calm', 'mystery'], family: 'woody', intensity: 'medium' },
    },
    'fig-noon': {
      title: 'Инжир в полдень',
      subtitle: 'Зелёный сад, горячий камень и спелый инжир прямо с ветки.',
      family: 'chypre',
      familyLabel: 'Шипровые',
      intensity: 'light',
      intensityLabel: 'Лёгкая',
      seasons: ['spring', 'summer'],
      seasonLabel: 'Весна — лето',
      price: 8400,
      volumePrices: { 50: 8400, 100: 10800 },
      image: 'images/perfume-2.jpg',
      badge: 'Новинка',
      badgeClass: 'bg-success',
      notes: { top: 'Инжир, зелёный лист', heart: 'Молочный кокос, ирис', base: 'Белый кедр, мох' },
      cardNotes: 'Инжир · ирис · мох',
      concentration: 'Eau de parfum',
      longevity: '4–6 часов',
      sillage: 'Лёгкий',
      year: 2025,
      description: 'Солнечный, но не сладкий. Млечный сок инжира и зелёный лист делают его свежим, а ирис и белый кедр добавляют мягкости и чистоты.',
      story: 'Летний аромат, который не хочется прятать в отпуск: он одинаково уместен на прогулке, в офисе и на веранде с бокалом белого вина.',
      warning: 'Натуральный инжирный аккорд может окрашивать светлую ткань — наносите на кожу, а не на одежду.',
      quiz: { occasion: ['daily', 'office'], mood: ['bright', 'calm'], family: 'chypre', intensity: 'light' },
    },
    'velvet-august': {
      title: 'Бархатный август',
      subtitle: 'Последний тёплый вечер, тяжёлые шторы и пудровые розы.',
      family: 'floral',
      familyLabel: 'Цветочные',
      intensity: 'rich',
      intensityLabel: 'Насыщенная',
      seasons: ['summer', 'autumn'],
      seasonLabel: 'Лето — осень',
      price: 12900,
      volumePrices: { 50: 12900, 100: 15900 },
      image: 'images/perfume-3.jpg',
      badge: 'Лимитированная серия',
      badgeClass: 'bg-danger',
      notes: { top: 'Роза, розовый перец', heart: 'Ирис, гелиотроп', base: 'Пачули, амбра' },
      cardNotes: 'Роза · ирис · пачули',
      concentration: 'Extrait de parfum',
      longevity: '8–10 часов',
      sillage: 'Насыщенный',
      year: 2023,
      description: 'Бархатная роза без сладости: пудровый ирис и гелиотроп смягчают её, а пачули и амбра оставляют глубокий шлейф на весь вечер.',
      story: 'Август — это когда лето уже устало, но ещё не готово уходить. Мы хотели поймать именно это состояние: тёплое, медленное, чуть печальное.',
      warning: 'Высокая концентрация: достаточно одного нажатия. Не наносите на кожу перед долгим пребыванием на солнце.',
      quiz: { occasion: ['evening', 'special'], mood: ['warm', 'mystery'], family: 'floral', intensity: 'rich' },
    },
    'salt-leather': {
      title: 'Соль и кожа',
      subtitle: 'Морской ветер, прогретая кожа и соль на запястье.',
      family: 'chypre',
      familyLabel: 'Шипровые',
      intensity: 'medium',
      intensityLabel: 'Средняя',
      seasons: ['spring', 'autumn'],
      seasonLabel: 'Весна — осень',
      price: 10400,
      volumePrices: { 50: 10400, 100: 13200 },
      image: 'images/perfume-4.jpg',
      badge: '',
      badgeClass: '',
      notes: { top: 'Морская соль, грейпфрут', heart: 'Кожа, шалфей', base: 'Дубовый мох, ветивер' },
      cardNotes: 'Соль · кожа · мох',
      concentration: 'Eau de parfum',
      longevity: '6–8 часов',
      sillage: 'Умеренный',
      year: 2024,
      description: 'Сдержанный кожаный аромат с морской солью. Грейпфрут даёт вспышку в начале, шалфей и кожа уводят в сухую, взрослую базу.',
      story: 'Он появился после поездки на север: серое море, солёный ветер и старая кожаная куртка, которую невозможно заменить.',
      warning: 'Содержит дубовый мох — редкий аллерген. Не рекомендуется при повышенной чувствительности кожи.',
      quiz: { occasion: ['evening', 'special'], mood: ['mystery', 'calm'], family: 'chypre', intensity: 'medium' },
    },
    'slow-evening': {
      title: 'Медленный вечер',
      subtitle: 'Смолы, мёд и тёплый свет лампы над книгой.',
      family: 'gourmand',
      familyLabel: 'Гурманские',
      intensity: 'rich',
      intensityLabel: 'Насыщенная',
      seasons: ['autumn', 'winter'],
      seasonLabel: 'Осень — зима',
      price: 13900,
      volumePrices: { 50: 13900, 100: 16900 },
      image: 'images/perfume-5.jpg',
      badge: 'Хит',
      badgeClass: 'bg-warning',
      notes: { top: 'Мёд, корица', heart: 'Бензоин, ладан', base: 'Сандал, ваниль' },
      cardNotes: 'Мёд · бензоин · сандал',
      concentration: 'Extrait de parfum',
      longevity: '10–12 часов',
      sillage: 'Насыщенный',
      year: 2024,
      description: 'Тёплый гурманский аромат без десертной приторности: мёд и корица встречаются с бензоином и сандалом, и вечер становится длиннее.',
      story: 'Его хочется носить с свитером, а не с вечерним платьем. Мы добавили ладан, чтобы мёд не превратился в варенье.',
      warning: 'Содержит корицу и ваниль. Возможна индивидуальная реакция, особенно на чувствительной коже.',
      quiz: { occasion: ['evening', 'special'], mood: ['warm'], family: 'gourmand', intensity: 'rich' },
    },
    'mandarin-snow': {
      title: 'Мандарин в снегу',
      subtitle: 'Корка мандарина, холодный воздух и немного белого мускуса.',
      family: 'citrus',
      familyLabel: 'Цитрусовые',
      intensity: 'light',
      intensityLabel: 'Лёгкая',
      seasons: ['winter', 'spring'],
      seasonLabel: 'Зима — весна',
      price: 7900,
      volumePrices: { 50: 7900, 100: 10200 },
      image: 'images/perfume-6.jpg',
      badge: 'Скидка',
      badgeClass: 'bg-danger',
      notes: { top: 'Мандарин, нероли', heart: 'Имбирь, белый чай', base: 'Белый мускус, кедр' },
      cardNotes: 'Мандарин · имбирь · мускус',
      concentration: 'Eau de toilette',
      longevity: '3–5 часов',
      sillage: 'Лёгкий',
      year: 2025,
      description: 'Праздничный, но не открыточный. Сочный мандарин быстро становится прозрачным, оставляя прохладный след белого мускуса и чая.',
      story: 'Зимний аромат, который не пытается согреть: он скорее про свежесть утреннего снега и мандариновую корку в кармане.',
      warning: 'Цитрусовые масла фотосенсибилизируют кожу. Не наносите перед солярием или долгим пребыванием на солнце.',
      quiz: { occasion: ['daily', 'office'], mood: ['bright'], family: 'citrus', intensity: 'light' },
    },
    pollen: {
      title: 'Пыльца',
      subtitle: 'Луговые травы, ромашка и тёплый воздух над полем.',
      family: 'floral',
      familyLabel: 'Цветочные',
      intensity: 'light',
      intensityLabel: 'Лёгкая',
      seasons: ['spring', 'summer'],
      seasonLabel: 'Весна — лето',
      price: 8200,
      volumePrices: { 50: 8200, 100: 10500 },
      image: 'images/perfume-7.jpg',
      badge: '',
      badgeClass: '',
      notes: { top: 'Ромашка, лимон', heart: 'Лаванда, ирис', base: 'Белый мускус, сено' },
      cardNotes: 'Ромашка · лаванда · сено',
      concentration: 'Eau de parfum',
      longevity: '4–6 часов',
      sillage: 'Лёгкий',
      year: 2024,
      description: 'Прозрачный травяной аромат с ромашкой и сеном. Он не звенит, а шелестит — идеален для тех, кому сложно носить «парфюм».',
      story: 'Летом в мастерской пахло ромашкой из аптеки и скошенной травой за окном. Так появилась «Пыльца» — самый тихий аромат коллекции.',
      warning: 'Содержит ромашку и лаванду. При аллергии на сложноцветные сначала сделайте тест на коже.',
      quiz: { occasion: ['daily', 'office'], mood: ['calm', 'warm'], family: 'floral', intensity: 'light' },
    },
    'dark-honey': {
      title: 'Тёмный мёд',
      subtitle: 'Гречишный мёд, сушёные сливы и старая деревянная шкатулка.',
      family: 'gourmand',
      familyLabel: 'Гурманские',
      intensity: 'rich',
      intensityLabel: 'Насыщенная',
      seasons: ['autumn', 'winter'],
      seasonLabel: 'Осень — зима',
      price: 14900,
      volumePrices: { 50: 14900, 100: 17900 },
      image: 'images/perfume-8.jpg',
      badge: 'Хит',
      badgeClass: 'bg-warning',
      notes: { top: 'Слива, чёрный перец', heart: 'Тёмный мёд, ирис', base: 'Пачули, бензоин' },
      cardNotes: 'Слива · мёд · пачули',
      concentration: 'Extrait de parfum',
      longevity: '10–12 часов',
      sillage: 'Насыщенный',
      year: 2023,
      description: 'Густой, почти съедобный аромат, в котором мёд звучит тёмным деревом, а не карамелью. Один из самых «зимних» в коллекции.',
      story: 'Мы купили банку гречишного мёда на ярмарке и весь вечер искали, как передать его глубину без сахара. Помогли слива и пачули.',
      warning: 'Насыщенная композиция: наносите один раз. Не рекомендуется детям и при чувствительности к эфирным маслам.',
      quiz: { occasion: ['evening', 'special'], mood: ['warm', 'mystery'], family: 'gourmand', intensity: 'rich' },
    },
    'quiet-note': {
      title: 'Тихая нота',
      subtitle: 'Наш первый аромат: ирис, сандал и почти неслышная пудра.',
      family: 'woody',
      familyLabel: 'Древесные',
      intensity: 'medium',
      intensityLabel: 'Средняя',
      seasons: ['all'],
      seasonLabel: 'Круглый год',
      price: 9800,
      volumePrices: { 50: 9800, 100: 12400 },
      image: 'images/perfume-9.jpg',
      badge: 'Фирменный',
      badgeClass: 'bg-info',
      notes: { top: 'Ирис, бергамот', heart: 'Сандал, фиалка', base: 'Кедр, мускус' },
      cardNotes: 'Ирис · сандал · мускус',
      concentration: 'Eau de parfum',
      longevity: '6–8 часов',
      sillage: 'Умеренный',
      year: 2022,
      description: 'Аромат, с которого началась мастерская. Мягкий ирис и сандал, немного зелени и пудры — он не перебивает человека, а становится его продолжением.',
      story: 'Название появилось раньше формулы. Мы хотели аромат, который можно не замечать, но который всегда с тобой.',
      warning: 'Содержит ирис и сандал. Стандартная рекомендация — тест на коже перед первым использованием.',
      quiz: { occasion: ['office', 'evening', 'daily'], mood: ['calm', 'mystery'], family: 'woody', intensity: 'medium' },
    },
  };

  const perfumeOrder = [
    'paper-smoke',
    'fig-noon',
    'velvet-august',
    'salt-leather',
    'slow-evening',
    'mandarin-snow',
    'pollen',
    'dark-honey',
    'quiet-note',
  ];

  const families = {
    woody: 'Древесные',
    floral: 'Цветочные',
    citrus: 'Цитрусовые',
    gourmand: 'Гурманские',
    chypre: 'Шипровые',
  };

  const intensities = {
    light: 'Лёгкая',
    medium: 'Средняя',
    rich: 'Насыщенная',
  };

  const seasons = {
    spring: 'Весна',
    summer: 'Лето',
    autumn: 'Осень',
    winter: 'Зима',
  };

  const programs = {
    signature: {
      title: 'Собери свой аромат',
      short: 'Ваш первый авторский парфюм',
      duration: 90,
      price: 4500,
      minPeople: 1,
      maxPeople: 6,
      image: 'images/masterclass.jpg',
      description: 'Знакомимся с нотами, собираем формулу под ваш характер и уходим с флаконом 30 мл собственного аромата.',
      includes: ['Консультация парфюмера', 'Более 40 ингредиентов', 'Флакон 30 мл с вашим именем'],
    },
    duo: {
      title: 'Парфюм для двоих',
      short: 'Свидание в мастерской',
      duration: 120,
      price: 3900,
      minPeople: 2,
      maxPeople: 2,
      image: 'images/atelier.jpg',
      description: 'Два флакона, два характера и один вечер. Идеально для свидания, подарка или разговора без телефонов.',
      includes: ['Два флакона 30 мл', 'Шампанское или чай', 'Фотография на память'],
    },
    candle: {
      title: 'Ароматическая свеча',
      short: 'Свеча из соевого воска',
      duration: 60,
      price: 3200,
      minPeople: 1,
      maxPeople: 6,
      image: 'images/atelier.jpg',
      description: 'Собираем аромат для дома и заливаем его в соевую свечу. Через два часа её можно забирать.',
      includes: ['Соевый воск и фитиль', 'Выбор ароматической композиции', 'Свеча 180 мл в подарок'],
    },
  };

  const programOrder = ['signature', 'duo', 'candle'];

  const timeSlots = ['11:00', '12:30', '14:00', '15:30', '17:00', '18:30', '20:00'];

  const formatPrice = (value) => `${new Intl.NumberFormat('ru-RU').format(Math.round(value))} ₽`;

  const todayISO = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10);
  };

  const addDaysISO = (iso, days) => {
    const date = new Date(`${iso}T12:00:00`);
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(`${iso}T12:00:00`).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatShortDate = (iso) => {
    if (!iso) return '—';
    return new Date(`${iso}T12:00:00`).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    });
  };

  const plural = (count, one, few, many) => {
    const n = Math.abs(count) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) return many;
    if (n1 > 1 && n1 < 5) return few;
    if (n1 === 1) return one;
    return many;
  };

  const pad = (value) => String(value).padStart(2, '0');

  const randomCode = (prefix) => {
    const number = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${pad(new Date().getMonth() + 1)}${number}`;
  };

  window.TN = {
    perfumes,
    perfumeOrder,
    families,
    intensities,
    seasons,
    programs,
    programOrder,
    timeSlots,
    formatPrice,
    formatDate,
    formatShortDate,
    todayISO,
    addDaysISO,
    plural,
    randomCode,
  };
})();
