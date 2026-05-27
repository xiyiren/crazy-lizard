// ===== Card Art System =====
// Illustrated tarot card faces with traditional-style scenes

const ROMAN_NUM = ['O','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI'];
const SUIT_COLORS = {
  major: '#D4A574',
  wands: '#E06040',
  cups: '#4080C0',
  swords: '#C0C040',
  pentacles: '#60A060',
};

function getSuitColor(suit) {
  return SUIT_COLORS[suit] || SUIT_COLORS.major;
}

// ===== Suit Symbols (for pips and decoration) =====

function getPipSymbol(suit, color, scale = 1) {
  const c = color;
  const s = scale;
  const paths = {
    wands: `<g stroke="${c}" stroke-width="${1.5*s}" stroke-linecap="round" fill="none">
      <path d="M${0*s},${18*s} L${0*s},${-8*s} L${3*s},${-12*s} L${6*s},${-8*s} L${6*s},${18*s}"/>
      <path d="M${-3*s},${-4*s} L${9*s},${-4*s}"/>
      <path d="M${-2*s},${2*s} L${8*s},${2*s}"/>
      <path d="M${-2*s},${6*s} L${8*s},${6*s}"/>
      <ellipse cx="${3*s}" cy="${-14*s}" rx="${3*s}" ry="${2*s}"/>
    </g>`,
    cups: `<g stroke="${c}" stroke-width="${1.5*s}" stroke-linecap="round" fill="none">
      <path d="M${0*s},${-4*s} C${-8*s},${-4*s} ${-8*s},${10*s} ${0*s},${14*s} C${8*s},${10*s} ${8*s},${-4*s} ${0*s},${-4*s} Z"/>
      <path d="M${-4*s},${14*s} L${4*s},${14*s}"/>
      <rect x="${-5*s}" y="${-10*s}" width="${10*s}" height="${6*s}" rx="${1*s}"/>
    </g>`,
    swords: `<g stroke="${c}" stroke-width="${1.5*s}" stroke-linecap="round" fill="none">
      <path d="M${0*s},${-16*s} L${0*s},${16*s}"/>
      <path d="M${-6*s},${-6*s} L${6*s},${-6*s}"/>
      <path d="M${-5*s},${0*s} L${5*s},${0*s}"/>
      <path d="M${-4*s},${6*s} L${4*s},${6*s}"/>
      <ellipse cx="${0*s}" cy="${-18*s}" rx="${4*s}" ry="${2.5*s}"/>
      <circle cx="${0*s}" cy="${18*s}" r="${2*s}"/>
    </g>`,
    pentacles: `<g fill="none" stroke="${c}" stroke-width="${1.5*s}">
      <circle cx="${0*s}" cy="${0*s}" r="${10*s}"/>
      <circle cx="${0*s}" cy="${0*s}" r="${6*s}" stroke-width="${1*s}"/>
      <path d="M${0*s},${-10*s} L${0*s},${10*s} M${-10*s},${0*s} L${10*s},${0*s}" stroke-width="${1*s}"/>
      <path d="M${-7*s},${-7*s} L${7*s},${7*s} M${-7*s},${7*s} L${7*s},${-7*s}" stroke-width="${0.8*s}"/>
    </g>`,
  };
  return paths[suit] || '';
}

// ===== Card Background Generator =====

function getCardBackground(card, color) {
  const isMajor = card.arcana === 'major';
  if (isMajor) {
    return `<defs>
      <radialGradient id="bg-${card.id}" cx="50%" cy="45%" r="60%">
        <stop offset="0%" stop-color="#1e1428"/>
        <stop offset="60%" stop-color="#140e1a"/>
        <stop offset="100%" stop-color="#0a060e"/>
      </radialGradient>
    </defs>
    <rect width="200" height="300" rx="12" fill="url(#bg-${card.id})"/>
    <rect x="4" y="4" width="192" height="292" rx="10" fill="none" stroke="${color}" stroke-width="0.8" opacity="0.3"/>
    <rect x="8" y="8" width="184" height="284" rx="6" fill="none" stroke="${color}" stroke-width="0.4" opacity="0.15"/>`;
  }
  // Minor arcana - suit themed backgrounds
  const suitBgs = {
    wands: `<defs>
      <linearGradient id="bg-${card.id}" x1="0" y1="0" x2="200" y2="300" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#1a0e08"/><stop offset="50%" stop-color="#140a06"/><stop offset="100%" stop-color="#0e0604"/>
      </linearGradient>
    </defs>
    <rect width="200" height="300" rx="12" fill="url(#bg-${card.id})"/>
    <rect x="4" y="4" width="192" height="292" rx="10" fill="none" stroke="${color}" stroke-width="0.8" opacity="0.25"/>
    <rect x="8" y="8" width="184" height="284" rx="6" fill="none" stroke="${color}" stroke-width="0.4" opacity="0.12"/>
    <path d="M0,60 Q100,40 200,60 M0,240 Q100,260 200,240" fill="none" stroke="${color}" stroke-width="0.5" opacity="0.06"/>`,
    cups: `<defs>
      <linearGradient id="bg-${card.id}" x1="0" y1="0" x2="200" y2="300" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#080e1a"/><stop offset="50%" stop-color="#060a14"/><stop offset="100%" stop-color="#04060e"/>
      </linearGradient>
    </defs>
    <rect width="200" height="300" rx="12" fill="url(#bg-${card.id})"/>
    <rect x="4" y="4" width="192" height="292" rx="10" fill="none" stroke="${color}" stroke-width="0.8" opacity="0.25"/>
    <rect x="8" y="8" width="184" height="284" rx="6" fill="none" stroke="${color}" stroke-width="0.4" opacity="0.12"/>
    <circle cx="100" cy="60" r="40" fill="none" stroke="${color}" stroke-width="0.3" opacity="0.05"/>
    <circle cx="100" cy="240" r="40" fill="none" stroke="${color}" stroke-width="0.3" opacity="0.05"/>`,
    swords: `<defs>
      <linearGradient id="bg-${card.id}" x1="0" y1="0" x2="200" y2="300" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#0e0e08"/><stop offset="50%" stop-color="#0a0a06"/><stop offset="100%" stop-color="#060604"/>
      </linearGradient>
    </defs>
    <rect width="200" height="300" rx="12" fill="url(#bg-${card.id})"/>
    <rect x="4" y="4" width="192" height="292" rx="10" fill="none" stroke="${color}" stroke-width="0.8" opacity="0.25"/>
    <rect x="8" y="8" width="184" height="284" rx="6" fill="none" stroke="${color}" stroke-width="0.4" opacity="0.12"/>
    <path d="M30,30 L170,270 M170,30 L30,270" fill="none" stroke="${color}" stroke-width="0.3" opacity="0.04"/>`,
    pentacles: `<defs>
      <linearGradient id="bg-${card.id}" x1="0" y1="0" x2="200" y2="300" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#0a1008"/><stop offset="50%" stop-color="#080c06"/><stop offset="100%" stop-color="#040604"/>
      </linearGradient>
    </defs>
    <rect width="200" height="300" rx="12" fill="url(#bg-${card.id})"/>
    <rect x="4" y="4" width="192" height="292" rx="10" fill="none" stroke="${color}" stroke-width="0.8" opacity="0.25"/>
    <rect x="8" y="8" width="184" height="284" rx="6" fill="none" stroke="${color}" stroke-width="0.4" opacity="0.12"/>
    <circle cx="100" cy="75" r="50" fill="none" stroke="${color}" stroke-width="0.3" opacity="0.04"/>
    <circle cx="100" cy="225" r="50" fill="none" stroke="${color}" stroke-width="0.3" opacity="0.04"/>`,
  };
  return suitBgs[card.suit] || suitBgs.wands;
}

// ===== Corner Rank/Suit Display =====

function getCornerDisplay(card, color) {
  const isMajor = card.arcana === 'major';
  if (isMajor) {
    return `<text x="16" y="32" font-size="18" fill="${color}" font-family="Cinzel,serif" font-weight="600" text-anchor="middle">${ROMAN_NUM[card.rank]}</text>`;
  }
  const rankStr = card.rank <= 10 ? card.rank : (['','Page','Knight','Queen','King'])[card.rank - 10];
  const suitLetter = card.suit[0].toUpperCase();
  const courtAbbr = card.rank === 11 ? 'PA' : card.rank === 12 ? 'KN' : card.rank === 13 ? 'QU' : 'KI';
  return `
    <text x="20" y="32" font-size="22" fill="${color}" font-family="Cinzel,serif" font-weight="600" text-anchor="middle">${rankStr}</text>
    <text x="20" y="50" font-size="14" fill="${color}" opacity="0.6" text-anchor="middle">${card.rank > 10 ? courtAbbr : suitLetter}</text>
  `;
}

// ===== Major Arcana Scene Illustrations =====
// Stylized geometric scenes capturing traditional tarot imagery

