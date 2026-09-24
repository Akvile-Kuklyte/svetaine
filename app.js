// Testas „Pattern or bad luck?“: vienas žingsnis ekrane, atsakymai lieka tik naršyklėje.
(function () {
  const quiz = document.querySelector('.quiz');
  const steps = [...quiz.querySelectorAll('.step')];
  const sentence = document.getElementById('sentence');
  const answers = [];
  let current = '0';

  function show(name, focus = true) {
    steps.forEach((s) => {
      const on = s.dataset.step === name;
      s.hidden = !on;
      s.classList.toggle('is-entering', on);
    });
    current = name;

    const text = sentence.value.trim();
    quiz.querySelectorAll('.your-sentence').forEach((q) => {
      q.hidden = !text;
      q.textContent = text;
    });

    if (focus) {
      const target = quiz.querySelector(`[data-step="${name}"] [tabindex="-1"]`);
      if (target) target.focus({ preventScroll: true });
      const top = quiz.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight * 0.6) {
        quiz.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      }
    }
  }

  quiz.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    if (btn.hasAttribute('data-next')) show('1');

    if (btn.dataset.answer) {
      const n = Number(current);
      answers[n - 1] = btn.dataset.answer === 'yes';
      if (n < 3) show(String(n + 1));
      else show(answers.filter(Boolean).length >= 2 ? 'pattern' : 'season');
    }

    if (btn.hasAttribute('data-back')) {
      const n = Number(current);
      show(n > 1 ? String(n - 1) : '0');
    }

    if (btn.hasAttribute('data-restart')) {
      answers.length = 0;
      show('0');
    }
  });

  // „Start the test“ nuveda prie testo ir padeda žymeklį į laukelį
  document.querySelector('[data-start]').addEventListener('click', () => {
    if (current === '0') setTimeout(() => sentence.focus({ preventScroll: true }), 450);
  });

  // Būsenų žymės: pasirenkama viena, tada parodomas patarimas iš gido
  const chips = [...document.querySelectorAll('.chip')];
  const notice = document.querySelector('.notice');
  chips.forEach((chip) => chip.addEventListener('click', () => {
    const wasOn = chip.getAttribute('aria-pressed') === 'true';
    chips.forEach((c) => c.setAttribute('aria-pressed', 'false'));
    chip.setAttribute('aria-pressed', String(!wasOn));
    const show = !wasOn;
    if (show && notice.hidden) {
      notice.hidden = false;
      notice.classList.add('is-entering');
    } else if (!show) {
      notice.hidden = true;
      notice.classList.remove('is-entering');
    }
  }));

})();
