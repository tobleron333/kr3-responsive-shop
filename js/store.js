/* ==========================================================================
   «Тихая нота» — локальное хранилище: профиль, заказы, записи и отзывы.
   Backend не требуется: всё живёт в localStorage браузера.
   ========================================================================== */
(function () {
  'use strict';

  const KEYS = {
    profile: 'tn_profile',
    bookings: 'tn_bookings',
    orders: 'tn_orders',
    reviews: 'tn_reviews',
    theme: 'tn_theme',
  };

  const seedReviews = [
    {
      id: 'seed-paper-smoke-1', perfumeId: 'paper-smoke', name: 'Анна', rating: 5, verified: true,
      date: '2026-10-19', createdAt: '2026-10-19T18:20:00',
      text: 'Искала аромат для работы, чтобы не перебивать людей в переговорной, и «Бумага и дым» оказалась идеальной. Слышно только близко, зато весь день. Ладан не церковный, а скорее кабинетный — очень спокойный.',
    },
    {
      id: 'seed-paper-smoke-2', perfumeId: 'paper-smoke', name: 'Григорий', rating: 4, verified: true,
      date: '2026-09-08', createdAt: '2026-09-08T12:10:00',
      text: 'Стойкость честные шесть часов, на шарфе держится до следующего утра. Первые полчаса довольно резкий перец, но потом становится мягким деревом. Для повседневной носки в офис — отлично.',
    },
    {
      id: 'seed-fig-noon-1', perfumeId: 'fig-noon', name: 'Мария', rating: 5, verified: true,
      date: '2026-08-30', createdAt: '2026-08-30T15:40:00',
      text: 'Пахнет именно инжиром с ветки, а не вареньем. Летом в жару не душит, обновляю раз в день. Взяла 50 мл и уже жалею, что не сотку.',
    },
    {
      id: 'seed-velvet-august-1', perfumeId: 'velvet-august', name: 'Ольга', rating: 5, verified: true,
      date: '2026-10-11', createdAt: '2026-10-11T21:00:00',
      text: 'Один пшик на запястье — и шлейф на весь вечер. Роза пудровая, без бабушкиного оттенка. На свидании спросили, что за аромат, три раза. Стоит своих денег.',
    },
    {
      id: 'seed-velvet-august-2', perfumeId: 'velvet-august', name: 'Дарья', rating: 4, verified: true,
      date: '2026-07-22', createdAt: '2026-07-22T19:30:00',
      text: 'Очень красивый, но действительно громкий. В офисе не рискнула бы, а вечером — то, что нужно. Флакон тяжёлый, приятно держать.',
    },
    {
      id: 'seed-salt-leather-1', perfumeId: 'salt-leather', name: 'Илья', rating: 5, verified: true,
      date: '2026-09-17', createdAt: '2026-09-17T14:05:00',
      text: 'Наконец-то кожа без сладкого и без «кожаного магазина». Соль и грейпфрут в начале бодрят, дальше — сухой мох. Носил осенью каждый день.',
    },
    {
      id: 'seed-slow-evening-1', perfumeId: 'slow-evening', name: 'Екатерина', rating: 5, verified: true,
      date: '2026-10-02', createdAt: '2026-10-02T20:15:00',
      text: 'Мёд, но не приторный, а тёмный и смолистый. Наносила перед ужином, на следующий день от свитера ещё пахло сандалом. Очень уютно.',
    },
    {
      id: 'seed-slow-evening-2', perfumeId: 'slow-evening', name: 'Пётр', rating: 4, verified: true,
      date: '2026-08-14', createdAt: '2026-08-14T22:40:00',
      text: 'Мощный зимний аромат. В жару лучше не пробовать, а вот в ноябре — идеально. Корицы могло быть меньше, но это дело вкуса.',
    },
    {
      id: 'seed-mandarin-snow-1', perfumeId: 'mandarin-snow', name: 'Виктория', rating: 5, verified: true,
      date: '2026-01-09', createdAt: '2026-01-09T11:25:00',
      text: 'Купила перед Новым годом и не пожалела. Мандарин настоящий, с горьковатой коркой, а не леденцовый. На работе коллеги просили «пшикнуть» — видимо, работает.',
    },
    {
      id: 'seed-pollen-1', perfumeId: 'pollen', name: 'Светлана', rating: 4, verified: true,
      date: '2026-06-06', createdAt: '2026-06-06T10:00:00',
      text: 'Тихий, травяной, честный. Ромашка с сеном — для меня запах детства. Стойкость небольшая, но для такого прозрачного аромата это нормально.',
    },
    {
      id: 'seed-dark-honey-1', perfumeId: 'dark-honey', name: 'Роман', rating: 5, verified: true,
      date: '2026-11-01', createdAt: '2026-11-01T19:10:00',
      text: 'Пожалуй, самый интересный гурманский аромат, который я пробовал. Слива и мёд звучат как тёмное дерево, никакой карамели. Один пшик — и ты в другом времени.',
    },
    {
      id: 'seed-dark-honey-2', perfumeId: 'dark-honey', name: 'Алина', rating: 4, verified: true,
      date: '2026-09-25', createdAt: '2026-09-25T18:35:00',
      text: 'Очень насыщенный, для меня почти вечерний. Взяла пробник, хватило надолго. Думаю про полный флакон к зиме.',
    },
    {
      id: 'seed-quiet-note-1', perfumeId: 'quiet-note', name: 'Ксения', rating: 5, verified: true,
      date: '2026-10-24', createdAt: '2026-10-24T16:50:00',
      text: 'Была на мастер-классе и выбрала этот аромат как готовый. Ирис и сандал — моя личная тишина. Не жалею, что не стала собирать свой: этот будто написали про меня.',
    },
    {
      id: 'seed-quiet-note-2', perfumeId: 'quiet-note', name: 'Максим', rating: 5, verified: true,
      date: '2026-09-12', createdAt: '2026-09-12T13:15:00',
      text: 'Подарил жене, теперь хочу себе. Пудровый, но не женственный в стереотипном смысле — скорее дорогой и спокойный. Упаковка отдельный восторг.',
    },
    {
      id: 'seed-quiet-note-3', perfumeId: 'quiet-note', name: 'Софья', rating: 4, verified: true,
      date: '2026-07-18', createdAt: '2026-07-18T17:00:00',
      text: 'Сначала показался слишком тихим, но через неделю поняла, что в этом и смысл. Отличный вариант «аромат для себя». Хотелось бы флакон 30 мл для поездок.',
    },
  ];

  const read = (key, fallback) => {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed === null || parsed === undefined ? fallback : parsed;
    } catch (error) {
      return fallback;
    }
  };

  const write = (key, value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  };

  const getProfile = () => {
    const profile = read(KEYS.profile, null);
    if (!profile || !profile.name) return null;
    return profile;
  };

  const saveProfile = (profile) => {
    const clean = {
      name: String(profile.name || '').trim(),
      phone: String(profile.phone || '').trim(),
      email: String(profile.email || '').trim(),
      since: profile.since || new Date().toISOString(),
    };
    write(KEYS.profile, clean);
    return clean;
  };

  const clearProfile = () => {
    try {
      window.localStorage.removeItem(KEYS.profile);
    } catch (error) { /* хранилище недоступно */ }
  };

  const getOrders = () => {
    const orders = read(KEYS.orders, []);
    return Array.isArray(orders) ? orders : [];
  };

  const addOrder = (order) => {
    const orders = getOrders();
    const record = {
      id: order.id || (window.TN ? window.TN.randomCode('TN') : `TN-${Date.now()}`),
      perfumeId: order.perfumeId,
      perfumeTitle: order.perfumeTitle,
      volume: order.volume,
      price: Number(order.price) || 0,
      name: order.name,
      phone: order.phone,
      email: order.email || '',
      comment: order.comment || '',
      createdAt: new Date().toISOString(),
    };
    orders.unshift(record);
    write(KEYS.orders, orders);
    return record;
  };

  const getBookings = () => {
    const bookings = read(KEYS.bookings, []);
    return Array.isArray(bookings) ? bookings : [];
  };

  const addBooking = (booking) => {
    const bookings = getBookings();
    const record = {
      id: booking.id || (window.TN ? window.TN.randomCode('TN') : `TN-${Date.now()}`),
      programId: booking.programId,
      programTitle: booking.programTitle,
      date: booking.date,
      time: booking.time,
      participants: Number(booking.participants) || 1,
      total: Number(booking.total) || 0,
      name: booking.name,
      phone: booking.phone,
      email: booking.email || '',
      comment: booking.comment || '',
      createdAt: new Date().toISOString(),
      cancelled: false,
    };
    bookings.unshift(record);
    write(KEYS.bookings, bookings);
    return record;
  };

  const cancelBooking = (id) => {
    const bookings = getBookings();
    const target = bookings.find((item) => item.id === id);
    if (!target) return false;
    target.cancelled = true;
    write(KEYS.bookings, bookings);
    return true;
  };

  const getBookingStatus = (booking) => {
    if (booking.cancelled) return 'cancelled';
    if (!booking.date || !booking.time) return 'upcoming';
    const start = new Date(`${booking.date}T${booking.time}:00`);
    const program = window.TN && window.TN.programs[booking.programId];
    const duration = program ? program.duration : 90;
    const end = new Date(start.getTime() + duration * 60000);
    return end.getTime() < Date.now() ? 'done' : 'upcoming';
  };

  const getReviews = (perfumeId) => {
    const userReviews = read(KEYS.reviews, []);
    const safeUser = Array.isArray(userReviews) ? userReviews : [];
    const all = seedReviews.concat(safeUser);
    const filtered = perfumeId ? all.filter((review) => review.perfumeId === perfumeId) : all;
    return filtered.slice().sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date).getTime();
      const dateB = new Date(b.createdAt || b.date).getTime();
      return dateB - dateA;
    });
  };

  const addReview = (review) => {
    const userReviews = read(KEYS.reviews, []);
    const safeUser = Array.isArray(userReviews) ? userReviews : [];
    const record = {
      id: `u-${Date.now()}`,
      perfumeId: review.perfumeId,
      name: review.name,
      rating: Number(review.rating) || 5,
      verified: false,
      date: (window.TN ? window.TN.todayISO() : new Date().toISOString().slice(0, 10)),
      createdAt: new Date().toISOString(),
      text: review.text,
    };
    safeUser.unshift(record);
    write(KEYS.reviews, safeUser);
    return record;
  };

  const getRating = (perfumeId) => {
    const reviews = getReviews(perfumeId);
    if (!reviews.length) {
      return { average: 0, count: 0, distribution: [0, 0, 0, 0, 0] };
    }
    const distribution = [0, 0, 0, 0, 0];
    let sum = 0;
    reviews.forEach((review) => {
      const rating = Math.max(1, Math.min(5, Number(review.rating) || 5));
      distribution[rating - 1] += 1;
      sum += rating;
    });
    return {
      average: Math.round((sum / reviews.length) * 10) / 10,
      count: reviews.length,
      distribution,
    };
  };

  const getBonusPoints = () => {
    const orders = getOrders();
    const bookings = getBookings().filter((booking) => !booking.cancelled);
    const ordersSum = orders.reduce((sum, order) => sum + (Number(order.price) || 0), 0);
    const bookingsSum = bookings.reduce((sum, booking) => sum + (Number(booking.total) || 0), 0);
    return Math.floor((ordersSum + bookingsSum) * 0.05);
  };

  const getStats = () => {
    const orders = getOrders();
    const bookings = getBookings();
    return {
      orders: orders.length,
      bookings: bookings.filter((booking) => getBookingStatus(booking) === 'upcoming').length,
      bonuses: getBonusPoints(),
    };
  };

  window.TNStore = {
    KEYS,
    getProfile,
    saveProfile,
    clearProfile,
    getOrders,
    addOrder,
    getBookings,
    addBooking,
    cancelBooking,
    getBookingStatus,
    getReviews,
    addReview,
    getRating,
    getBonusPoints,
    getStats,
  };
})();