function getMajorArt(rank, color) {
  const c = color;
  const gold = '#D4A574';
  const glow = `rgba(212,165,116,0.15)`;

  const scenes = {
    // 0 The Fool - Figure at cliff edge, sun, small dog, knapsack
    0: `<g transform="translate(100,155)">
      <!-- Sky gradient -->
      <defs><linearGradient id="sky0" x1="0" y1="-80" x2="0" y2="80"><stop offset="0%" stop-color="${c}" stop-opacity="0.08"/><stop offset="100%" stop-color="transparent"/></linearGradient></defs>
      <rect x="-90" y="-100" width="180" height="200" fill="url(#sky0)" rx="4"/>
      <!-- Sun -->
      <circle cx="30" cy="-55" r="28" fill="${c}" opacity="0.12"/>
      <circle cx="30" cy="-55" r="22" fill="${c}" opacity="0.08"/>
      <path d="M-60,-55 L-20,-55 M80,-55 L40,-55 M30,-85 L30,-65 M30,-45 L30,-25" stroke="${c}" stroke-width="0.8" opacity="0.15"/>
      <!-- Cliff edge -->
      <path d="M-90,20 L-90,80 L40,80 L10,20 Z" fill="#1a0a0a" stroke="${c}" stroke-width="0.6" opacity="0.4"/>
      <path d="M10,20 L30,80" stroke="${c}" stroke-width="0.3" opacity="0.2"/>
      <!-- Figure -->
      <circle cx="-10" cy="-5" r="6" fill="${c}" opacity="0.5"/>
      <path d="M-10,1 L-10,25 M-10,10 L-18,18 M-10,10 L-2,18 M-10,25 L-16,35 M-10,25 L-4,35" stroke="${c}" stroke-width="1.2" opacity="0.5" fill="none" stroke-linecap="round"/>
      <!-- Knapsack on stick -->
      <path d="M-16,-8 L-28,-4 M-28,-4 L-30,2 L-24,4 L-22,-2 Z" stroke="${c}" stroke-width="0.6" opacity="0.35" fill="none"/>
      <!-- Small dog -->
      <path d="M20,15 Q25,10 28,14 Q30,18 26,20 L22,20 Z" stroke="${c}" stroke-width="0.5" opacity="0.35" fill="none"/>
    </g>`,

    // 1 The Magician - Tools on table, infinity symbol
    1: `<g transform="translate(100,155)">
      <defs><linearGradient id="sky1" x1="0" y1="-80" x2="0" y2="80"><stop offset="0%" stop-color="${c}" stop-opacity="0.08"/><stop offset="100%" stop-color="transparent"/></linearGradient></defs>
      <rect x="-90" y="-100" width="180" height="200" fill="url(#sky1)" rx="4"/>
      <!-- Infinity symbol -->
      <path d="M-15,-70 C-30,-85 30,-85 15,-70 C0,-55 0,-60 0,-60 C0,-60 0,-55 -15,-70" stroke="${c}" stroke-width="1.2" opacity="0.4" fill="none" stroke-linecap="round"/>
      <!-- Table -->
      <rect x="-45" y="10" width="90" height="4" rx="1" fill="${c}" opacity="0.2"/>
      <rect x="-35" y="14" width="4" height="20" fill="${c}" opacity="0.12"/>
      <rect x="31" y="14" width="4" height="20" fill="${c}" opacity="0.12"/>
      <!-- Tools on table (left to right: wand, cup, sword, pentacle) -->
      <line x1="-30" y1="8" x2="-30" y2="-5" stroke="${c}" stroke-width="1" opacity="0.35"/>
      <path d="M-10,8 C-14,8 -14,0 -10,0 C-6,0 -6,-5 -10,-6" stroke="${c}" stroke-width="0.8" opacity="0.35" fill="none"/>
      <line x1="10" y1="8" x2="10" y2="-8" stroke="${c}" stroke-width="1" opacity="0.35"/>
      <circle cx="30" cy="2" r="6" stroke="${c}" stroke-width="0.8" opacity="0.35" fill="none"/>
      <!-- Figure arms -->
      <circle cx="0" cy="-25" r="7" fill="${c}" opacity="0.3"/>
      <path d="M-7,-25 L-28,-15 L-28,-10 M7,-25 L28,-15 L28,-10" stroke="${c}" stroke-width="1" opacity="0.35" fill="none" stroke-linecap="round"/>
      <!-- Flower/plants -->
      <path d="M35,40 Q40,30 38,25 Q36,20 40,18" stroke="${c}" stroke-width="0.4" opacity="0.2" fill="none"/>
    </g>`,

    // 2 The High Priestess - Pillars, veil, crescent moon
    2: `<g transform="translate(100,155)">
      <defs><linearGradient id="bg2" x1="0" y1="-80" x2="0" y2="80"><stop offset="0%" stop-color="${c}" stop-opacity="0.06"/><stop offset="100%" stop-color="transparent"/></linearGradient></defs>
      <rect x="-90" y="-100" width="180" height="200" fill="url(#bg2)" rx="4"/>
      <!-- Pillars -->
      <rect x="-40" y="-60" width="14" height="120" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.3"/>
      <rect x="26" y="-60" width="14" height="120" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.3"/>
      <rect x="-42" y="-62" width="18" height="4" fill="${c}" opacity="0.15"/>
      <rect x="24" y="-62" width="18" height="4" fill="${c}" opacity="0.15"/>
      <rect x="-42" y="56" width="18" height="4" fill="${c}" opacity="0.15"/>
      <rect x="24" y="56" width="18" height="4" fill="${c}" opacity="0.15"/>
      <!-- Veil -->
      <path d="M-26,-55 Q0,-65 26,-55 L26,50 Q0,60 -26,50 Z" fill="none" stroke="${c}" stroke-width="0.3" opacity="0.12"/>
      <line x1="0" y1="-55" x2="0" y2="50" stroke="${c}" stroke-width="0.3" opacity="0.08"/>
      <!-- Crescent moon -->
      <path d="M10,-65 C10,-50 -10,-50 -10,-40 C-5,-55 5,-55 10,-65 Z" fill="${c}" opacity="0.25"/>
      <!-- Figure -->
      <circle cx="0" cy="-15" r="6" fill="${c}" opacity="0.25"/>
      <path d="M0,-9 L0,20 M0,5 L-12,12 M0,5 L12,12 M0,20 L-10,28 M0,20 L10,28" stroke="${c}" stroke-width="0.8" opacity="0.25" fill="none" stroke-linecap="round"/>
      <!-- Crown -->
      <path d="M-8,-22 L-6,-26 L-3,-23 L0,-28 L3,-23 L6,-26 L8,-22" stroke="${c}" stroke-width="0.5" opacity="0.2" fill="none"/>
    </g>`,

    // 3 The Empress - Throne, nature, stars, crown
    3: `<g transform="translate(100,155)">
      <defs><radialGradient id="bg3" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="${c}" stop-opacity="0.06"/><stop offset="100%" stop-color="transparent"/></radialGradient></defs>
      <rect x="-90" y="-100" width="180" height="200" fill="url(#bg3)" rx="4"/>
      <!-- Stars -->
      <circle cx="-50" cy="-70" r="1.5" fill="${c}" opacity="0.3"/>
      <circle cx="40" cy="-60" r="1.5" fill="${c}" opacity="0.3"/>
      <circle cx="-30" cy="-80" r="1" fill="${c}" opacity="0.2"/>
      <circle cx="55" cy="-75" r="1" fill="${c}" opacity="0.2"/>
      <!-- Wheat/plants -->
      <path d="M-50,40 Q-48,20 -45,10 M-48,40 Q-44,25 -42,15 M-46,35 L-42,35" stroke="${c}" stroke-width="0.4" opacity="0.15" fill="none"/>
      <path d="M50,40 Q48,20 45,10 M48,40 Q44,25 42,15" stroke="${c}" stroke-width="0.4" opacity="0.15" fill="none"/>
      <!-- Throne -->
      <path d="M-35,30 L-35,-20 L35,-20 L35,30 Z" fill="none" stroke="${c}" stroke-width="0.5" opacity="0.15"/>
      <!-- Figure -->
      <circle cx="0" cy="-30" r="7" fill="${c}" opacity="0.3"/>
      <path d="M0,-23 L0,10 M0,-5 L-15,5 M0,-5 L15,5 M0,10 L-12,22 M0,10 L12,22" stroke="${c}" stroke-width="1" opacity="0.3" fill="none" stroke-linecap="round"/>
      <!-- Crown -->
      <path d="M-10,-38 L-7,-44 L-3,-38 L0,-46 L3,-38 L7,-44 L10,-38" stroke="${c}" stroke-width="0.6" opacity="0.25" fill="none"/>
      <!-- Heart shape -->
      <path d="M-4,22 Q0,18 4,22 Q8,26 4,30 Q0,34 -4,30 Q-8,26 -4,22 Z" stroke="${c}" stroke-width="0.4" opacity="0.15" fill="none"/>
    </g>`,

    // 4 The Emperor - Throne, ram heads, orb
    4: `<g transform="translate(100,155)">
      <defs><linearGradient id="bg4" x1="0" y1="-80" x2="0" y2="80"><stop offset="0%" stop-color="${c}" stop-opacity="0.06"/><stop offset="100%" stop-color="transparent"/></linearGradient></defs>
      <rect x="-90" y="-100" width="180" height="200" fill="url(#bg4)" rx="4"/>
      <!-- Throne -->
      <rect x="-35" y="-35" width="70" height="70" rx="2" fill="none" stroke="${c}" stroke-width="0.5" opacity="0.15"/>
      <rect x="-38" y="-38" width="76" height="4" fill="${c}" opacity="0.12"/>
      <!-- Ram heads on throne -->
      <path d="M-40,-20 Q-48,-25 -46,-32 Q-44,-36 -38,-30" stroke="${c}" stroke-width="0.5" opacity="0.2" fill="none"/>
      <path d="M40,-20 Q48,-25 46,-32 Q44,-36 38,-30" stroke="${c}" stroke-width="0.5" opacity="0.2" fill="none"/>
      <!-- Figure -->
      <circle cx="0" cy="-25" r="7" fill="${c}" opacity="0.3"/>
      <path d="M0,-18 L0,10 M0,-5 L-14,5 M0,-5 L14,5 M0,10 L-12,22 M0,10 L12,22" stroke="${c}" stroke-width="1" opacity="0.3" fill="none" stroke-linecap="round"/>
      <!-- Crown -->
      <rect x="-8" y="-36" width="16" height="6" rx="1" fill="none" stroke="${c}" stroke-width="0.5" opacity="0.25"/>
      <path d="M-6,-36 L-6,-40 L0,-36 L6,-40 L6,-36" stroke="${c}" stroke-width="0.4" opacity="0.2" fill="none"/>
      <!-- Orb -->
      <circle cx="18" cy="-5" r="5" fill="none" stroke="${c}" stroke-width="0.5" opacity="0.2"/>
      <line x1="18" y1="-10" x2="18" y2="0" stroke="${c}" stroke-width="0.3" opacity="0.15"/>
      <line x1="13" y1="-5" x2="23" y2="-5" stroke="${c}" stroke-width="0.3" opacity="0.15"/>
    </g>`,

    // 5 The Hierophant - Central figure, two kneeling figures, hand gesture
    5: `<g transform="translate(100,155)">
      <defs><linearGradient id="bg5" x1="0" y1="-80" x2="0" y2="80"><stop offset="0%" stop-color="${c}" stop-opacity="0.06"/><stop offset="100%" stop-color="transparent"/></linearGradient></defs>
      <rect x="-90" y="-100" width="180" height="200" fill="url(#bg5)" rx="4"/>
      <!-- Arch -->
      <path d="M-50,-60 L-50,-30 Q0,-70 50,-30 L50,-60" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.18"/>
      <!-- Keys at feet -->
      <path d="M-8,35 L-8,28 M-8,30 L-4,30" stroke="${c}" stroke-width="0.5" opacity="0.15" fill="none"/>
      <path d="M8,35 L8,28 M8,30 L4,30" stroke="${c}" stroke-width="0.5" opacity="0.15" fill="none"/>
      <!-- Central figure -->
      <circle cx="0" cy="-25" r="7" fill="${c}" opacity="0.3"/>
      <path d="M0,-18 L0,15 M0,0 L-12,8 M0,0 L12,8" stroke="${c}" stroke-width="1" opacity="0.3" fill="none" stroke-linecap="round"/>
      <!-- Crown -->
      <path d="M-10,-34 L-7,-40 L-3,-34 L0,-42 L3,-34 L7,-40 L10,-34" stroke="${c}" stroke-width="0.5" opacity="0.2" fill="none"/>
      <!-- Two kneeling figures -->
      <circle cx="-35" cy="15" r="4" fill="${c}" opacity="0.2"/>
      <path d="M-35,19 L-35,30 M-35,22 L-40,28 M-35,22 L-30,28" stroke="${c}" stroke-width="0.5" opacity="0.2" fill="none" stroke-linecap="round"/>
      <circle cx="35" cy="15" r="4" fill="${c}" opacity="0.2"/>
      <path d="M35,19 L35,30 M35,22 L40,28 M35,22 L30,28" stroke="${c}" stroke-width="0.5" opacity="0.2" fill="none" stroke-linecap="round"/>
      <!-- Hand gesture blessing -->
      <path d="M12,-8 L20,-16 M20,-16 L24,-14 M20,-16 L22,-20" stroke="${c}" stroke-width="0.5" opacity="0.2" fill="none" stroke-linecap="round"/>
    </g>`,

    // 6 The Lovers - Two figures, angel/blessing above
    6: `<g transform="translate(100,155)">
      <defs><linearGradient id="bg6" x1="0" y1="-80" x2="0" y2="80"><stop offset="0%" stop-color="${c}" stop-opacity="0.07"/><stop offset="100%" stop-color="transparent"/></linearGradient></defs>
      <rect x="-90" y="-100" width="180" height="200" fill="url(#bg6)" rx="4"/>
      <!-- Sun/glow above -->
      <circle cx="0" cy="-65" r="20" fill="${c}" opacity="0.08"/>
      <circle cx="0" cy="-65" r="14" fill="${c}" opacity="0.05"/>
      <!-- Angel/blessing rays -->
      <path d="M0,-80 L-5,-60 M0,-80 L0,-60 M0,-80 L5,-60" stroke="${c}" stroke-width="0.5" opacity="0.15" stroke-linecap="round"/>
      <path d="M-20,-75 L-10,-60 M20,-75 L10,-60" stroke="${c}" stroke-width="0.5" opacity="0.15" stroke-linecap="round"/>
      <!-- Left figure -->
      <circle cx="-25" cy="-10" r="6" fill="${c}" opacity="0.3"/>
      <path d="M-25,-4 L-25,15 M-25,2 L-32,10 M-25,2 L-18,10" stroke="${c}" stroke-width="0.8" opacity="0.3" fill="none" stroke-linecap="round"/>
      <!-- Right figure -->
      <circle cx="25" cy="-10" r="6" fill="${c}" opacity="0.3"/>
      <path d="M25,-4 L25,15 M25,2 L32,10 M25,2 L18,10" stroke="${c}" stroke-width="0.8" opacity="0.3" fill="none" stroke-linecap="round"/>
      <!-- Connecting line between them -->
      <line x1="-19" y1="-10" x2="19" y2="-10" stroke="${c}" stroke-width="0.3" opacity="0.15"/>
      <!-- Tree of life behind -->
      <path d="M0,-50 L0,-30 M-8,-40 L8,-40" stroke="${c}" stroke-width="0.3" opacity="0.08" fill="none"/>
    </g>`,

    // 7 The Chariot - Chariot, two sphinxes, canopy
    7: `<g transform="translate(100,155)">
      <defs><linearGradient id="bg7" x1="0" y1="-80" x2="0" y2="80"><stop offset="0%" stop-color="${c}" stop-opacity="0.06"/><stop offset="100%" stop-color="transparent"/></linearGradient></defs>
      <rect x="-90" y="-100" width="180" height="200" fill="url(#bg7)" rx="4"/>
      <!-- Canopy/stars -->
      <path d="M-35,-75 Q0,-85 35,-75" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.15"/>
      <circle cx="0" cy="-80" r="1.5" fill="${c}" opacity="0.2"/>
      <circle cx="-20" cy="-78" r="1" fill="${c}" opacity="0.15"/>
      <circle cx="20" cy="-78" r="1" fill="${c}" opacity="0.15"/>
      <!-- Chariot body -->
      <path d="M-25,15 L-25,-5 L25,-5 L25,15 Z" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.2"/>
      <line x1="0" y1="-5" x2="0" y2="15" stroke="${c}" stroke-width="0.3" opacity="0.1"/>
      <!-- Wheels -->
      <circle cx="-15" cy="20" r="6" fill="none" stroke="${c}" stroke-width="0.4" opacity="0.2"/>
      <circle cx="15" cy="20" r="6" fill="none" stroke="${c}" stroke-width="0.4" opacity="0.2"/>
      <!-- Two sphinx figures (simplified) -->
      <path d="M-50,-5 Q-55,-15 -48,-20 Q-42,-22 -40,-12 L-40,-5" fill="none" stroke="${c}" stroke-width="0.5" opacity="0.2"/>
      <path d="M50,-5 Q55,-15 48,-20 Q42,-22 40,-12 L40,-5" fill="none" stroke="${c}" stroke-width="0.5" opacity="0.2"/>
      <!-- Figure in chariot -->
      <circle cx="0" cy="-15" r="5" fill="${c}" opacity="0.25"/>
      <path d="M0,-10 L0,-5" stroke="${c}" stroke-width="0.6" opacity="0.2" stroke-linecap="round"/>
      <!-- Wand/scepter -->
      <line x1="0" y1="-30" x2="0" y2="-15" stroke="${c}" stroke-width="0.5" opacity="0.15"/>
    </g>`,

    // 8 Strength - Woman and lion
    8: `<g transform="translate(100,155)">
      <defs><linearGradient id="bg8" x1="0" y1="-80" x2="0" y2="80"><stop offset="0%" stop-color="${c}" stop-opacity="0.06"/><stop offset="100%" stop-color="transparent"/></linearGradient></defs>
      <rect x="-90" y="-100" width="180" height="200" fill="url(#bg8)" rx="4"/>
      <!-- Woman figure -->
      <circle cx="0" cy="-30" r="7" fill="${c}" opacity="0.3"/>
      <path d="M0,-23 L0,10 M0,-5 L-14,5 M0,-5 L14,5 M0,10 L-10,22 M0,10 L10,22" stroke="${c}" stroke-width="0.8" opacity="0.3" fill="none" stroke-linecap="round"/>
      <!-- Infinity symbol above -->
      <path d="M-8,-40 C-18,-50 18,-50 8,-40 C0,-32 0,-35 0,-35" stroke="${c}" stroke-width="0.7" opacity="0.2" fill="none" stroke-linecap="round"/>
      <!-- Lion head (simplified) -->
      <circle cx="30" cy="-5" r="10" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.25"/>
      <!-- Lion mane -->
      <circle cx="30" cy="-5" r="14" fill="none" stroke="${c}" stroke-width="0.3" opacity="0.12"/>
      <path d="M25,-15 L20,-20 M35,-15 L40,-20" stroke="${c}" stroke-width="0.4" opacity="0.15" fill="none"/>
      <!-- Lion body -->
      <path d="M30,5 Q35,20 40,30" stroke="${c}" stroke-width="0.6" opacity="0.2" fill="none"/>
      <!-- Hands on lion -->
      <path d="M14,-2 L22,-8" stroke="${c}" stroke-width="0.5" opacity="0.2" fill="none" stroke-linecap="round"/>
    </g>`,

    // 9 The Hermit - Figure with lantern, staff
    9: `<g transform="translate(100,155)">
      <defs><linearGradient id="bg9" x1="0" y1="-80" x2="0" y2="80"><stop offset="0%" stop-color="${c}" stop-opacity="0.05"/><stop offset="100%" stop-color="transparent"/></linearGradient></defs>
      <rect x="-90" y="-100" width="180" height="200" fill="url(#bg9)" rx="4"/>
      <!-- Mountain -->
      <path d="M-90,30 L-30,-40 L30,30" fill="none" stroke="${c}" stroke-width="0.3" opacity="0.08"/>
      <path d="M-10,30 L40,-20 L90,30" fill="none" stroke="${c}" stroke-width="0.3" opacity="0.06"/>
      <!-- Figure -->
      <circle cx="0" cy="-15" r="7" fill="${c}" opacity="0.3"/>
      <path d="M0,-8 L0,15 M0,0 L-12,8 M0,0 L12,8 M0,15 L-10,25 M0,15 L10,25" stroke="${c}" stroke-width="0.8" opacity="0.3" fill="none" stroke-linecap="round"/>
      <!-- Hood/cape -->
      <path d="M-10,-22 Q0,-28 10,-22" fill="none" stroke="${c}" stroke-width="0.5" opacity="0.15"/>
      <!-- Lantern (glowing) -->
      <circle cx="20" cy="-10" r="8" fill="${c}" opacity="0.08"/>
      <circle cx="20" cy="-10" r="5" fill="${c}" opacity="0.12"/>
      <rect x="17" y="-16" width="6" height="4" rx="1" fill="none" stroke="${c}" stroke-width="0.4" opacity="0.25"/>
      <path d="M18,-12 L22,-12 L21,-8 L19,-8 Z" fill="${c}" opacity="0.15"/>
      <!-- Staff -->
      <line x1="-15" y1="25" x2="-15" y2="-35" stroke="${c}" stroke-width="0.8" opacity="0.25"/>
    </g>`,

    // 10 Wheel of Fortune - Wheel, four animals in corners
    10: `<g transform="translate(100,155)">
      <defs><linearGradient id="bg10" x1="0" y1="-80" x2="0" y2="80"><stop offset="0%" stop-color="${c}" stop-opacity="0.06"/><stop offset="100%" stop-color="transparent"/></linearGradient></defs>
      <rect x="-90" y="-100" width="180" height="200" fill="url(#bg10)" rx="4"/>
      <!-- Wheel - outer -->
      <circle cx="0" cy="0" r="40" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.2"/>
      <circle cx="0" cy="0" r="32" fill="none" stroke="${c}" stroke-width="0.3" opacity="0.12"/>
      <circle cx="0" cy="0" r="22" fill="none" stroke="${c}" stroke-width="0.4" opacity="0.15"/>
      <circle cx="0" cy="0" r="8" fill="none" stroke="${c}" stroke-width="0.5" opacity="0.2"/>
      <!-- Spokes -->
      <line x1="0" y1="-40" x2="0" y2="40" stroke="${c}" stroke-width="0.3" opacity="0.1"/>
      <line x1="-40" y1="0" x2="40" y2="0" stroke="${c}" stroke-width="0.3" opacity="0.1"/>
      <line x1="-28" y1="-28" x2="28" y2="28" stroke="${c}" stroke-width="0.3" opacity="0.1"/>
      <line x1="-28" y1="28" x2="28" y2="-28" stroke="${c}" stroke-width="0.3" opacity="0.1"/>
      <!-- Letters/runes on wheel -->
      <text x="0" y="-45" font-size="8" fill="${c}" opacity="0.3" text-anchor="middle" font-family="serif">T</text>
      <text x="0" y="52" font-size="8" fill="${c}" opacity="0.3" text-anchor="middle" font-family="serif">A</text>
      <text x="-48" y="3" font-size="8" fill="${c}" opacity="0.3" text-anchor="middle" font-family="serif">R</text>
      <text x="48" y="3" font-size="8" fill="${c}" opacity="0.3" text-anchor="middle" font-family="serif">O</text>
      <!-- Corner animal symbols -->
      <path d="M-65,-55 L-60,-65 L-55,-55 L-58,-50 L-62,-50 Z" stroke="${c}" stroke-width="0.4" opacity="0.15" fill="none"/>
      <path d="M65,-55 L60,-65 L55,-55 L58,-50 L62,-50 Z" stroke="${c}" stroke-width="0.4" opacity="0.15" fill="none"/>
      <path d="M-65,55 Q-60,50 -55,55 Q-60,60 -65,55" stroke="${c}" stroke-width="0.4" opacity="0.15" fill="none"/>
      <path d="M65,55 Q60,50 55,55 Q60,60 65,55" stroke="${c}" stroke-width="0.4" opacity="0.15" fill="none"/>
    </g>`,

    // 11 Justice - Scales, sword
    11: `<g transform="translate(100,155)">
      <defs><linearGradient id="bg11" x1="0" y1="-80" x2="0" y2="80"><stop offset="0%" stop-color="${c}" stop-opacity="0.06"/><stop offset="100%" stop-color="transparent"/></linearGradient></defs>
      <rect x="-90" y="-100" width="180" height="200" fill="url(#bg11)" rx="4"/>
      <!-- Sword (center, vertical) -->
      <line x1="0" y1="-65" x2="0" y2="20" stroke="${c}" stroke-width="1" opacity="0.3"/>
      <line x1="-4" y1="-65" x2="4" y2="-65" stroke="${c}" stroke-width="0.5" opacity="0.25"/>
      <circle cx="0" cy="-25" r="3" fill="none" stroke="${c}" stroke-width="0.4" opacity="0.15"/>
      <!-- Crown -->
      <path d="M-12,-72 L-9,-78 L-5,-72 L0,-80 L5,-72 L9,-78 L12,-72" stroke="${c}" stroke-width="0.5" opacity="0.15" fill="none"/>
      <!-- Scales beam -->
      <line x1="-45" y1="15" x2="45" y2="15" stroke="${c}" stroke-width="0.6" opacity="0.2"/>
      <line x1="0" y1="15" x2="0" y2="35" stroke="${c}" stroke-width="0.5" opacity="0.2"/>
      <!-- Left scale pan -->
      <path d="M-45,15 L-45,30 Q-40,35 -35,28" fill="none" stroke="${c}" stroke-width="0.4" opacity="0.2"/>
      <line x1="-45" y1="28" x2="-38" y2="28" stroke="${c}" stroke-width="0.3" opacity="0.12"/>
      <path d="M-50,28 L-33,28" stroke="${c}" stroke-width="0.4" opacity="0.15"/>
      <!-- Right scale pan -->
      <path d="M45,15 L45,30 Q40,35 35,28" fill="none" stroke="${c}" stroke-width="0.4" opacity="0.2"/>
      <line x1="45" y1="28" x2="38" y2="28" stroke="${c}" stroke-width="0.3" opacity="0.12"/>
      <path d="M50,28 L33,28" stroke="${c}" stroke-width="0.4" opacity="0.15"/>
      <!-- Figure behind (simplified) -->
      <circle cx="0" cy="-42" r="5" fill="${c}" opacity="0.15"/>
    </g>`,

    // 12 The Hanged Man - Figure suspended, halo
    12: `<g transform="translate(100,155)">
      <defs><linearGradient id="bg12" x1="0" y1="-80" x2="0" y2="80"><stop offset="0%" stop-color="${c}" stop-opacity="0.06"/><stop offset="100%" stop-color="transparent"/></linearGradient></defs>
      <rect x="-90" y="-100" width="180" height="200" fill="url(#bg12)" rx="4"/>
      <!-- Cross beam / T -->
      <line x1="-35" y1="-65" x2="35" y2="-65" stroke="${c}" stroke-width="1" opacity="0.25"/>
      <line x1="0" y1="-65" x2="0" y2="10" stroke="${c}" stroke-width="0.8" opacity="0.2"/>
      <!-- Figure (upside down, suspended) -->
      <circle cx="0" cy="-30" r="7" fill="${c}" opacity="0.35"/>
      <!-- Body hanging -->
      <path d="M0,-23 L0,-8 M0,-8 L-10,0 M0,-8 L10,0" stroke="${c}" stroke-width="0.8" opacity="0.3" fill="none" stroke-linecap="round"/>
      <!-- Legs bent (one crossed) -->
      <path d="M-10,0 L-4,8 M-10,0 L-16,6" stroke="${c}" stroke-width="0.7" opacity="0.25" fill="none" stroke-linecap="round"/>
      <!-- Arms behind back -->
      <path d="M0,-14 L-12,-18 M0,-14 L12,-18" stroke="${c}" stroke-width="0.6" opacity="0.2" fill="none" stroke-linecap="round"/>
      <!-- Halo -->
      <circle cx="0" cy="-30" r="11" fill="none" stroke="${c}" stroke-width="0.4" opacity="0.15"/>
      <!-- Hands -->
      <circle cx="-10" cy="0" r="2" fill="${c}" opacity="0.15"/>
      <circle cx="10" cy="0" r="2" fill="${c}" opacity="0.15"/>
    </g>`,

    // 13 Death - Skeleton/reaper, scythe, ground, sun setting
    13: `<g transform="translate(100,155)">
      <defs><linearGradient id="bg13" x1="0" y1="-80" x2="0" y2="80"><stop offset="0%" stop-color="${c}" stop-opacity="0.08"/><stop offset="100%" stop-color="transparent"/></linearGradient></defs>
      <rect x="-90" y="-100" width="180" height="200" fill="url(#bg13)" rx="4"/>
      <!-- Setting sun -->
      <circle cx="30" cy="20" r="25" fill="${c}" opacity="0.06"/>
      <circle cx="30" cy="20" r="18" fill="${c}" opacity="0.04"/>
      <!-- Ground line -->
      <line x1="-90" y1="30" x2="90" y2="30" stroke="${c}" stroke-width="0.4" opacity="0.15"/>
      <!-- Reaper figure (simplified) -->
      <circle cx="0" cy="-20" r="6" fill="${c}" opacity="0.3"/>
      <path d="M0,-14 L0,15" stroke="${c}" stroke-width="1.2" opacity="0.3"/>
      <!-- Scythe -->
      <path d="M-15,30 L-15,-15 Q-5,-25 5,-20 Q8,-18 5,-15" fill="none" stroke="${c}" stroke-width="0.8" opacity="0.3" stroke-linecap="round"/>
      <!-- Arms -->
      <path d="M0,-8 L-15,-5 M-15,-5 L-15,-12" stroke="${c}" stroke-width="0.6" opacity="0.25" fill="none" stroke-linecap="round"/>
      <!-- Rose/white flag -->
      <circle cx="-15" cy="-12" r="3" fill="${c}" opacity="0.1"/>
      <!-- Falling figures -->
      <circle cx="-40" cy="35" r="3" fill="${c}" opacity="0.1"/>
      <circle cx="40" cy="35" r="3" fill="${c}" opacity="0.1"/>
      <circle cx="0" cy="38" r="2" fill="${c}" opacity="0.08"/>
    </g>`,

    // 14 Temperance - Figure pouring water, cups
    14: `<g transform="translate(100,155)">
      <defs><linearGradient id="bg14" x1="0" y1="-80" x2="0" y2="80"><stop offset="0%" stop-color="${c}" stop-opacity="0.06"/><stop offset="100%" stop-color="transparent"/></linearGradient></defs>
      <rect x="-90" y="-100" width="180" height="200" fill="url(#bg14)" rx="4"/>
      <!-- Angel figure -->
      <circle cx="0" cy="-30" r="7" fill="${c}" opacity="0.3"/>
      <path d="M0,-23 L0,10 M0,0 L-12,8 M0,0 L12,8" stroke="${c}" stroke-width="0.8" opacity="0.3" fill="none" stroke-linecap="round"/>
      <!-- Wings -->
      <path d="M-7,-25 Q-25,-35 -20,-20" fill="none" stroke="${c}" stroke-width="0.4" opacity="0.15"/>
      <path d="M7,-25 Q25,-35 20,-20" fill="none" stroke="${c}" stroke-width="0.4" opacity="0.15"/>
      <!-- Two cups - pouring water -->
      <circle cx="-15" cy="15" r="7" fill="none" stroke="${c}" stroke-width="0.5" opacity="0.2"/>
      <circle cx="15" cy="15" r="7" fill="none" stroke="${c}" stroke-width="0.5" opacity="0.2"/>
      <!-- Water flowing between cups -->
      <path d="M-8,15 Q-3,10 0,8 Q3,10 8,15" fill="none" stroke="${c}" stroke-width="0.4" opacity="0.15"/>
      <!-- Sun -->
      <circle cx="0" cy="-55" r="8" fill="${c}" opacity="0.06"/>
      <!-- Path/ground -->
      <path d="M-30,30 L30,30" stroke="${c}" stroke-width="0.3" opacity="0.08"/>
      <!-- Triangle symbol on chest -->
      <path d="M-4,-3 L4,-3 L0,3 Z" fill="none" stroke="${c}" stroke-width="0.3" opacity="0.12"/>
    </g>`,

    // 15 The Devil - Horned figure, pentagram, chains
    15: `<g transform="translate(100,155)">
      <defs><linearGradient id="bg15" x1="0" y1="-80" x2="0" y2="80"><stop offset="0%" stop-color="${c}" stop-opacity="0.08"/><stop offset="100%" stop-color="transparent"/></linearGradient></defs>
      <rect x="-90" y="-100" width="180" height="200" fill="url(#bg15)" rx="4"/>
      <!-- Pentagram (inverted) -->
      <polygon points="0,-35 8,-15 28,-15 12,0 20,22 0,10 -20,22 -12,0 -28,-15 -8,-15" fill="none" stroke="${c}" stroke-width="0.3" opacity="0.08"/>
      <!-- Devil figure -->
      <circle cx="0" cy="-15" r="9" fill="${c}" opacity="0.25"/>
      <!-- Horns -->
      <path d="M-8,-22 L-14,-32 M8,-22 L14,-32" stroke="${c}" stroke-width="0.8" opacity="0.3" fill="none" stroke-linecap="round"/>
      <!-- Body -->
      <path d="M0,-6 L0,20 M0,0 L-14,8 M0,0 L14,8" stroke="${c}" stroke-width="0.8" opacity="0.25" fill="none" stroke-linecap="round"/>
      <!-- Bat wings -->
      <path d="M-9,-8 Q-30,-10 -35,0 Q-30,5 -14,5" fill="none" stroke="${c}" stroke-width="0.4" opacity="0.15"/>
      <path d="M9,-8 Q30,-10 35,0 Q30,5 14,5" fill="none" stroke="${c}" stroke-width="0.4" opacity="0.15"/>
      <!-- Chains to two smaller figures -->
      <path d="M-14,8 Q-20,15 -25,25 Q-22,28 -18,25" fill="none" stroke="${c}" stroke-width="0.3" opacity="0.12"/>
      <path d="M14,8 Q20,15 25,25 Q22,28 18,25" fill="none" stroke="${c}" stroke-width="0.3" opacity="0.12"/>
      <!-- Small bound figures -->
      <circle cx="-22" cy="22" r="3" fill="${c}" opacity="0.12"/>
      <circle cx="22" cy="22" r="3" fill="${c}" opacity="0.12"/>
      <!-- Fire below -->
      <path d="M-20,35 Q-15,28 -10,35 Q-5,28 0,35 Q5,28 10,35 Q15,28 20,35" fill="none" stroke="${c}" stroke-width="0.3" opacity="0.08"/>
    </g>`,

    // 16 The Tower - Tower struck by lightning, figures falling
    16: `<g transform="translate(100,155)">
      <defs><linearGradient id="bg16" x1="0" y1="-80" x2="0" y2="80"><stop offset="0%" stop-color="${c}" stop-opacity="0.08"/><stop offset="100%" stop-color="transparent"/></linearGradient></defs>
      <rect x="-90" y="-100" width="180" height="200" fill="url(#bg16)" rx="4"/>
      <!-- Sky/horror vacui -->
      <circle cx="40" cy="-70" r="15" fill="${c}" opacity="0.04"/>
      <!-- Tower -->
      <rect x="-12" y="-50" width="24" height="80" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.25"/>
      <rect x="-17" y="-55" width="34" height="8" rx="1" fill="none" stroke="${c}" stroke-width="0.5" opacity="0.2"/>
      <rect x="-8" y="-20" width="16" height="6" fill="none" stroke="${c}" stroke-width="0.3" opacity="0.12"/>
      <circle cx="-8" cy="-17" r="2" fill="${c}" opacity="0.08"/>
      <circle cx="8" cy="-17" r="2" fill="${c}" opacity="0.08"/>
      <!-- Lightning bolt -->
      <path d="M5,-80 L-8,-50 L3,-48 L-5,-20" stroke="${c}" stroke-width="1.2" opacity="0.35" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Flames -->
      <path d="M-15,30 Q-10,20 -8,30 Q-5,22 0,30 Q5,22 10,30 Q12,20 15,30" fill="none" stroke="${c}" stroke-width="0.4" opacity="0.12"/>
      <!-- Falling figures -->
      <circle cx="-25" cy="10" r="3" fill="${c}" opacity="0.12"/>
      <path d="M-25,13 L-25,20" stroke="${c}" stroke-width="0.3" opacity="0.1"/>
      <circle cx="25" cy="25" r="3" fill="${c}" opacity="0.12"/>
      <path d="M25,28 L25,35" stroke="${c}" stroke-width="0.3" opacity="0.1"/>
      <!-- Sparks -->
      <circle cx="-30" cy="-30" r="1" fill="${c}" opacity="0.1"/>
      <circle cx="35" cy="-15" r="1" fill="${c}" opacity="0.1"/>
      <circle cx="-20" cy="-45" r="0.8" fill="${c}" opacity="0.08"/>
    </g>`,

    // 17 The Star - Figure pouring water, large star, small stars
    17: `<g transform="translate(100,155)">
      <defs><radialGradient id="bg17" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="${c}" stop-opacity="0.08"/><stop offset="100%" stop-color="transparent"/></radialGradient></defs>
      <rect x="-90" y="-100" width="180" height="200" fill="url(#bg17)" rx="4"/>
      <!-- Large central star -->
      <polygon points="0,-50 5,-38 18,-38 8,-28 12,-15 0,-22 -12,-15 -8,-28 -18,-38 -5,-38" fill="${c}" opacity="0.12"/>
      <polygon points="0,-47 4,-38 15,-38 7,-28 10,-18 0,-24 -10,-18 -7,-28 -15,-38 -4,-38" fill="${c}" opacity="0.08"/>
      <!-- Small stars -->
      <circle cx="-40" cy="-60" r="1" fill="${c}" opacity="0.2"/>
      <circle cx="35" cy="-65" r="1.5" fill="${c}" opacity="0.2"/>
      <circle cx="-50" cy="-35" r="1" fill="${c}" opacity="0.15"/>
      <circle cx="40" cy="-45" r="0.8" fill="${c}" opacity="0.15"/>
      <circle cx="-25" cy="-70" r="0.8" fill="${c}" opacity="0.12"/>
      <circle cx="25" cy="-55" r="0.6" fill="${c}" opacity="0.12"/>
      <!-- Figure kneeling -->
      <circle cx="0" cy="-15" r="6" fill="${c}" opacity="0.25"/>
      <path d="M0,-9 L0,5 M0,0 L-10,6 M0,0 L10,6" stroke="${c}" stroke-width="0.7" opacity="0.25" fill="none" stroke-linecap="round"/>
      <!-- Kneeling -->
      <path d="M-8,12 L-12,22 M8,12 L12,22" stroke="${c}" stroke-width="0.5" opacity="0.2" fill="none" stroke-linecap="round"/>
      <!-- Two vessels pouring water -->
      <path d="M-10,6 L-15,12 Q-18,18 -12,20" fill="none" stroke="${c}" stroke-width="0.4" opacity="0.15"/>
      <path d="M10,6 L15,12 Q18,18 12,20" fill="none" stroke="${c}" stroke-width="0.4" opacity="0.15"/>
      <!-- Water streams -->
      <path d="M-15,12 Q-10,25 -5,35 M15,12 Q10,25 5,35" fill="none" stroke="${c}" stroke-width="0.3" opacity="0.08"/>
      <!-- Pool below -->
      <path d="M-20,35 Q0,30 20,35" fill="none" stroke="${c}" stroke-width="0.3" opacity="0.06"/>
    </g>`,

    // 18 The Moon - Moon, path, pillars, animals
    18: `<g transform="translate(100,155)">
      <defs><linearGradient id="bg18" x1="0" y1="-80" x2="0" y2="80"><stop offset="0%" stop-color="${c}" stop-opacity="0.06"/><stop offset="100%" stop-color="transparent"/></linearGradient></defs>
      <rect x="-90" y="-100" width="180" height="200" fill="url(#bg18)" rx="4"/>
      <!-- Full moon -->
      <circle cx="20" cy="-55" r="20" fill="${c}" opacity="0.06"/>
      <circle cx="20" cy="-55" r="16" fill="${c}" opacity="0.04"/>
      <circle cx="16" cy="-58" r="3" fill="${c}" opacity="0.04"/>
      <!-- Crescent moon inside -->
      <path d="M25,-65 A14,14 0 0,0 20,-42 A10,10 0 0,1 25,-65 Z" fill="${c}" opacity="0.12"/>
      <!-- Moon face (simplified) -->
      <circle cx="17" cy="-57" r="1" fill="${c}" opacity="0.06"/>
      <circle cx="23" cy="-57" r="1" fill="${c}" opacity="0.06"/>
      <!-- Path winding -->
      <path d="M0,35 Q-5,20 5,10 Q10,0 0,-10 Q-5,-20 5,-30" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.1"/>
      <!-- Two pillars -->
      <rect x="-55" y="-30" width="10" height="60" fill="none" stroke="${c}" stroke-width="0.4" opacity="0.12"/>
      <rect x="45" y="-30" width="10" height="60" fill="none" stroke="${c}" stroke-width="0.4" opacity="0.12"/>
      <!-- Dog/wolf -->
      <path d="M-30,10 L-25,5 L-20,10 L-25,12 Z" fill="none" stroke="${c}" stroke-width="0.4" opacity="0.15"/>
      <!-- Wolf body -->
      <path d="M-28,8 L-32,15" stroke="${c}" stroke-width="0.3" opacity="0.12" fill="none"/>
      <!-- Crayfish/crab in water -->
      <ellipse cx="30" cy="25" rx="6" ry="3" fill="none" stroke="${c}" stroke-width="0.3" opacity="0.1"/>
      <!-- Drops -->
      <circle cx="-15" cy="-40" r="1" fill="${c}" opacity="0.08"/>
      <circle cx="-10" cy="-35" r="0.7" fill="${c}" opacity="0.06"/>
    </g>`,

    // 19 The Sun - Sun, children, wall
    19: `<g transform="translate(100,155)">
      <defs><radialGradient id="bg19" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="${c}" stop-opacity="0.1"/><stop offset="100%" stop-color="transparent"/></radialGradient></defs>
      <rect x="-90" y="-100" width="180" height="200" fill="url(#bg19)" rx="4"/>
      <!-- Giant sun -->
      <circle cx="0" cy="-35" r="32" fill="none" stroke="${c}" stroke-width="0.5" opacity="0.12"/>
      <circle cx="0" cy="-35" r="26" fill="${c}" opacity="0.06"/>
      <circle cx="0" cy="-35" r="18" fill="none" stroke="${c}" stroke-width="0.3" opacity="0.08"/>
      <!-- Sun rays -->
      <path d="M-35,-35 L-45,-35 M35,-35 L45,-35 M0,-70 L0,-80 M0,0 L0,10 M-25,-60 L-35,-70 M25,-60 L35,-70 M-25,-10 L-35,0 M25,-10 L35,0" stroke="${c}" stroke-width="0.4" opacity="0.12" stroke-linecap="round"/>
      <path d="M-18,-60 L-22,-72 M18,-60 L22,-72" stroke="${c}" stroke-width="0.3" opacity="0.08" stroke-linecap="round"/>
      <!-- Wall/brick -->
      <rect x="-40" y="10" width="80" height="4" fill="${c}" opacity="0.08"/>
      <rect x="-40" y="14" width="80" height="2" fill="${c}" opacity="0.04"/>
      <!-- Two children -->
      <circle cx="-12" cy="-3" r="5" fill="${c}" opacity="0.2"/>
      <path d="M-12,2 L-12,10 M-12,4 L-16,8 M-12,4 L-8,8" stroke="${c}" stroke-width="0.5" opacity="0.2" fill="none" stroke-linecap="round"/>
      <circle cx="12" cy="-3" r="5" fill="${c}" opacity="0.2"/>
      <path d="M12,2 L12,10 M12,4 L16,8 M12,4 L8,8" stroke="${c}" stroke-width="0.5" opacity="0.2" fill="none" stroke-linecap="round"/>
      <!-- Holding hands -->
      <line x1="-7" y1="-3" x2="7" y2="-3" stroke="${c}" stroke-width="0.3" opacity="0.12"/>
      <!-- Sunflowers -->
      <circle cx="-35" cy="20" r="3" fill="${c}" opacity="0.08"/>
      <circle cx="35" cy="20" r="3" fill="${c}" opacity="0.08"/>
    </g>`,

    // 20 Judgement - Angel, trumpet, figures rising
    20: `<g transform="translate(100,155)">
      <defs><linearGradient id="bg20" x1="0" y1="-80" x2="0" y2="80"><stop offset="0%" stop-color="${c}" stop-opacity="0.08"/><stop offset="100%" stop-color="transparent"/></linearGradient></defs>
      <rect x="-90" y="-100" width="180" height="200" fill="url(#bg20)" rx="4"/>
      <!-- Angel/trumpet -->
      <circle cx="0" cy="-55" r="8" fill="${c}" opacity="0.2"/>
      <!-- Wings -->
      <path d="M-8,-55 Q-30,-65 -25,-45 Q-20,-50 -8,-50" fill="none" stroke="${c}" stroke-width="0.4" opacity="0.12"/>
      <path d="M8,-55 Q30,-65 25,-45 Q20,-50 8,-50" fill="none" stroke="${c}" stroke-width="0.4" opacity="0.12"/>
      <!-- Trumpet -->
      <path d="M12,-60 L25,-50 L28,-45 L22,-42 L10,-52 Z" fill="none" stroke="${c}" stroke-width="0.5" opacity="0.25"/>
      <!-- Sound waves -->
      <path d="M30,-55 Q35,-58 38,-55 Q42,-52 45,-55" fill="none" stroke="${c}" stroke-width="0.3" opacity="0.08"/>
      <path d="M28,-48 Q33,-50 36,-47 Q40,-44 43,-47" fill="none" stroke="${c}" stroke-width="0.3" opacity="0.06"/>
      <!-- Banner/flag on trumpet -->
      <path d="M25,-50 L35,-48 L35,-42 L25,-44" fill="none" stroke="${c}" stroke-width="0.3" opacity="0.1"/>
      <!-- Cross on banner -->
      <line x1="28" y1="-48" x2="28" y2="-44" stroke="${c}" stroke-width="0.3" opacity="0.08"/>
      <line x1="26" y1="-46" x2="30" y2="-46" stroke="${c}" stroke-width="0.3" opacity="0.08"/>
      <!-- Coffins/water below -->
      <line x1="-50" y1="25" x2="50" y2="25" stroke="${c}" stroke-width="0.3" opacity="0.08"/>
      <!-- Figures rising (three) -->
      <circle cx="-20" cy="10" r="4" fill="${c}" opacity="0.15"/>
      <path d="M-20,14 L-20,22 M-20,16 L-24,20 M-20,16 L-16,20" stroke="${c}" stroke-width="0.4" opacity="0.12" fill="none" stroke-linecap="round"/>
      <circle cx="0" cy="5" r="4" fill="${c}" opacity="0.15"/>
      <path d="M0,9 L0,17 M0,11 L-4,15 M0,11 L4,15" stroke="${c}" stroke-width="0.4" opacity="0.12" fill="none" stroke-linecap="round"/>
      <circle cx="20" cy="12" r="4" fill="${c}" opacity="0.15"/>
      <path d="M20,16 L20,24 M20,18 L24,22 M20,18 L16,22" stroke="${c}" stroke-width="0.4" opacity="0.12" fill="none" stroke-linecap="round"/>
      <!-- Clouds -->
      <ellipse cx="-35" cy="-30" rx="15" ry="4" fill="none" stroke="${c}" stroke-width="0.2" opacity="0.04"/>
      <ellipse cx="35" cy="-25" rx="12" ry="3" fill="none" stroke="${c}" stroke-width="0.2" opacity="0.04"/>
    </g>`,

    // 21 The World - Dancer, wreath, four creatures in corners
    21: `<g transform="translate(100,155)">
      <defs><radialGradient id="bg21" cx="50%" cy="45%" r="55%"><stop offset="0%" stop-color="${c}" stop-opacity="0.08"/><stop offset="100%" stop-color="transparent"/></radialGradient></defs>
      <rect x="-90" y="-100" width="180" height="200" fill="url(#bg21)" rx="4"/>
      <!-- Wreath/ellipse -->
      <ellipse cx="0" cy="0" rx="38" ry="42" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.15"/>
      <ellipse cx="0" cy="0" rx="34" ry="38" fill="none" stroke="${c}" stroke-width="0.3" opacity="0.08"/>
      <ellipse cx="0" cy="0" rx="42" ry="46" fill="none" stroke="${c}" stroke-width="0.2" opacity="0.05"/>
      <!-- Dancer figure inside wreath -->
      <circle cx="0" cy="-12" r="7" fill="${c}" opacity="0.25"/>
      <path d="M0,-5 L0,12 M0,0 L-12,6 M0,0 L12,6" stroke="${c}" stroke-width="0.8" opacity="0.25" fill="none" stroke-linecap="round"/>
      <!-- Dancing legs -->
      <path d="M0,12 L-6,20 M0,12 L6,20" stroke="${c}" stroke-width="0.6" opacity="0.2" fill="none" stroke-linecap="round"/>
      <!-- One leg crossed -->
      <path d="M6,20 L-4,24" stroke="${c}" stroke-width="0.4" opacity="0.15" fill="none" stroke-linecap="round"/>
      <!-- Sash/belt -->
      <ellipse cx="0" cy="0" rx="8" ry="3" fill="none" stroke="${c}" stroke-width="0.3" opacity="0.1"/>
      <!-- Four corner symbols -->
      <!-- Top left: Eagle (fixed) -->
      <path d="M-55,-70 L-50,-78 L-45,-70 L-48,-65 L-52,-65 Z" fill="none" stroke="${c}" stroke-width="0.4" opacity="0.15"/>
      <!-- Top right: Angel/face -->
      <circle cx="55" cy="-68" r="6" fill="none" stroke="${c}" stroke-width="0.4" opacity="0.12"/>
      <!-- Bottom left: Bull -->
      <path d="M-55,68 Q-50,62 -45,68 L-48,70 L-52,70 Z" fill="none" stroke="${c}" stroke-width="0.4" opacity="0.12"/>
      <!-- Bottom right: Lion -->
      <circle cx="55" cy="68" r="5" fill="none" stroke="${c}" stroke-width="0.4" opacity="0.12"/>
      <path d="M52,64 Q55,62 58,64" fill="none" stroke="${c}" stroke-width="0.3" opacity="0.08"/>
      <!-- Laurel leaves -->
      <path d="M-35,-30 Q-25,-40 -38,-45" fill="none" stroke="${c}" stroke-width="0.2" opacity="0.05"/>
      <path d="M35,-30 Q25,-40 38,-45" fill="none" stroke="${c}" stroke-width="0.2" opacity="0.05"/>
    </g>`,
  };

  return scenes[rank] || `<g transform="translate(100,155)">
    <circle cx="0" cy="0" r="40" fill="none" stroke="${c}" stroke-width="0.5" opacity="0.15"/>
    <text x="0" y="6" font-size="24" fill="${c}" opacity="0.3" text-anchor="middle" font-family="Cinzel,serif">${ROMAN_NUM[rank] || rank}</text>
  </g>`;
}

