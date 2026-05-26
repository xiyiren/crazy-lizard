// ===== App: State, Routing, Event Handling, Rendering =====

import { t } from './i18n.js';
import { CARDS, SPREADS, QUESTIONS, SUITS } from './data.js';
import { drawCards, generateId } from './card-engine.js';
import { saveReading, getHistory, deleteReading, exportImage } from './storage.js';

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

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const now = Date.now() * 0.001;
    for (const s of stars) {
      const flicker = Math.sin(now * s.speed * 10 + s.phase) * 0.3 + 0.7;
      const alpha = s.a * flicker;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245, 230, 208, ${alpha})`;
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

// ===== SVG Card Generator =====

function getSuitSymbol(suit) {
  const symbols = {
    wands: `<path d="M10 28 L10 4 L12 2 L14 4 L14 28 Z M8 8 L16 8 M6 14 L18 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`,
    cups: `<path d="M12 6 C8 6 6 10 6 14 C6 20 10 24 12 26 C14 24 18 20 18 14 C18 10 16 6 12 6 Z M12 26 L12 30 M8 30 L16 30" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`,
    swords: `<path d="M12 2 L12 26 M8 8 L16 8 M6 14 L18 14 M10 20 L14 20 M10 26 L14 30" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`,
    pentacles: `<circle cx="12" cy="16" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 8 L13 14 L19 14 L14 18 L16 24 L12 20 L8 24 L10 18 L5 14 L11 14 Z" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>`,
  };
  return symbols[suit] || '';
}

function getMajorSymbol(rank) {
  const icons = [
    `<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 4 L12 12 L18 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`, // 0 Fool
    `<path d="M8 24 L12 8 L16 24 M6 16 L18 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`, // 1 Magician
    `<path d="M12 4 C6 4 4 12 4 20 L20 20 C20 12 18 4 12 4 Z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="14" r="3" fill="none" stroke="currentColor" stroke-width="1"/>`, // 2 High Priestess
    `<path d="M12 4 L12 20 M4 12 L20 12 M8 20 L8 28 M16 20 L16 28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" stroke-width="1"/>`, // 3 Empress
    `<path d="M8 6 L12 2 L16 6 L16 12 L8 12 Z M6 12 L18 12 L18 28 L6 28 Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>`, // 4 Emperor
    `<path d="M12 4 L12 28 M4 12 L20 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="16" r="4" fill="none" stroke="currentColor" stroke-width="1"/>`, // 5 Hierophant
    `<circle cx="8" cy="14" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="16" cy="14" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 19 C10 24 14 24 16 19" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`, // 6 Lovers
    `<path d="M6 24 L12 4 L18 24 Z M8 14 L16 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>`, // 7 Chariot
    `<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 6 L12 12 L16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`, // 8 Strength
    `<path d="M12 2 L12 12 M8 8 L12 12 L16 8 M4 18 C4 26 20 26 20 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`, // 9 Hermit
    `<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1"/><path d="M12 2 L12 4 M12 20 L12 22 M2 12 L4 12 M20 12 L22 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`, // 10 Wheel
    `<path d="M12 4 L12 28 M4 12 L8 12 M16 12 L20 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M8 8 L12 12 L8 16" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>`, // 11 Justice
    `<path d="M12 2 L12 16 M4 10 L12 16 L20 10 M8 22 L16 22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`, // 12 Hanged Man
    `<path d="M6 26 L12 4 L18 26 Z M4 14 L20 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>`, // 13 Death
    `<path d="M4 16 C4 8 20 8 20 16 M12 16 L12 28 M8 22 L16 22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`, // 14 Temperance
    `<path d="M12 4 L12 16 M6 10 L18 10 M4 18 L8 26 M20 18 L16 26 M6 22 L18 22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`, // 15 Devil
    `<path d="M12 2 L12 28 M4 8 L20 8 M4 14 L20 14 M4 20 L20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`, // 16 Tower
    `<path d="M12 4 L12 28 M4 12 L8 12 M16 12 L20 12 M8 8 L12 12 M16 8 L12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`, // 17 Star
    `<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 6 C8 6 6 12 12 18 C18 12 16 6 12 6" fill="none" stroke="currentColor" stroke-width="1"/>`, // 18 Moon
    `<circle cx="12" cy="10" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M6 18 C6 26 18 26 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M10 24 L14 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`, // 19 Sun
    `<path d="M12 2 L12 28 M4 8 L20 8 M4 14 L20 14 M4 20 L20 20 M4 26 L20 26" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`, // 20 Judgement
    `<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="1"/><path d="M12 2 L12 4 M12 20 L12 22 M2 12 L4 12 M20 12 L22 12 M5 5 L7 7 M17 17 L19 19 M5 19 L7 17 M17 7 L19 5" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>`, // 21 World
  ];
  return icons[rank] || `<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/>`;
}

