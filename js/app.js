// ===== App: State, Routing, Event Handling, Rendering =====

// ===== State =====

const state = {
  screen: 'welcome',
  lang: 'zh',
  spread: null,
  answers: [null, null, null, null, null],
  currentStep: 0,
  reading: null,
  history: [],
  transitioning: false,
};

// ===== DOM References =====

const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);

// ===== Starfield Canvas =====

function initStarfield() {
  const canvas = $('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let embers = [];
  let animId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars(count = 200) {
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        a: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.005 + 0.002,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  function spawnEmber() {
    embers.push({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 60,
      r: Math.random() * 2 + 0.8,
      speed: Math.random() * 0.4 + 0.08,
      drift: Math.random() * 0.4 - 0.2,
      opacity: Math.random() * 0.45 + 0.15,
      phase: Math.random() * Math.PI * 2,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const now = Date.now() * 0.001;

    // Draw twinkling stars
    for (const s of stars) {
      const flicker = Math.sin(now * s.speed * 10 + s.phase) * 0.3 + 0.7;
      const alpha = s.a * flicker;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245, 230, 208, ${alpha})`;
      ctx.fill();
    }

    // Maintain ember count
    const maxEmbers = window.innerWidth < 480 ? 6 : 12;
    if (embers.length < maxEmbers && Math.random() < 0.08) spawnEmber();

    // Draw & update rising gold embers
    for (let i = embers.length - 1; i >= 0; i--) {
      const e = embers[i];
      e.y -= e.speed;
      e.x += Math.sin(now * 0.5 + e.phase) * e.drift;
      e.opacity -= 0.002;

      if (e.opacity <= 0 || e.y < -20) {
        embers.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 3);
      grad.addColorStop(0, `rgba(255, 210, 160, ${e.opacity})`);
      grad.addColorStop(0.4, `rgba(212, 165, 116, ${e.opacity * 0.5})`);
      grad.addColorStop(1, `rgba(212, 165, 116, 0)`);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
    createStars();
  });

  resize();
  createStars();
  draw();

  return () => cancelAnimationFrame(animId);
}

// ===== SVG Card Back Generator =====
// Card front generator is in card-art.js (loaded after app.js to override)

function generateCardBackSVG() {
  return `<svg viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="backBg" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stop-color="#2a1010"/>
        <stop offset="100%" stop-color="#1a0808"/>
      </radialGradient>
    </defs>
    <rect width="24" height="36" rx="1.5" fill="url(#backBg)" stroke="#b8864e" stroke-width="0.35"/>
    <rect x="1" y="1" width="22" height="34" rx="1" fill="none" stroke="#b8864e" stroke-width="0.12" opacity="0.5"/>
    <rect x="2.5" y="2.5" width="19" height="31" fill="none" stroke="#b8864e" stroke-width="0.08" opacity="0.25"/>
    <path d="M3 3 L4.5 3 L4.5 4.5" fill="none" stroke="#b8864e" stroke-width="0.25" opacity="0.6" stroke-linecap="round"/>
    <path d="M21 3 L19.5 3 L19.5 4.5" fill="none" stroke="#b8864e" stroke-width="0.25" opacity="0.6" stroke-linecap="round"/>
    <path d="M3 33 L4.5 33 L4.5 31.5" fill="none" stroke="#b8864e" stroke-width="0.25" opacity="0.6" stroke-linecap="round"/>
    <path d="M21 33 L19.5 33 L19.5 31.5" fill="none" stroke="#b8864e" stroke-width="0.25" opacity="0.6" stroke-linecap="round"/>
    <circle cx="12" cy="18" r="7" fill="none" stroke="#b8864e" stroke-width="0.2" opacity="0.35"/>
    <circle cx="12" cy="18" r="5" fill="none" stroke="#b8864e" stroke-width="0.15" opacity="0.25"/>
    <circle cx="12" cy="18" r="3" fill="none" stroke="#b8864e" stroke-width="0.1" opacity="0.2"/>
    <path d="M12 10 L13 17 L20 18 L13 19 L12 26 L11 19 L4 18 L11 17 Z" fill="none" stroke="#b8864e" stroke-width="0.2" opacity="0.35"/>
    <path d="M12 16 L14 18 L12 20 L10 18 Z" fill="#b8864e" opacity="0.15"/>
    <circle cx="12" cy="18" r="0.6" fill="#b8864e" opacity="0.4"/>
  </svg>`;
}

// ===== Screen Navigation =====

function goToScreen(screenId) {
  if (state.transitioning || state.screen === screenId) return;
  state.transitioning = true;

  const current = $(`screen-${state.screen}`);
  const next = $(`screen-${screenId}`);

  if (current) {
    current.classList.remove('active');
    current.style.animation = 'none';
    void current.offsetHeight; // reflow
  }

  state.screen = screenId;
  next.classList.add('active');
  next.style.animation = 'fadeIn 0.5s ease forwards';

  // Nav visibility
  const nav = $('nav');
  const hideNav = ['welcome', 'language'];
  nav.classList.toggle('hidden', hideNav.includes(screenId));

  setTimeout(() => {
    state.transitioning = false;
  }, 500);
}

// ===== Language =====

function setLang(lang) {
  state.lang = lang;
  applyLanguage();
  updateLangButton();
}

function applyLanguage() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const text = t(key, state.lang);
    if (text !== key) {
      el.textContent = text;
    }
  });
}

function updateLangButton() {
  const btn = $('langToggle');
  btn.textContent = state.lang === 'zh' ? 'EN' : '中文';
}

// ===== Render: Welcome =====

function renderWelcome() {
  // Already has static content, just ensure i18n applied
  applyLanguage();
}

// ===== Render: Language =====

function renderLanguage() {
  applyLanguage();
  document.querySelectorAll('.card-lang').forEach(el => {
    el.onclick = () => {
      setLang(el.dataset.lang);
      goToScreen('spread');
      renderSpread();
    };
  });
}

// ===== Render: Spread =====

function renderSpread() {
  applyLanguage();
  document.querySelectorAll('.card-spread').forEach(el => {
    el.onclick = () => {
      state.spread = el.dataset.spread;
      state.answers = [null, null, null, null, null];
      state.currentStep = 0;
      goToScreen('wizard');
      renderWizard();
    };
  });
}

// ===== Render: Wizard =====

function renderWizard() {
  const total = QUESTIONS.length;
  const step = state.currentStep;
  const q = QUESTIONS[step];

  // Progress
  $('stepCurrent').textContent = step + 1;
  $('stepTotal').textContent = total;
  $('progressFill').style.width = `${((step + 1) / total) * 100}%`;

  // Question
  $('questionText').textContent = state.lang === 'zh' ? q.questionZh : q.questionEn;

  // Options
  const optsContainer = $('wizardOptions');
  optsContainer.innerHTML = '';
  q.options.forEach((opt, i) => {
    const div = document.createElement('div');
    div.className = 'card-option' + (state.answers[step] === opt.id ? ' selected' : '');
    div.dataset.optId = opt.id;
    div.innerHTML = `
      <span class="option-label">${String.fromCharCode(65 + i)}</span>
      <span class="option-text">${state.lang === 'zh' ? opt.textZh : opt.textEn}</span>
    `;
    div.onclick = () => {
      state.answers[step] = opt.id;
      optsContainer.querySelectorAll('.card-option').forEach(c => c.classList.remove('selected'));
      div.classList.add('selected');
    };
    optsContainer.appendChild(div);
  });

  // Nav buttons
  const prevBtn = $('btnWizardPrev');
  const nextBtn = $('btnWizardNext');

  prevBtn.disabled = step === 0;
  prevBtn.style.opacity = step === 0 ? '0.3' : '1';
  prevBtn.onclick = () => {
    if (step > 0) {
      state.currentStep--;
      renderWizard();
    }
  };

  const isLast = step === total - 1;
  const isFirst = step === 0;

  nextBtn.textContent = isLast
    ? t(isFirst ? 'wizard.start' : 'wizard.start', state.lang)
    : t('wizard.next', state.lang);

  nextBtn.onclick = () => {
    if (state.answers[step] === null) return; // Must select

    if (isLast) {
      // All answered - begin reading!
      state.reading = null;
      goToScreen('shuffle');
      startShuffleAnimation();
    } else {
      state.currentStep++;
      renderWizard();
    }
  };

  applyLanguage();
}

// ===== Shuffle Animation =====

function startShuffleAnimation() {
  applyLanguage();

  const deck = $('shuffleDeck');
  deck.innerHTML = '';
  const cards = [];

  // Fewer cards on mobile for performance
  const isMobile = window.innerWidth < 480;
  const cardCount = isMobile ? 12 : 24;

  // Create shuffle cards
  for (let i = 0; i < cardCount; i++) {
    const div = document.createElement('div');
    div.className = 'shuffle-card';
    div.innerHTML = `<div class="shuffle-card-inner">✧</div>`;
    div.style.zIndex = i;
    div.style.left = `${Math.random() * 20 - 10}px`;
    div.style.top = `${Math.random() * 20 - 10}px`;
    div.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
    deck.appendChild(div);
    cards.push(div);
  }

  // Animate cards flying
  cards.forEach((c, i) => {
    const angle = Math.random() * Math.PI * 2;
    const dist = isMobile ? 40 + Math.random() * 60 : 80 + Math.random() * 120;
    const dur = isMobile ? 0.5 + Math.random() * 0.3 : 0.8 + Math.random() * 0.6;
    c.style.setProperty('--fx', `${Math.cos(angle) * dist}px`);
    c.style.setProperty('--fy', `${Math.sin(angle) * dist}px`);
    c.style.setProperty('--fr', `${Math.random() * 360 - 180}deg`);
    c.style.opacity = '1';
    c.style.animation = `shuffleFly ${dur}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
    c.style.animationDelay = `${i * (isMobile ? 0.03 : 0.04)}s`;
  });

  // After animation, draw cards — faster on mobile
  const delay = isMobile ? 2000 : 3200;
  setTimeout(() => {
    // Generate the reading
    const drawn = drawCards(state.spread, state.answers);
    state.reading = {
      id: generateId(),
      date: new Date().toISOString(),
      lang: state.lang,
      spread: state.spread,
      answers: [...state.answers],
      cards: drawn,
    };

    goToScreen('draw');
    startDrawAnimation();
  }, delay);
}

// ===== Draw Animation =====

function startDrawAnimation() {
  applyLanguage();
  const slots = $('drawSlots');
  slots.innerHTML = '';

  const spread = SPREADS[state.spread];
  if (!spread) return;

  // Mobile: faster animation
  const isMobile = window.innerWidth < 480;
  const flyDelay = isMobile ? 200 : 400;
  const flipStart = isMobile ? 600 : 1200;
  const flipStagger = isMobile ? 300 : 600;
  const totalDelay = isMobile ? 2200 : 4000;

  // Create 3 card slots with face-down cards
  state.reading.cards.forEach((draw, i) => {
    const slot = document.createElement('div');
    slot.className = 'tarot-card-slot';
    slot.style.opacity = '0';

    const pos = spread.positions[i];

    const cardEl = document.createElement('div');
    cardEl.className = 'tarot-card';
    cardEl.style.margin = '0 auto';

    const inner = document.createElement('div');
    inner.className = 'tarot-card-inner';

    // Card back
    const back = document.createElement('div');
    back.className = 'tarot-card-face tarot-card-back';
    back.innerHTML = generateCardBackSVG();

    // Card front
    const front = document.createElement('div');
    front.className = 'tarot-card-face tarot-card-front';
    front.innerHTML = generateCardFrontSVG(draw.card, state.lang);

    inner.appendChild(back);
    inner.appendChild(front);
    cardEl.appendChild(inner);

    // Position label
    const label = document.createElement('div');
    label.className = 'tarot-card-position';
    label.innerHTML = `
      <div class="position-label">${state.lang === 'zh' ? pos.nameZh : pos.nameEn}</div>
      <div class="position-desc" style="font-size:0.8rem;color:var(--color-text-dim);margin-top:2px">${state.lang === 'zh' ? pos.descZh : pos.descEn}</div>
    `;

    slot.appendChild(cardEl);
    slot.appendChild(label);
    slots.appendChild(slot);

    // Staggered fly-in
    setTimeout(() => {
      slot.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      slot.style.opacity = '1';
      slot.style.transform = 'translateY(0)';
    }, i * flyDelay);

    // Staggered flip after all cards are in
    setTimeout(() => {
      cardEl.classList.add('flipped');
    }, flipStart + i * flipStagger);
  });

  // After all flips, go to result
  setTimeout(() => {
    goToScreen('result');
    renderResult();
  }, totalDelay);
}

// ===== Render: Result =====

function renderResult() {
  const reading = state.reading;
  if (!reading) return;

  applyLanguage();

  const container = $('resultCards');
  container.innerHTML = '';

  const spread = SPREADS[reading.spread];

  reading.cards.forEach((draw, i) => {
    const card = draw.card;
    const pos = spread.positions[i];
    const isRev = draw.reversed;

    const item = document.createElement('div');
    item.className = 'result-card-item';

    // Card
    const cardEl = document.createElement('div');
    cardEl.className = 'tarot-card flipped';
    cardEl.style.margin = '0 auto';
    const inner = document.createElement('div');
    inner.className = 'tarot-card-inner';

    const back = document.createElement('div');
    back.className = 'tarot-card-face tarot-card-back';
    back.innerHTML = generateCardBackSVG();

    const front = document.createElement('div');
    front.className = 'tarot-card-face tarot-card-front';
    front.innerHTML = generateCardFrontSVG(card, reading.lang);

    inner.appendChild(back);
    inner.appendChild(front);
    cardEl.appendChild(inner);
    item.appendChild(cardEl);

    // Interpretation
    const interp = document.createElement('div');
    interp.className = 'interp-text';
    const kw = (reading.lang === 'zh' ? card.keywordsZh : card.keywordsEn).join(', ');
    const meaning = isRev
      ? (reading.lang === 'zh' ? card.revZh : card.revEn)
      : (reading.lang === 'zh' ? card.upZh : card.upEn);

    interp.innerHTML = `
      <div class="tarot-card-position">
        <div class="position-label">${reading.lang === 'zh' ? pos.nameZh : pos.nameEn}</div>
        <div style="font-size:0.8rem;color:var(--color-text-dim);margin-top:2px">${reading.lang === 'zh' ? pos.descZh : pos.descEn}</div>
      </div>
      <div class="interp-orientation ${isRev ? 'reversed' : ''}">${isRev ? t('result.reversed', reading.lang) : t('result.upright', reading.lang)}</div>
      <div class="interp-card-name">${reading.lang === 'zh' ? card.nameZh : card.nameEn}</div>
      <div class="interp-keywords">${kw}</div>
      <div class="interp-meaning">${meaning}</div>
    `;

    item.appendChild(interp);
    container.appendChild(item);

    // Reveal with stagger
    setTimeout(() => item.classList.add('visible'), i * 200);
  });

  // Summary
  const summary = $('resultSummary');
  summary.classList.remove('visible');
  setTimeout(() => {
    summary.innerHTML = `
      <h3>${t('result.summary', reading.lang)}</h3>
      <p>${t('result.summaryText', reading.lang)}</p>
    `;
    summary.classList.add('visible');
  }, 800);

  // Action buttons
  const saveBtn = $('btnSave');
  const downloadBtn = $('btnDownload');

  // Disable download if html2canvas not loaded
  if (typeof html2canvas === 'undefined') {
    downloadBtn.style.display = 'none';
  } else {
    downloadBtn.style.display = '';
  }

  // Check if already saved
  const history = getHistory();
  const alreadySaved = history.some(h => h.id === reading.id);
  saveBtn.textContent = alreadySaved ? `✓ ${t('result.saved', reading.lang)}` : t('result.save', reading.lang);
  saveBtn.disabled = alreadySaved;

  saveBtn.onclick = () => {
    if (saveBtn.disabled) return;
    const ok = saveReading(reading);
    if (ok) {
      saveBtn.textContent = `✓ ${t('result.saved', reading.lang)}`;
      saveBtn.disabled = true;
      state.history = getHistory();
    } else {
      alert(t('error.storage', reading.lang));
    }
  };

  downloadBtn.onclick = async () => {
    try {
      downloadBtn.disabled = true;
      downloadBtn.textContent = '⏳';
      await exportImage('resultContainer', `tarot-${reading.id}.png`);
      downloadBtn.disabled = false;
      downloadBtn.textContent = t('result.download', reading.lang);
    } catch (e) {
      alert(t('error.image', reading.lang));
      downloadBtn.disabled = false;
      downloadBtn.textContent = t('result.download', reading.lang);
    }
  };

  $('btnNew').onclick = () => {
    state.reading = null;
    state.spread = null;
    state.answers = [null, null, null, null, null];
    state.currentStep = 0;
    goToScreen('welcome');
    renderWelcome();
  };
}

// ===== Render: History =====

function renderHistory() {
  applyLanguage();
  const history = getHistory();
  state.history = history;

  const list = $('historyList');
  const empty = $('historyEmpty');

  if (history.length === 0) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');
  list.innerHTML = '';

  history.forEach((h, idx) => {
    const spread = SPREADS[h.spread];
    const spreadName = h.lang === 'zh' ? spread.nameZh : spread.nameEn;
    const date = new Date(h.date);
    const dateStr = date.toLocaleDateString(h.lang === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    const item = document.createElement('div');
    item.className = 'history-item';

    item.innerHTML = `
      <div class="history-item-info">
        <h4>${spreadName}</h4>
        <p>${dateStr}</p>
      </div>
      <div class="history-item-cards">
        ${h.cards.map(d => {
          const c = CARDS.find(c => c.id === d.card.id);
          return `<div class="history-card-mini" title="${c ? (h.lang === 'zh' ? c.nameZh : c.nameEn) : ''}">${c ? (h.lang === 'zh' ? c.nameZh[0] : c.nameEn[0]) : '?'}</div>`;
        }).join('')}
      </div>
    `;

    item.onclick = () => showHistoryDetail(h);
    item.style.animationDelay = `${idx * 0.05}s`;
    setTimeout(() => item.classList.add('visible'), 10);

    list.appendChild(item);
  });
}

// ===== History Detail Modal =====

function showHistoryDetail(reading) {
  const overlay = $('modalOverlay');
  const body = $('modalBody');
  const spread = SPREADS[reading.spread];

  let html = `<div class="result-container" style="max-width:100%">`;
  html += `<h2 class="section-title" style="margin-bottom:var(--space-lg)">${reading.lang === 'zh' ? '占卜详情' : 'Reading Detail'}</h2>`;

  html += `<div style="text-align:center;margin-bottom:var(--space-lg);color:var(--color-text-muted);font-size:0.9rem">`;
  html += `${spread.nameZh} · ${new Date(reading.date).toLocaleDateString()}</div>`;

  html += `<div class="result-cards">`;

  reading.cards.forEach((d, i) => {
    const card = CARDS.find(c => c.id === d.card.id);
    if (!card) return;
    const pos = spread.positions[i];
    const isRev = d.reversed;
    const kw = (reading.lang === 'zh' ? card.keywordsZh : card.keywordsEn).join(', ');
    const meaning = isRev
      ? (reading.lang === 'zh' ? card.revZh : card.revEn)
      : (reading.lang === 'zh' ? card.upZh : card.upEn);

    html += `<div class="result-card-item visible">`;
    html += `<div class="tarot-card flipped" style="margin:0 auto;pointer-events:none">`;
    html += `<div class="tarot-card-inner">`;
    html += `<div class="tarot-card-face tarot-card-back">${generateCardBackSVG()}</div>`;
    html += `<div class="tarot-card-face tarot-card-front">${generateCardFrontSVG(card, reading.lang)}</div>`;
    html += `</div></div>`;
    html += `<div class="interp-text" style="text-align:center;max-width:240px">`;
    html += `<div class="tarot-card-position"><div class="position-label">${reading.lang === 'zh' ? pos.nameZh : pos.nameEn}</div></div>`;
    html += `<div class="interp-orientation ${isRev ? 'reversed' : ''}">${isRev ? 'Reversed' : 'Upright'}</div>`;
    html += `<div class="interp-card-name">${reading.lang === 'zh' ? card.nameZh : card.nameEn}</div>`;
    html += `<div class="interp-keywords">${kw}</div>`;
    html += `<div class="interp-meaning">${meaning}</div>`;
    html += `</div></div>`;
  });

  html += `</div>`;

  // Delete button
  html += `<div style="text-align:center;margin-top:var(--space-lg)">`;
  html += `<button class="btn btn-outline" id="btnDeleteHistory">${t('history.delete', reading.lang)}</button>`;
  html += `</div></div>`;

  body.innerHTML = html;
  overlay.classList.remove('hidden');

  // Delete handler
  document.getElementById('btnDeleteHistory').onclick = () => {
    deleteReading(reading.id);
    overlay.classList.add('hidden');
    renderHistory();
  };
}

// ===== Event Binding =====

function bindEvents() {
  // Welcome start
  $('btnStart').onclick = () => {
    goToScreen('language');
    renderLanguage();
  };

  // Language toggle in nav
  $('langToggle').onclick = () => {
    setLang(state.lang === 'zh' ? 'en' : 'zh');
    // Re-render current screen
    switch (state.screen) {
      case 'welcome': renderWelcome(); break;
      case 'language': renderLanguage(); break;
      case 'spread': renderSpread(); break;
      case 'wizard': renderWizard(); break;
      case 'result': renderResult(); break;
      case 'history': renderHistory(); break;
      case 'shuffle': applyLanguage(); break;
      case 'draw': applyLanguage(); break;
    }
  };

  // Nav links (delegated)
  document.querySelectorAll('[data-screen]').forEach(el => {
    el.addEventListener('click', () => {
      const target = el.dataset.screen;
      if (target === 'history') {
        goToScreen('history');
        renderHistory();
      } else if (target === 'welcome') {
        state.spread = null;
        state.reading = null;
        goToScreen('welcome');
        renderWelcome();
      }
    });
  });

  // Modal close
  $('modalClose').onclick = () => {
    $('modalOverlay').classList.add('hidden');
  };
  $('modalOverlay').onclick = (e) => {
    if (e.target === $('modalOverlay')) {
      $('modalOverlay').classList.add('hidden');
    }
  };
}

// ===== Init =====

function init() {
  initStarfield();
  applyLanguage();
  updateLangButton();
  bindEvents();
  renderWelcome();
}

document.addEventListener('DOMContentLoaded', init);