// ===== Pip Card Art - Arranges suit symbols in traditional patterns =====

function getPipArt(rank, suit, color) {
  if (rank < 1 || rank > 10) return '';
  const sc = rank <= 2 ? 1.1 : rank <= 4 ? 0.9 : rank <= 6 ? 0.75 : rank <= 8 ? 0.65 : 0.55;
  const sym = getPipSymbol(suit, color, sc);

  const layouts = {
    1: `<g transform="translate(100,150)">${sym}</g>`,
    2: `<g transform="translate(100,115)">${sym}</g><g transform="translate(100,185) scale(1,-1)">${sym}</g>`,
    3: `<g transform="translate(100,105)">${sym}</g><g transform="translate(100,150)">${sym}</g><g transform="translate(100,195) scale(1,-1)">${sym}</g>`,
    4: `<g transform="translate(78,108)">${sym}</g><g transform="translate(122,108)">${sym}</g><g transform="translate(78,192) scale(1,-1)">${sym}</g><g transform="translate(122,192) scale(1,-1)">${sym}</g>`,
    5: `<g transform="translate(78,108)">${sym}</g><g transform="translate(122,108)">${sym}</g><g transform="translate(100,150)">${sym}</g><g transform="translate(78,192) scale(1,-1)">${sym}</g><g transform="translate(122,192) scale(1,-1)">${sym}</g>`,
    6: `<g transform="translate(78,100)">${sym}</g><g transform="translate(122,100)">${sym}</g><g transform="translate(78,150)">${sym}</g><g transform="translate(122,150)">${sym}</g><g transform="translate(78,200)">${sym}</g><g transform="translate(122,200)">${sym}</g>`,
    7: `<g transform="translate(78,100)">${sym}</g><g transform="translate(122,100)">${sym}</g><g transform="translate(100,125)">${sym}</g><g transform="translate(78,150)">${sym}</g><g transform="translate(122,150)">${sym}</g><g transform="translate(78,200)">${sym}</g><g transform="translate(122,200)">${sym}</g>`,
    8: `<g transform="translate(78,95)">${sym}</g><g transform="translate(122,95)">${sym}</g><g transform="translate(100,120)">${sym}</g><g transform="translate(78,150)">${sym}</g><g transform="translate(122,150)">${sym}</g><g transform="translate(78,200)">${sym}</g><g transform="translate(122,200)">${sym}</g><g transform="translate(100,175)">${sym}</g>`,
    9: `<g transform="translate(78,95)">${sym}</g><g transform="translate(122,95)">${sym}</g><g transform="translate(100,120)">${sym}</g><g transform="translate(78,150)">${sym}</g><g transform="translate(122,150)">${sym}</g><g transform="translate(100,175)">${sym}</g><g transform="translate(78,200)">${sym}</g><g transform="translate(122,200)">${sym}</g><g transform="translate(100,150)">${sym}</g>`,
    10: `<g transform="translate(78,90)">${sym}</g><g transform="translate(122,90)">${sym}</g><g transform="translate(100,112)">${sym}</g><g transform="translate(78,135)">${sym}</g><g transform="translate(122,135)">${sym}</g><g transform="translate(100,160)">${sym}</g><g transform="translate(78,185)">${sym}</g><g transform="translate(122,185)">${sym}</g><g transform="translate(100,210)">${sym}</g><g transform="translate(100,185)">${sym}</g>`,
  };

  return layouts[rank] || layouts[1];
}