function getRankDisplay(rank, arcana) {
  if (arcana === 'major') {
    const roman = ['O','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI'];
    return roman[rank] || rank;
  }
  const court = { 11: 'Page', 12: 'Knight', 13: 'Queen', 14: 'King' };
  return court[rank] || rank;
}

function generateCardFrontSVG(card, lang) {
  const isMajor = card.arcana === 'major';
  const name = lang === 'zh' ? card.nameZh : card.nameEn;
  const rankDisplay = isMajor ? getRankDisplay(card.rank, card.arcana) : getRankDisplay(card.rank, card.arcana);
  const color = isMajor ? '#D4A574' : (card.suit === 'wands' ? '#E06040' : card.suit === 'cups' ? '#4080C0' : card.suit === 'swords' ? '#C0C040' : '#60A060');

  const symbol = isMajor
    ? getMajorSymbol(card.rank)
    : getSuitSymbol(card.suit);

  const suitInitial = card.suit ? card.suit[0].toUpperCase() : '';

  return `<svg viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="36" rx="1.5" fill="url(#bg-${card.id})" stroke="${color}" stroke-width="0.3"/>
    <defs>
      <linearGradient id="bg-${card.id}" x1="0" y1="0" x2="24" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#1a1a2e"/>
        <stop offset="100%" stop-color="#2a1a1a"/>
      </linearGradient>
    </defs>
    <text x="1.5" y="3.5" font-size="2.5" fill="${color}" font-family="Cinzel,serif" font-weight="600">${isMajor ? '' : rankDisplay}</text>
    <text x="1.5" y="5.5" font-size="1.8" fill="${color}" opacity="0.6">${isMajor ? '' : suitInitial}</text>
    <g transform="translate(0, 6)" stroke="${color}">
      ${symbol}
    </g>
    <text x="12" y="33" font-size="1.5" fill="${color}" text-anchor="middle" font-family="Cinzel,serif" opacity="0.7">${isMajor ? rankDisplay : ''}</text>
  </svg>`;
}

function generateCardBackSVG() {
  return `<svg viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="36" rx="1.5" fill="#1a0a0a" stroke="#b8864e" stroke-width="0.3"/>
    <circle cx="12" cy="18" r="8" fill="none" stroke="#b8864e" stroke-width="0.4" opacity="0.6"/>
    <circle cx="12" cy="18" r="5" fill="none" stroke="#b8864e" stroke-width="0.3" opacity="0.4"/>
    <circle cx="12" cy="18" r="2" fill="#b8864e" opacity="0.3"/>
    <path d="M12 8 L14 14 L20 14 L15 18 L17 24 L12 20 L7 24 L9 18 L4 14 L10 14 Z" fill="none" stroke="#b8864e" stroke-width="0.3" opacity="0.4"/>
    <path d="M4 4 L8 4 M16 4 L20 4 M4 32 L8 32 M16 32 L20 32" stroke="#b8864e" stroke-width="0.3" opacity="0.3"/>
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

  // Create 24 shuffle cards
  for (let i = 0; i < 24; i++) {
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
    const dist = 80 + Math.random() * 120;
    const dur = 0.8 + Math.random() * 0.6;
    c.style.setProperty('--fx', `${Math.cos(angle) * dist}px`);
    c.style.setProperty('--fy', `${Math.sin(angle) * dist}px`);
    c.style.setProperty('--fr', `${Math.random() * 360 - 180}deg`);
    c.style.animation = `shuffleFly ${dur}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
    c.style.animationDelay = `${i * 0.04}s`;
  });

  // After animation, draw cards
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
  }, 3200);
}

// ===== Draw Animation =====

function startDrawAnimation() {
  applyLanguage();
  const slots = $('drawSlots');
  slots.innerHTML = '';

  const spread = SPREADS[state.spread];
  if (!spread) return;

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
    }, i * 400);

    // Staggered flip after all cards are in
    setTimeout(() => {
      cardEl.classList.add('flipped');
    }, 1200 + i * 600);
  });

  // After all flips, go to result
  setTimeout(() => {
    goToScreen('result');
    renderResult();
  }, 4000);
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
    cardEl.style.width = '180px';
    cardEl.style.height = '270px';

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
    html += `<div class="tarot-card flipped" style="margin:0 auto;width:160px;height:240px;pointer-events:none">`;
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
