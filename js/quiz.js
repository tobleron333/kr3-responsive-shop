/* ==========================================================================
   Подбор аромата: четыре шага, прогресс-бар, рекомендация и альтернативы.
   ========================================================================== */
(function () {
  'use strict';

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const questions = [
    {
      id: 'occasion',
      title: 'Для какого момента выбираете аромат?',
      options: [
        { value: 'daily', title: 'На каждый день', desc: 'Комфортный и ненавязчивый', explain: 'на каждый день' },
        { value: 'office', title: 'Для работы', desc: 'Сдержанный, чтобы не мешать', explain: 'для работы и встреч' },
        { value: 'evening', title: 'Для вечера', desc: 'Свидание или ужин', explain: 'для вечера' },
        { value: 'special', title: 'Для особого случая', desc: 'Хочется запомниться', explain: 'для особого случая' },
      ],
    },
    {
      id: 'mood',
      title: 'Какое настроение вам ближе?',
      options: [
        { value: 'calm', title: 'Тишина и покой', desc: 'Мягкие, пудровые ноты', explain: 'тишины и покоя' },
        { value: 'bright', title: 'Свежесть и энергия', desc: 'Цитрус, зелень, воздух', explain: 'свежести и энергии' },
        { value: 'mystery', title: 'Загадка и глубина', desc: 'Смолы, кожа, специи', explain: 'загадки и глубины' },
        { value: 'warm', title: 'Тепло и уют', desc: 'Мёд, дерево, амбра', explain: 'тепла и уюта' },
      ],
    },
    {
      id: 'family',
      title: 'Какие ноты вам нравятся?',
      options: [
        { value: 'woody', title: 'Дерево и смолы', desc: 'Кедр, сандал, ладан', explain: 'древесные ноты' },
        { value: 'floral', title: 'Цветы и пудра', desc: 'Роза, ирис, ромашка', explain: 'цветочные ноты' },
        { value: 'citrus', title: 'Цитрус и травы', desc: 'Мандарин, бергамот, чай', explain: 'цитрусовые ноты' },
        { value: 'gourmand', title: 'Мёд и ваниль', desc: 'Тёплые гурманские аккорды', explain: 'гурманские ноты' },
        { value: 'chypre', title: 'Мох и кожа', desc: 'Шипровые, взрослые ароматы', explain: 'шипровые ноты' },
      ],
    },
    {
      id: 'intensity',
      title: 'Насколько заметным должен быть аромат?',
      options: [
        { value: 'light', title: 'Едва уловимый', desc: 'Слышно только близко', explain: 'лёгкий шлейф' },
        { value: 'medium', title: 'Умеренный', desc: 'Заметен, но не громкий', explain: 'умеренный шлейф' },
        { value: 'rich', title: 'Насыщенный', desc: 'Оставляет след в комнате', explain: 'насыщенный шлейф' },
      ],
    },
  ];

  const starMarkup = (average) => {
    const percent = Math.max(0, Math.min(100, (average / 5) * 100));
    return `<span class="stars" aria-hidden="true"><span class="stars__fill" style="width:${percent}%"></span></span>`;
  };

  const init = () => {
    const stepsBox = qs('#quizSteps');
    if (!stepsBox || !window.TN || !window.TNStore) return;

    const progressFill = qs('#quizProgressFill');
    const counter = qs('#quizCounter');
    const backButton = qs('#quizBack');
    const nextButton = qs('#quizNext');
    const navBox = qs('#quizNav');
    const resultBox = qs('#quizResult');
    const resultCard = qs('#quizResultCard');
    const alternativesBox = qs('#quizAlternatives');
    const restartButton = qs('#quizRestart');

    const answers = {};
    let stepIndex = 0;

    stepsBox.innerHTML = questions
      .map((question, index) => `
        <fieldset class="quiz-step${index === 0 ? ' is-active' : ''}" data-step="${index}">
          <legend class="visually-hidden">${question.title}</legend>
          <h2 class="quiz-question">${question.title}</h2>
          <div class="quiz-options">
            ${question.options.map((option) => `
              <label class="quiz-option">
                <input type="radio" name="q-${question.id}" value="${option.value}">
                <span class="quiz-option__dot" aria-hidden="true"></span>
                <span class="quiz-option__text">
                  <strong>${option.title}</strong>
                  <small>${option.desc}</small>
                </span>
              </label>`).join('')}
          </div>
        </fieldset>`)
      .join('');

    const steps = qsa('.quiz-step', stepsBox);

    const updateControls = () => {
      const current = steps[stepIndex];
      const checked = current ? current.querySelector('input[type="radio"]:checked') : null;

      if (progressFill) {
        progressFill.style.width = `${((stepIndex + 1) / questions.length) * 100}%`;
      }
      if (counter) {
        counter.textContent = `Шаг ${stepIndex + 1} из ${questions.length}`;
      }
      if (nextButton) {
        nextButton.disabled = !checked;
        nextButton.textContent = stepIndex === questions.length - 1 ? 'Показать результат' : 'Далее';
      }
      if (backButton) {
        backButton.disabled = stepIndex === 0;
      }
    };

    const showStep = (index) => {
      stepIndex = index;
      steps.forEach((step, stepNumber) => {
        step.classList.toggle('is-active', stepNumber === index);
      });
      updateControls();
    };

    const calculate = () => {
      const scores = window.TN.perfumeOrder.map((id) => {
        const perfume = window.TN.perfumes[id];
        let score = 0;

        if (perfume.quiz.occasion.includes(answers.occasion)) score += 2;
        if (perfume.quiz.mood.includes(answers.mood)) score += 2;
        if (perfume.quiz.family === answers.family) score += 3;
        if (perfume.quiz.intensity === answers.intensity) score += 2;

        const rating = window.TNStore.getRating(id);
        return { id, score, rating: rating.average };
      });

      scores.sort((a, b) => b.score - a.score || b.rating - a.rating);
      return scores;
    };

    const optionTitle = (questionId, value) => {
      const question = questions.find((item) => item.id === questionId);
      const option = question ? question.options.find((item) => item.value === value) : null;
      return option || { title: '', explain: '' };
    };

    const renderResult = () => {
      const scores = calculate();
      const bestId = scores[0].id;
      const best = window.TN.perfumes[bestId];
      const rating = window.TNStore.getRating(bestId);

      const occasion = optionTitle('occasion', answers.occasion);
      const mood = optionTitle('mood', answers.mood);
      const family = optionTitle('family', answers.family);
      const intensity = optionTitle('intensity', answers.intensity);

      const why = `Вам подходят ${family.explain}, ${mood.explain} и ${intensity.explain} — ${occasion.explain}. «${best.title}» звучит как ${best.subtitle.charAt(0).toLowerCase()}${best.subtitle.slice(1)}`;

      if (resultCard) {
        resultCard.innerHTML = `
          <div class="quiz-result__media">
            <img src="${best.image}" alt="Аромат «${best.title}»" width="400" height="500">
          </div>
          <div class="quiz-result__body">
            <p class="product-card__family">${best.familyLabel} · ${best.intensityLabel} · ${best.seasonLabel}</p>
            <h2>${best.title}</h2>
            <div class="rating">
              ${starMarkup(rating.average)}
              <span class="rating__count">${rating.count ? `${String(rating.average).replace('.', ',')} · ${rating.count} ${window.TN.plural(rating.count, 'отзыв', 'отзыва', 'отзывов')}` : 'Пока нет отзывов'}</span>
            </div>
            <p class="quiz-result__why">${why}</p>
            <p class="product-price">${window.TN.formatPrice(best.price)} <small>/ 50 мл</small></p>
            <div class="quiz-result__actions">
              <a class="btn btn-primary" href="product.html?id=${bestId}">Купить аромат</a>
              <a class="btn btn-outline-primary" href="order.html?program=signature">Записаться на мастер-класс</a>
            </div>
          </div>`;
      }

      if (alternativesBox) {
        const alternatives = scores.slice(1, 3).map(({ id }) => window.TN.perfumes[id] ? id : null).filter(Boolean);
        alternativesBox.innerHTML = alternatives
          .map((id) => {
            const perfume = window.TN.perfumes[id];
            return `
              <a class="quiz-alt" href="product.html?id=${id}">
                <img src="${perfume.image}" alt="${perfume.title}" width="74" height="92" loading="lazy">
                <div>
                  <h4>${perfume.title}</h4>
                  <p>${perfume.familyLabel} · ${perfume.intensityLabel}</p>
                </div>
              </a>`;
          })
          .join('');
      }

      stepsBox.hidden = true;
      if (resultBox) resultBox.classList.add('is-active');
      if (progressFill) progressFill.style.width = '100%';
      if (counter) counter.textContent = 'Готово';
      if (navBox) navBox.hidden = true;

      if (resultBox) {
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    const resetQuiz = () => {
      Object.keys(answers).forEach((key) => delete answers[key]);
      qsa('input[type="radio"]', stepsBox).forEach((input) => {
        input.checked = false;
      });
      stepsBox.hidden = false;
      if (resultBox) resultBox.classList.remove('is-active');
      if (navBox) navBox.hidden = false;
      if (progressFill) progressFill.style.width = '';
      showStep(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        const current = steps[stepIndex];
        const checked = current ? current.querySelector('input[type="radio"]:checked') : null;
        if (!checked) return;

        answers[questions[stepIndex].id] = checked.value;

        if (stepIndex === questions.length - 1) {
          renderResult();
        } else {
          showStep(stepIndex + 1);
        }
      });
    }

    if (backButton) {
      backButton.addEventListener('click', () => {
        if (stepIndex > 0) showStep(stepIndex - 1);
      });
    }

    stepsBox.addEventListener('change', (event) => {
      if (event.target.matches('input[type="radio"]')) {
        updateControls();
      }
    });

    if (restartButton) {
      restartButton.addEventListener('click', (event) => {
        event.preventDefault();
        resetQuiz();
      });
    }

    updateControls();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
