// Dangus viršuje: žvaigždės išbarstomos atsitiktinai, kiekviena mirga savo ritmu.
(function () {
  const sky = document.querySelector('.sky');
  if (!sky) return;
  const count = window.innerWidth < 768 ? 45 : 90;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('span');
    const size = Math.random() < .85 ? 1 + Math.random() * 1.5 : 2.5 + Math.random();
    star.className = Math.random() < .2 ? 'star gold' : 'star';
    star.style.cssText =
      `left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:${size}px;height:${size}px;` +
      `--t:${(2.5 + Math.random() * 4).toFixed(2)}s;--d:${(-Math.random() * 6).toFixed(2)}s`;
    sky.appendChild(star);
  }
  // tik kelios spindi stipriau
  const bright = window.innerWidth < 768 ? 3 : 6;
  for (let i = 0; i < bright; i++) {
    const star = document.createElement('span');
    star.className = 'star bright';
    star.style.cssText =
      `left:${4 + Math.random() * 92}%;top:${4 + Math.random() * 88}%;width:3px;height:3px;` +
      `--t:${(4 + Math.random() * 3).toFixed(2)}s;--d:${(-Math.random() * 6).toFixed(2)}s`;
    sky.appendChild(star);
  }
})();

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