// ===== Court Card Art - Stylized figures =====

function getCourtArt(rank, suit, color) {
  const courtStyle = {
    11: { // Page - standing figure holding symbol
      body: `<g transform="translate(100,145)">
        <circle cx="0" cy="-35" r="7" fill="${color}" opacity="0.25"/>
        <path d="M0,-28 L0,0 M0,-12 L-14,-4 M0,-12 L14,-4 M0,0 L-10,10 M0,0 L10,10" stroke="${color}" stroke-width="0.8" opacity="0.25" fill="none" stroke-linecap="round"/>
        <path d="M-10,10 L-14,18 M10,10 L14,18" stroke="${color}" stroke-width="0.5" opacity="0.2" fill="none" stroke-linecap="round"/>
        <rect x="-14" y="-12" width="6" height="14" rx="1" fill="none" stroke="${color}" stroke-width="0.4" opacity="0.12"/>
        <!-- Ground -->
        <line x1="-25" y1="22" x2="25" y2="22" stroke="${color}" stroke-width="0.3" opacity="0.08"/>
      </g>`,
      label: 'PAGE',
    },
    12: { // Knight - riding figure
      body: `<g transform="translate(100,145)">
        <circle cx="0" cy="-35" r="6" fill="${color}" opacity="0.25"/>
        <!-- Helmet -->
        <path d="M-6,-38 L6,-38 L6,-32 L-6,-32 Z" fill="none" stroke="${color}" stroke-width="0.4" opacity="0.15"/>
        <!-- Body -->
        <path d="M0,-28 L0,-5 M0,-12 L-12,-6 M0,-12 L12,-6" stroke="${color}" stroke-width="0.8" opacity="0.25" fill="none" stroke-linecap="round"/>
        <!-- Horse head -->
        <path d="M-12,-6 L-20,-2 Q-22,2 -18,4 L-12,2" fill="none" stroke="${color}" stroke-width="0.5" opacity="0.15"/>
        <!-- Lance -->
        <line x1="12" y1="-6" x2="25" y2="-25" stroke="${color}" stroke-width="0.5" opacity="0.2"/>
        <!-- Shield -->
        <ellipse cx="-4" cy="-15" rx="5" ry="6" fill="none" stroke="${color}" stroke-width="0.3" opacity="0.1"/>
        <!-- Ground -->
        <line x1="-30" y1="18" x2="30" y2="18" stroke="${color}" stroke-width="0.3" opacity="0.08"/>
      </g>`,
      label: 'KNIGHT',
    },
    13: { // Queen - seated figure with crown
      body: `<g transform="translate(100,145)">
        <circle cx="0" cy="-35" r="7" fill="${color}" opacity="0.25"/>
        <!-- Crown -->
        <path d="M-8,-43 L-6,-48 L-3,-44 L0,-50 L3,-44 L6,-48 L8,-43" stroke="${color}" stroke-width="0.4" opacity="0.15" fill="none"/>
        <!-- Body in throne -->
        <path d="M0,-28 L0,0 M0,-12 L-14,-4 M0,-12 L14,-4" stroke="${color}" stroke-width="0.8" opacity="0.25" fill="none" stroke-linecap="round"/>
        <!-- Throne -->
        <rect x="-18" y="-8" width="36" height="10" rx="2" fill="none" stroke="${color}" stroke-width="0.4" opacity="0.1"/>
        <rect x="-22" y="-10" width="44" height="3" fill="none" stroke="${color}" stroke-width="0.3" opacity="0.08"/>
        <!-- Scepter -->
        <line x1="14" y1="-4" x2="18" y2="-20" stroke="${color}" stroke-width="0.4" opacity="0.15"/>
        <circle cx="18" cy="-22" r="3" fill="none" stroke="${color}" stroke-width="0.3" opacity="0.1"/>
        <!-- Robe -->
        <path d="M-14,0 Q0,10 14,0" fill="none" stroke="${color}" stroke-width="0.3" opacity="0.08"/>
      </g>`,
      label: 'QUEEN',
    },
    14: { // King - seated figure with crown and scepter
      body: `<g transform="translate(100,145)">
        <circle cx="0" cy="-35" r="7" fill="${color}" opacity="0.3"/>
        <!-- Crown -->
        <rect x="-8" y="-44" width="16" height="5" rx="1" fill="none" stroke="${color}" stroke-width="0.4" opacity="0.18"/>
        <path d="M-6,-44 L-6,-48 L0,-44 L6,-48 L6,-44" stroke="${color}" stroke-width="0.3" opacity="0.12" fill="none"/>
        <!-- Body -->
        <path d="M0,-28 L0,0 M0,-12 L-15,-4 M0,-12 L15,-4" stroke="${color}" stroke-width="0.9" opacity="0.3" fill="none" stroke-linecap="round"/>
        <!-- Throne -->
        <rect x="-22" y="-8" width="44" height="12" rx="2" fill="none" stroke="${color}" stroke-width="0.4" opacity="0.1"/>
        <rect x="-25" y="-10" width="50" height="3" fill="none" stroke="${color}" stroke-width="0.3" opacity="0.08"/>
        <!-- Scepter -->
        <line x1="15" y1="-5" x2="20" y2="-25" stroke="${color}" stroke-width="0.5" opacity="0.18"/>
        <!-- Orb -->
        <circle cx="-15" cy="5" r="5" fill="none" stroke="${color}" stroke-width="0.3" opacity="0.1"/>
        <line x1="-15" y1="0" x2="-15" y2="10" stroke="${color}" stroke-width="0.2" opacity="0.06"/>
        <path d="M-10,-5 Q-15,-10 -20,-5" fill="none" stroke="${color}" stroke-width="0.2" opacity="0.06"/>
        <!-- Arm rests -->
        <path d="M-22,-8 Q-26,-4 -22,0 M22,-8 Q26,-4 22,0" stroke="${color}" stroke-width="0.3" opacity="0.06"/>
      </g>`,
      label: 'KING',
    },
  };

  const cs = courtStyle[rank];
  if (!cs) return '';

  return cs.body;
}

