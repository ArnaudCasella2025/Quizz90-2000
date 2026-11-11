// ============================================================
//  Logique de jeu : création, connexion, déroulement, scores.
//  L'appareil de l'HÔTE pilote la partie ; la base de données
//  (Firebase) est la source de vérité : horodatage serveur des
//  réponses, réponses non modifiables et verrouillage à la fin
//  du chrono sont garantis par les règles de sécurité.
// ============================================================

import { TS } from './db.js?v=20261111094125';
import { GAME } from './config.js?v=20261111094125';
import { QUESTIONS } from './questions.js?v=20261111094125';

const CODE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export const cleanCode = (s) => (s || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
export const gamePath = (code) => `games/${code}`;

// ------------------------------------------------------------ utilitaires
export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function normalizeText(s) {
  return (s || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function levenshtein(a, b) {
  if (Math.abs(a.length - b.length) > 1) return 2;
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return dp[a.length][b.length];
}

/** Pré-correction d'une réponse « Cite-moi » : renvoie, pour chaque item, l'index
 *  de la réponse acceptée reconnue (ou -1). Les doublons ne comptent qu'une fois. */
export function autoGrade(items, accepted) {
  const groups = (accepted || []).map((g) => g.split('|').map(normalizeText).filter(Boolean));
  const used = new Set();
  return (items || []).map((raw) => {
    const n = normalizeText(raw);
    if (!n) return -1;
    const idx = groups.findIndex((aliases) => aliases.some((a) =>
      a === n
      || (n.length >= 4 && a.length >= 4 && (` ${n} `.includes(` ${a} `) || ` ${a} `.includes(` ${n} `)))
      || (n.length >= 5 && levenshtein(a, n) <= 1)));
    if (idx < 0 || used.has(idx)) return -1;
    used.add(idx);
    return idx;
  });
}

export function speedBonus(elapsedMs, durationS) {
  const { max, min, fullRatio } = GAME.speedBonus;
  const T = durationS * 1000;
  const ratio = Math.min(1, Math.max(0, (elapsedMs - fullRatio * T) / ((1 - fullRatio) * T)));
  return Math.round((max - (max - min) * ratio) / 5) * 5;
}

/** Classement « compétition » : 1, 2, 2, 4… */
export function rankPlayers(players, scores) {
  const list = Object.entries(players || {}).map(([uid, p]) => ({
    uid, ...p, ...(scores?.[uid] || {}), total: scores?.[uid]?.total || 0,
  }));
  list.sort((a, b) => b.total - a.total || (a.joinedAt || 0) - (b.joinedAt || 0));
  list.forEach((p, i) => { p.position = i > 0 && p.total === list[i - 1].total ? list[i - 1].position : i + 1; });
  return list;
}

// ------------------------------------------------------------ sélection des questions
const SEEN_KEY = 'q90-seen';
function loadSeen() {
  try { return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || '[]')); } catch { return new Set(); }
}
function saveSeen(ids) {
  const s = loadSeen();
  ids.forEach((id) => s.add(id));
  // Quand presque tout a été vu, on repart de zéro.
  const out = s.size >= QUESTIONS.length - 10 ? ids : [...s];
  try { localStorage.setItem(SEEN_KEY, JSON.stringify(out)); } catch { /* ignore */ }
}

// Niveaux : Tranquille = facile + moyen, Expert = moyen + difficile (difficiles en priorité).
const LEVELS = { easy: [1, 2], mix: [1, 2, 3], hard: [2, 3] };

export function selectQuestions({ count, includeFree, duration, level = 'mix' }) {
  const seen = loadSeen();
  const diffs = LEVELS[level] || LEVELS.mix;
  const allowed = (q) => includeFree || q.type !== 'free';
  let pool = QUESTIONS.filter((q) => allowed(q) && diffs.includes(q.diff));
  if (pool.filter((q) => q.type !== 'free').length < count) pool = QUESTIONS.filter(allowed);
  const prio = (q) => (level === 'hard' && q.diff !== 3 ? 1 : 0);
  const byCat = {};
  for (const q of shuffle(pool).sort((a, b) => seen.has(a.id) - seen.has(b.id) || prio(a) - prio(b))) {
    (byCat[q.cat] ||= []).push(q);
  }
  const maxFree = includeFree ? Math.max(1, Math.floor(count * GAME.maxFreeRatio)) : 0;
  // 1) les questions « Cite-moi » (non vues en priorité)
  const chosen = shuffle(pool.filter((q) => q.type === 'free'))
    .sort((a, b) => seen.has(a.id) - seen.has(b.id))
    .slice(0, maxFree);
  for (const c of Object.keys(byCat)) byCat[c] = byCat[c].filter((q) => q.type !== 'free');
  // 2) les QCM, tirés selon la répartition des catégories
  while (chosen.length < count) {
    const cats = Object.keys(byCat).filter((c) => byCat[c].length);
    if (!cats.length) break;
    const weights = cats.map((c) => GAME.categoryWeights[c] || 5);
    let r = Math.random() * weights.reduce((s, w) => s + w, 0);
    const cat = cats.find((c, i) => (r -= weights[i]) < 0) || cats[0];
    chosen.push(byCat[cat].shift());
  }
  // Ordre : QCM mélangés, questions « Cite-moi » réparties régulièrement (jamais en 1re).
  const qcm = shuffle(chosen.filter((q) => q.type !== 'free'));
  const frees = chosen.filter((q) => q.type === 'free');
  const ordered = qcm.slice();
  frees.forEach((q, k) => {
    const pos = Math.round(((k + 1) * (ordered.length + 1)) / (frees.length + 1));
    ordered.splice(Math.max(1, pos), 0, q);
  });
  saveSeen(ordered.map((q) => q.id));

  return ordered.map((q, index) => {
    const isFree = q.type === 'free';
    const dur = isFree
      ? q.duration || GAME.defaultFreeDuration
      : duration === 'auto' ? q.duration || (GAME.defaultDurationByDifficulty[q.diff] || 20) + (q.kind === 'jesuis' ? 5 : 0) : Number(duration);
    const base = {
      index, id: q.id, type: isFree ? 'free' : 'qcm', cat: q.cat, diff: q.diff, text: q.q,
      duration: dur, points: q.points || GAME.basePoints,
      kind: q.kind || null, explain: q.explain || null, fun: q.fun || null, image: q.image || null,
    };
    if (isFree) return { ...base, count: q.count, accepted: q.accepted || [] };
    const order = shuffle([0, 1, 2].slice(0, q.a.length));
    return { ...base, choices: order.map((i) => q.a[i]), correct: order.indexOf(0) };
  });
}

/** Partie publique d'une question (sans la bonne réponse). */
function publicQuestion(q, total) {
  const pub = {
    index: q.index, total, id: q.id, type: q.type, cat: q.cat, diff: q.diff,
    kind: q.kind || null, text: q.text, duration: q.duration, image: q.image || null,
  };
  if (q.type === 'free') pub.count = q.count;
  else pub.choices = q.choices;
  return pub;
}

// ------------------------------------------------------------ création / connexion
export async function createGame(db, opts) {
  const questions = selectQuestions(opts);
  const meta = {
    hostUid: db.uid,
    hostPlays: !!opts.hostPlays,
    status: 'lobby',
    createdAt: db.now(),
    total: questions.length,
    qIndex: -1,
    settings: { level: opts.level || 'mix', speedBonus: !!opts.speedBonus, includeFree: !!opts.includeFree, duration: String(opts.duration) },
  };
  let code = null;
  for (let attempt = 0; attempt < 12 && !code; attempt++) {
    const c = Array.from({ length: 4 }, () => pick(CODE_ALPHABET)).join('');
    if (await db.claim(`${gamePath(c)}/meta`, meta)) code = c;
  }
  if (!code) throw new Error('Impossible de créer la partie, réessaie.');
  await db.set(`keys/${code}`, { questions });
  if (opts.hostPlays) await joinGame(db, code, { name: opts.name, avatar: opts.avatar });
  return code;
}

export async function joinGame(db, code, { name, avatar }) {
  code = cleanCode(code);
  const g = await db.get(gamePath(code));
  if (!g || !g.meta) throw new Error('Aucune partie avec ce code.');
  if (g.meta.status === 'finished') throw new Error('Cette partie est terminée.');
  const players = g.players || {};
  const me = players[db.uid];
  if (!me) {
    if (Object.keys(players).length >= GAME.maxPlayers) throw new Error('La partie est complète.');
    const taken = Object.values(players).some((p) => normalizeText(p.name) === normalizeText(name));
    if (taken) throw new Error('Ce pseudo est déjà pris dans cette partie.');
  }
  await db.update(`${gamePath(code)}/players/${db.uid}`, {
    name, avatar, connected: true, ...(me ? {} : { joinedAt: TS }),
  });
  return code;
}

export function submitAnswer(db, code, qKey, payload) {
  return db.set(`${gamePath(code)}/answers/${qKey}/${db.uid}`, { ...payload, at: TS });
}

// ------------------------------------------------------------ messages
export function statMessage({ players, answered, correct }) {
  if (!players) return '';
  if (correct === 0) return answered ? 'Personne n’a trouvé ! 😱' : 'Personne n’a répondu… 😴';
  if (correct === players && players > 1) return 'Tout le monde a trouvé ! Trop facile ? 😎';
  if (correct === 1) return players === 1 ? 'Bien joué ! 👏' : 'Un seul joueur a trouvé ! 🔥';
  if (correct <= 2 || correct / players < 0.25) return `Seulement ${correct} joueurs ont trouvé !`;
  return `${Math.round((100 * correct) / players)} % des joueurs ont trouvé la bonne réponse`;
}

export const LINES = {
  right: [
    'Ta mémoire est en mode turbo 🚀',
    'Tu savais ça ? Nous sommes inquiets. 🤨',
    'Tu viens officiellement de battre Internet Explorer. 🏁',
    'Respect, tu as rembobiné la cassette sans crayon. 📼',
    'Ça, c’est du niveau Club Dorothée ! ⭐',
  ],
  wrong: [
    'Ton cerveau vient de faire un bruit de modem 56K. 📞',
    '1998 t’appelle. Il veut récupérer son t-shirt. 👕',
    'Même ton Tamagotchi aurait trouvé… 🥚',
    'Erreur de lecture. Souffle dans la cartouche et réessaie. 🎮',
  ],
  none: [
    'Tu étais parti rembobiner une cassette ? 📼',
    'Connexion perdue… comme quand quelqu’un décrochait le téléphone. ☎️',
  ],
  final: [
    '🧠 Ton cerveau est officiellement resté bloqué en 1999.',
    '📼 Tu connais trop bien les pubs de ton enfance.',
    '📺 Tu as clairement trop regardé M6.',
    '🎮 Respect. Tu as survécu aux années 2000.',
  ],
};
export const randomLine = (kind) => pick(LINES[kind]);
export function finalLine(position, count) {
  if (position === 1) return LINES.final[0];
  const r = count > 1 ? (position - 1) / (count - 1) : 0;
  return r <= 0.34 ? LINES.final[1] : r <= 0.67 ? LINES.final[2] : LINES.final[3];
}

// ------------------------------------------------------------ moteur de l'hôte
export class HostEngine {
  constructor(db, code) {
    this.db = db;
    this.code = code;
    this.base = gamePath(code);
    this.keys = null;
    this.busy = false;
    this.game = null; // dernier état reçu
  }

  async loadKeys() {
    if (!this.keys) this.keys = await this.db.get(`keys/${this.code}`);
    if (!this.keys) throw new Error('Questions introuvables pour cette partie.');
    return this.keys.questions;
  }

  async question(i) { return (await this.loadKeys())[i]; }

  async run(fn) {
    if (this.busy) return;
    this.busy = true;
    try { await fn(); } catch (e) { console.error(e); alert(e.message || e); } finally { this.busy = false; }
  }

  start() { return this.run(() => this.startQuestion(0)); }

  next() {
    const m = this.game.meta;
    return this.run(() => (m.qIndex + 1 < m.total ? this.startQuestion(m.qIndex + 1) : this.finishNow()));
  }

  async startQuestion(i) {
    const qs = await this.loadKeys();
    const q = qs[i];
    await this.db.update(this.base, {
      current: publicQuestion(q, qs.length),
      reveal: null,
      'meta/status': 'question',
      'meta/qIndex': i,
      'meta/qKey': 'q' + i,
      'meta/startedAt': TS,
      'meta/duration': q.duration,
      'meta/locked': false,
    });
  }

  /** Appelé régulièrement par l'écran de l'hôte pendant une question. */
  tick() {
    const g = this.game;
    if (!g || this.busy || g.meta.status !== 'question' || g.meta.locked || typeof g.meta.startedAt !== 'number') return;
    const deadline = g.meta.startedAt + g.meta.duration * 1000;
    const expected = Object.entries(g.players || {}).filter(([, p]) => p.connected !== false).map(([uid]) => uid);
    const answers = g.answers?.[g.meta.qKey] || {};
    const allIn = expected.length > 0 && expected.every((uid) => answers[uid]);
    if (allIn || this.db.now() > deadline + GAME.graceMs) this.close();
  }

  close() {
    return this.run(async () => {
      const m = this.game.meta;
      if (m.status !== 'question') return;
      await this.db.update(`${this.base}/meta`, { locked: true });
      const q = await this.question(m.qIndex);
      if (q.type === 'free') {
        await this.db.update(`${this.base}/meta`, { status: 'grading' });
        return;
      }
      const answers = (await this.db.get(`${this.base}/answers/${m.qKey}`)) || {};
      const bonusOn = m.settings?.speedBonus;
      const results = {};
      for (const uid of Object.keys(this.game.players || {})) {
        const a = answers[uid];
        const ok = !!a && a.choice === q.correct;
        const pts = ok ? q.points + (bonusOn ? speedBonus(a.at - m.startedAt, q.duration) : 0) : 0;
        results[uid] = { answered: !!a, correct: ok, points: pts, ...(a ? { choice: a.choice } : {}) };
      }
      await this.publish(q, results, { correct: q.correct, correctText: q.choices[q.correct] });
    });
  }

  /** Validation par l'hôte d'une question « Cite-moi » : grades = { uid: nbBonnesRéponses }. */
  submitGrades(grades) {
    return this.run(async () => {
      const m = this.game.meta;
      if (m.status !== 'grading') return;
      const q = await this.question(m.qIndex);
      const results = {};
      for (const uid of Object.keys(this.game.players || {})) {
        const n = Math.min(q.count, grades[uid] || 0);
        const answered = !!this.game.answers?.[m.qKey]?.[uid];
        results[uid] = { answered, correct: n > 0, valid: n, points: n * GAME.pointsPerItem };
      }
      const examples = q.accepted.map((s) => s.split('|')[0]).slice(0, 12);
      await this.publish(q, results, { count: q.count, examples });
    });
  }

  async publish(q, results, extra) {
    const g = this.game;
    const before = rankPlayers(g.players, g.scores);
    const prevPos = Object.fromEntries(before.map((p) => [p.uid, p.position]));
    const scores = {};
    for (const p of before) {
      scores[p.uid] = { total: p.total + (results[p.uid]?.points || 0) };
    }
    const after = rankPlayers(g.players, scores);
    const upd = {};
    for (const p of after) {
      upd[`scores/${p.uid}`] = {
        total: p.total,
        last: results[p.uid]?.points || 0,
        rank: p.position,
        prevRank: g.meta.qIndex === 0 ? p.position : prevPos[p.uid] || p.position,
      };
    }
    const vals = Object.values(results);
    upd.reveal = {
      qKey: g.meta.qKey,
      type: q.type,
      text: q.text,
      explain: q.explain || null,
      fun: q.fun || null,
      results,
      stats: { players: vals.length, answered: vals.filter((r) => r.answered).length, correct: vals.filter((r) => r.correct).length },
      ...extra,
    };
    upd['meta/status'] = 'reveal';
    await this.db.update(this.base, upd);
  }

  showLeaderboard() { return this.run(() => this.db.update(`${this.base}/meta`, { status: 'leaderboard' })); }

  finish() { return this.run(() => this.finishNow()); }

  finishNow() { return this.db.update(`${this.base}/meta`, { status: 'finished', locked: true, endedAt: TS }); }
}
