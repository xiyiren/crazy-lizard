// ===== Card Engine: Seeded RNG & Drawing =====

import { CARDS, SPREADS } from './data.js';

// DJB2 hash: string -> 32-bit integer
function djb2(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Linear Congruential Generator
function lcg(seed) {
  let state = seed;
  return function next() {
    state = (state * 1664525 + 1013904223) >>> 0; // keep 32-bit
    return (state >>> 0) / 4294967296;
  };
}

// Fisher-Yates shuffle using provided random function
function fisherYates(arr, rand) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Draw 3 cards based on spread type and answers
// Returns [{ card, reversed, position }]
function drawCards(spreadKey, answers) {
  const seedStr = `${spreadKey}-${answers.join(',')}`;
  const seed = djb2(seedStr);
  const rand = lcg(seed);

  const shuffled = fisherYates(CARDS, rand);
  const drawn = shuffled.slice(0, 3);

  const spread = SPREADS[spreadKey];
  if (!spread) throw new Error(`Unknown spread: ${spreadKey}`);

  return drawn.map((card, i) => ({
    card,
    reversed: rand() < 0.5,
    position: spread.positions[i],
  }));
}

// Generate a unique ID for each reading
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export { drawCards, generateId };