function getCourtLabel(rank) {
  const labels = { 11: 'PAGE', 12: 'KNIGHT', 13: 'QUEEN', 14: 'KING' };
  return labels[rank] || '';
}

// ===== Main Card Front Generator =====

function generateCardFrontSVG(card, lang) {
  const isMajor = card.arcana === 'major';
  const isCourt = card.rank >= 11;
  const color = getSuitColor(card.arcana === 'major' ? 'major' : card.suit);

  // Background
  const bg = getCardBackground(card, color);

  // Corner rank/suit display
  const corners = getCornerDisplay(card, color);

  // Central illustration
  let art;
  if (isMajor) {
    art = getMajorArt(card.rank, color);
  } else if (isCourt) {
    art = getCourtArt(card.rank, card.suit, color);
  } else {
    art = getPipArt(card.rank, card.suit, color);
  }

  // Card name at bottom
  const name = lang === 'zh' ? card.nameZh : card.nameEn;

  return `<svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
    ${bg}
    ${corners}
    <g transform="translate(0, 0)">
      ${art}
    </g>
    <rect x="2" y="2" width="196" height="296" rx="10" fill="none" stroke="${color}" stroke-width="1.2" opacity="0.35"/>
    <!-- Card name -->
    <text x="100" y="${isCourt ? 278 : 278}" font-size="${isMajor ? 10 : 10}" fill="${color}" text-anchor="middle" font-family="Cinzel,serif" opacity="0.7">${name}</text>
    <!-- Small decorative elements -->
    <path d="M10,270 L15,265 L20,270 L15,275 Z" fill="${color}" opacity="0.08"/>
    <path d="M180,270 L185,265 L190,270 L185,275 Z" fill="${color}" opacity="0.08"/>
  </svg>`;
}
