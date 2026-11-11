import { FIREBASE_CONFIG, GAME, AVATARS } from './config.js?v=20261111094125';
import { createDb } from './db.js?v=20261111094125';
import {
  cleanCode, gamePath, createGame, joinGame, submitAnswer, HostEngine, rankPlayers,
  autoGrade, statMessage, randomLine, finalLine,
} from './game.js?v=20261111094125';
import { h, img, fmt, medal, catLabel, DIFF, toast, avatarEl, qrCodeSvg, segmented, toggle } from './ui.js?v=20261111094125';

const app = document.getElementById('app');
let db;
let cleanup = null;

// ------------------------------------------------------------ préférences locales
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } },
};
const profile = () => store.get('q90-profile', { name: '', avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)] });
const saveProfile = (p) => store.set('q90-profile', p);
const joinUrl = (code) => `${location.origin}${location.pathname}#/join/${code}`;
const go = (hash) => { if (location.hash === hash) route(); else location.hash = hash; };

function setBg(n) { document.body.dataset.bg = n; }

// ------------------------------------------------------------ démarrage
async function boot() {
  app.replaceChildren(h('div', { class: 'screen center' }, img('logo', 'logo-big pulse'), h('p', { class: 'muted' }, 'Chargement…')));
  try {
    db = await createDb(FIREBASE_CONFIG);
  } catch (e) {
    console.error(e);
    app.replaceChildren(h('div', { class: 'screen center' }, img('logo', 'logo-big'),
      h('div', { class: 'panel' }, h('h2', {}, 'Connexion impossible 😵'),
        h('p', {}, 'Vérifie ta connexion Internet puis recharge la page.'),
        h('p', { class: 'small muted' }, String(e.message || e)),
        h('button', { class: 'btn btn-pink', onclick: () => location.reload() }, 'Réessayer'))));
    return;
  }
  document.body.classList.toggle('demo', db.mode === 'local');
  window.addEventListener('hashchange', route);
  route();
}

function route() {
  if (cleanup) { cleanup(); cleanup = null; }
  window.scrollTo(0, 0);
  const [, page, arg] = (location.hash || '#/').split('/');
  document.body.classList.remove('tv');
  switch (page) {
    case 'create': return renderCreate();
    case 'join': return renderJoin(cleanCode(arg));
    case 'game': return arg ? mountGame(cleanCode(arg), 'play') : go('#/');
    case 'tv':
      if (arg) { document.body.classList.add('tv'); return mountGame(cleanCode(arg), 'tv'); }
      return renderTvEntry();
    default: return renderHome();
  }
}

const demoBanner = () => (db.mode === 'local'
  ? h('div', { class: 'demo-banner' }, '🧪 Mode démo : les données restent dans ce navigateur (ouvre plusieurs onglets pour simuler des joueurs). Configure Firebase pour jouer sur plusieurs téléphones.')
  : h('p', { class: 'online-badge' }, '🟢 Serveur en ligne : jouable sur plusieurs téléphones'));

// ============================================================ ÉCRAN 1 — ACCUEIL
function renderHome() {
  setBg('bg2');
  const resume = h('div');
  const last = store.get('q90-last', null);
  if (last?.code) {
    db.get(`${gamePath(last.code)}/meta`).then((m) => {
      if (m && m.status !== 'finished') {
        resume.replaceChildren(h('button', { class: 'btn btn-violet', onclick: () => go(`#/game/${last.code}`) }, `↩ Reprendre la partie ${last.code}`));
      }
    }).catch(() => {});
  }
  app.replaceChildren(h('div', { class: 'screen home' },
    img('logo', 'logo-big pop', 'Quizz 90’s-2000’s'),
    h('p', { class: 'tagline' }, 'Le quiz qui sent bon la cassette, le Tamagotchi et le modem 56K.'),
    h('div', { class: 'stack' },
      h('button', { class: 'btn btn-pink big', onclick: () => go('#/create') }, '🎤 Créer une partie'),
      h('button', { class: 'btn btn-yellow big', onclick: () => go('#/join') }, '🎮 Rejoindre une partie'),
      resume),
    h('a', { class: 'link', href: '#/tv' }, '📺 Afficher une partie sur un écran TV'),
    demoBanner()));
}

// ------------------------------------------------------------ champs pseudo + avatar
function profileFields(state) {
  const name = h('input', {
    class: 'input', type: 'text', maxlength: '16', placeholder: 'Jennie', value: state.name,
    autocomplete: 'nickname', enterkeyhint: 'go', oninput: () => { state.name = name.value; },
  });
  const grid = h('div', { class: 'avatar-grid' });
  const draw = () => grid.replaceChildren(...AVATARS.map((a) => h('button', {
    type: 'button', class: 'avatar-pick' + (a === state.avatar ? ' on' : ''), 'aria-label': `Avatar ${a}`,
    onclick: () => { state.avatar = a; draw(); },
  }, a)));
  draw();
  return { name, nodes: [h('label', { class: 'label' }, 'Ton pseudo'), name, h('label', { class: 'label' }, 'Ton avatar'), grid] };
}

const backLink = () => h('a', { class: 'back', href: '#/' }, '← Retour');

// ============================================================ ÉCRAN 2 — CRÉER
function renderCreate() {
  setBg('bg2');
  const p = profile();
  const st = { ...p, hostPlays: true, count: GAME.defaultQuestionCount, duration: 'auto', level: 'mix', speedBonus: true, includeFree: true };
  const f = profileFields(st);
  const playerBlock = h('div', {}, f.nodes);
  const btn = h('button', { class: 'btn btn-pink big', type: 'submit' }, 'Créer la partie');
  const form = h('form', {
    class: 'panel form',
    onsubmit: async (e) => {
      e.preventDefault();
      st.name = st.name.trim();
      if (st.hostPlays && !st.name) { f.name.focus(); return toast('Choisis un pseudo 😉'); }
      btn.disabled = true; btn.textContent = 'Création…';
      try {
        saveProfile({ name: st.name, avatar: st.avatar });
        const code = await createGame(db, st);
        go(`#/game/${code}`);
      } catch (err) {
        toast(err.message || 'Erreur'); btn.disabled = false; btn.textContent = 'Créer la partie';
      }
    },
  },
  h('h2', { class: 'title' }, 'Créer une partie'),
  toggle('Je joue aussi (sinon : j’anime seulement)', st.hostPlays, (v) => { st.hostPlays = v; playerBlock.hidden = !v; }),
  playerBlock,
  h('label', { class: 'label' }, 'Nombre de questions'),
  segmented(GAME.questionCounts.map((n) => [n, String(n)]), st.count, (v) => { st.count = v; }),
  h('label', { class: 'label' }, 'Niveau des questions'),
  segmented([['easy', '🟢 Facile'], ['mix', '🎲 Mix'], ['hard', '🔴 Expert']], st.level, (v) => { st.level = v; }),
  h('label', { class: 'label' }, 'Chrono par question'),
  segmented([['auto', 'Auto'], ...GAME.durations.map((d) => [d, `${d}s`])], st.duration, (v) => { st.duration = v; }),
  toggle('Bonus de rapidité ⚡', st.speedBonus, (v) => { st.speedBonus = v; }),
  toggle('Questions « Cite-moi » (corrigées par l’hôte) ✍️', st.includeFree, (v) => { st.includeFree = v; }),
  btn);
  app.replaceChildren(h('div', { class: 'screen' }, img('logo', 'logo-mid'), form, backLink(), demoBanner()));
}

// ============================================================ ÉCRAN 3 — REJOINDRE
function renderJoin(prefill) {
  setBg('bg2');
  const st = profile();
  const f = profileFields(st);
  const code = h('input', {
    class: 'input code-input', type: 'text', inputmode: 'text', maxlength: '4', placeholder: '7K42',
    autocapitalize: 'characters', autocomplete: 'off', spellcheck: false, value: prefill || '',
    oninput: () => { code.value = cleanCode(code.value); },
  });
  const btn = h('button', { class: 'btn btn-yellow big', type: 'submit' }, 'C’est parti !');
  const form = h('form', {
    class: 'panel form',
    onsubmit: async (e) => {
      e.preventDefault();
      const c = cleanCode(code.value);
      st.name = st.name.trim();
      if (c.length !== 4) { code.focus(); return toast('Le code fait 4 caractères'); }
      if (!st.name) { f.name.focus(); return toast('Choisis un pseudo 😉'); }
      btn.disabled = true;
      try {
        saveProfile({ name: st.name, avatar: st.avatar });
        await joinGame(db, c, st);
        go(`#/game/${c}`);
      } catch (err) {
        toast(err.message || 'Erreur'); btn.disabled = false;
      }
    },
  },
  h('h2', { class: 'title' }, 'Rejoindre une partie'),
  h('label', { class: 'label' }, 'Code de la partie'), code,
  f.nodes, btn);
  app.replaceChildren(h('div', { class: 'screen' }, img('logo', 'logo-mid'), form, backLink(), demoBanner()));
  setTimeout(() => (prefill ? f.name : code).focus(), 50);
}

function renderTvEntry() {
  setBg('bg2');
  const code = h('input', { class: 'input code-input', maxlength: '4', placeholder: '7K42', autocapitalize: 'characters', oninput: () => { code.value = cleanCode(code.value); } });
  app.replaceChildren(h('div', { class: 'screen' }, img('logo', 'logo-mid'),
    h('form', { class: 'panel form', onsubmit: (e) => { e.preventDefault(); if (code.value.length === 4) go(`#/tv/${code.value}`); } },
      h('h2', { class: 'title' }, '📺 Mode écran TV'),
      h('p', {}, 'Affiche la question, le chrono et le classement en grand sur une TV ou un ordinateur, pendant que chacun répond sur son téléphone.'),
      h('label', { class: 'label' }, 'Code de la partie'), code,
      h('button', { class: 'btn btn-violet big' }, 'Afficher')),
    backLink()));
}

// ============================================================ PARTIE (écrans 4 à 10)
function mountGame(code, mode) {
  const ctx = { code, mode, uid: db.uid, g: null, engine: null, tv: mode === 'tv' };
  let view = null; let key = null; let tick = null; let presenceOff = null; let wakeLock = null;

  const requestWake = () => navigator.wakeLock?.request('screen').then((w) => { wakeLock = w; }).catch(() => {});
  requestWake();
  const onVis = () => { if (document.visibilityState === 'visible') requestWake(); };
  document.addEventListener('visibilitychange', onVis);

  const unsub = db.on(gamePath(code), (g) => {
    if (!g || !g.meta) {
      view?.destroy?.(); view = null; key = null;
      app.replaceChildren(h('div', { class: 'screen center' }, img('logo', 'logo-mid'),
        h('div', { class: 'panel' }, h('h2', {}, 'Partie introuvable 🤔'), h('p', {}, `Aucune partie avec le code ${code}.`),
          h('button', { class: 'btn btn-pink', onclick: () => go('#/') }, 'Accueil'))));
      return;
    }
    ctx.g = g;
    ctx.isHost = !ctx.tv && g.meta.hostUid === db.uid;
    ctx.me = ctx.tv ? null : g.players?.[db.uid] || null;
    if (!ctx.tv && !ctx.isHost && !ctx.me) { go(`#/join/${code}`); return; }
    if (!ctx.tv) store.set('q90-last', { code });
    if (ctx.isHost && !ctx.engine) {
      ctx.engine = new HostEngine(db, code);
      tick = setInterval(() => ctx.engine.tick(), 250);
    }
    if (ctx.engine) ctx.engine.game = g;
    if (ctx.me && !presenceOff) presenceOff = db.presence(`${gamePath(code)}/players/${db.uid}/connected`, true, false);

    const k = `${g.meta.status}:${g.meta.qKey || ''}`;
    if (k !== key) {
      view?.destroy?.();
      key = k;
      const factory = VIEWS[g.meta.status] || VIEWS.lobby;
      view = factory(ctx);
      app.replaceChildren(view.el);
      window.scrollTo(0, 0);
    }
    view.update?.(g);
  });

  cleanup = () => {
    unsub(); view?.destroy?.();
    clearInterval(tick); presenceOff?.();
    document.removeEventListener('visibilitychange', onVis);
    wakeLock?.release?.().catch(() => {});
  };
}

// ------------------------------------------------------------ éléments communs
function header(ctx, { counter = true } = {}) {
  const g = ctx.g;
  const name = ctx.tv ? '📺 Écran TV' : ctx.me ? ctx.me.name : '🎤 Animateur';
  const av = ctx.me ? ctx.me.avatar : ctx.tv ? '📺' : '🎤';
  const q = g.meta.qIndex >= 0 ? Math.min(g.meta.qIndex + 1, g.meta.total) : 0;
  return h('header', { class: 'top' },
    h('a', { href: '#/', class: 'logo-link', onclick: (e) => { if (!confirm('Quitter la partie ? (tu pourras la reprendre)')) e.preventDefault(); } },
      img('logo', 'logo-small', 'Accueil')),
    h('div', { class: 'top-row' },
      h('div', { class: 'name-pill' }, h('span', { class: 'name-star' }, av), h('span', { class: 'name-text' }, name)),
      counter && q ? h('div', { class: 'q-pill' }, 'Question ', h('b', {}, `${q} / ${g.meta.total}`)) : h('div', { class: 'q-pill' }, 'Code ', h('b', {}, ctx.code))));
}

function hostBar(ctx, ...buttons) {
  if (!ctx.isHost) return null;
  return h('div', { class: 'host-bar' }, ...buttons,
    h('button', { class: 'btn-text', onclick: () => { if (confirm('Terminer la partie maintenant ?')) ctx.engine.finish(); } }, '⏹ Terminer la partie'));
}

function playersCount(g) { return Object.keys(g.players || {}).length; }

// ============================================================ ÉCRAN 4 — LOBBY
function lobbyView(ctx) {
  setBg('bg2');
  const list = h('div', { class: 'players' });
  const count = h('span');
  const startBtn = ctx.isHost ? h('button', { class: 'btn btn-pink big', onclick: () => ctx.engine.start() }, '🚀 Lancer le quiz') : null;
  const url = joinUrl(ctx.code);
  const share = async () => {
    const text = `Rejoins ma partie Quiz 90s–2000s !\nCode : ${ctx.code}`;
    try {
      if (navigator.share) await navigator.share({ title: 'Quizz 90’s-2000’s', text, url });
      else { await navigator.clipboard.writeText(`${text}\n${url}`); toast('Lien copié ! 📋'); }
    } catch { /* annulé */ }
  };
  const el = h('div', { class: 'screen lobby' },
    img('logo', ctx.tv ? 'logo-mid' : 'logo-mid'),
    h('div', { class: 'sticker sticker-pink tilt-l' }, 'La partie est prête !'),
    h('div', { class: 'lobby-code panel' },
      h('div', { class: 'code-block' }, h('div', { class: 'label' }, 'Code de la partie'), h('div', { class: 'big-code' }, ctx.code),
        !ctx.tv ? h('button', { class: 'btn btn-small btn-yellow', onclick: share }, '📤 Partager') : h('p', { class: 'small' }, 'Scanne le QR code ou va sur', h('br'), h('b', {}, location.host + location.pathname))),
      h('div', { class: 'qr', html: qrCodeSvg(url) })),
    h('h3', { class: 'section-title' }, 'Joueurs ', count),
    list,
    ctx.isHost
      ? h('div', { class: 'stack' }, startBtn,
        !ctx.g.meta.hostPlays ? h('p', { class: 'small center-text' }, 'Tu animes sans jouer. Astuce : ouvre le mode TV sur un grand écran 📺') : null,
        h('a', { class: 'link small', href: `#/tv/${ctx.code}`, target: '_blank' }, '📺 Ouvrir l’écran TV'))
      : h('p', { class: 'waiting' }, 'En attente du lancement', h('span', { class: 'dots' })));
  return {
    el,
    update(g) {
      const ps = rankPlayers(g.players, g.scores);
      count.textContent = `(${ps.length}/${GAME.maxPlayers})`;
      list.replaceChildren(...(ps.length ? ps.map((p, i) => h('div', {
        class: 'player-chip pop' + (p.uid === ctx.uid ? ' me' : '') + (p.connected === false ? ' off' : ''),
        style: { animationDelay: `${(i % 6) * 40}ms` },
      }, avatarEl(p.avatar), h('span', {}, p.name))) : [h('p', { class: 'muted' }, 'Personne pour l’instant… partage le code !')]));
      if (startBtn) startBtn.disabled = ps.length === 0;
    },
  };
}

// ------------------------------------------------------------ chrono
function timerEl() {
  const fill = h('div', { class: 'timer-fill' });
  const secs = h('div', { class: 'timer-secs' }, '');
  const el = h('div', { class: 'timer', role: 'timer' },
    img('timer-icon', 'timer-icon'), h('div', { class: 'timer-track' }, fill, secs));
  return {
    el,
    set(remainingMs, durationS) {
      const r = Math.max(0, remainingMs);
      const s = Math.ceil(r / 1000);
      fill.style.width = `${(79 * r) / (durationS * 1000)}%`;
      secs.textContent = `${s} s`;
      el.classList.toggle('hurry', s <= 10 && s > 5);
      el.classList.toggle('alert', s <= 5 && s > 0);
      el.classList.toggle('over', s === 0);
    },
  };
}

function useClock(ctx, fn) {
  let raf;
  const loop = () => {
    const m = ctx.g.meta;
    const start = typeof m.startedAt === 'number' ? m.startedAt : db.now();
    fn(start + m.duration * 1000 - db.now(), m.duration);
    raf = requestAnimationFrame(loop);
  };
  loop();
  return () => cancelAnimationFrame(raf);
}

function questionCard(q) {
  return h('div', { class: 'paper' },
    img('paper-ornament', 'paper-ornament'),
    q.kind === 'jesuis' ? h('div', { class: 'q-kind' }, '🕵️ Qui suis-je ?') : null,
    h('div', { class: 'q-meta' }, catLabel(q.cat), ' · ', DIFF[q.diff] || ''),
    q.image ? h('img', { class: 'q-image', src: q.image, alt: '' }) : null,
    h('p', { class: 'q-text' + (q.text.length > 90 ? ' long' : '') }, q.text),
    img('underline', 'underline'));
}

const LETTERS = ['a', 'b', 'c'];
function answerButton(i, text, onClick) {
  const l = LETTERS[i];
  return h('button', { type: 'button', class: `answer answer-${l}`, onclick: onClick, 'aria-label': `Réponse ${l.toUpperCase()} : ${text}` },
    img(`letter-${l}`, 'answer-letter'), h('span', { class: 'answer-text' }, text), h('span', { class: 'answer-badge' }));
}

// ============================================================ ÉCRANS 5 & 6 — QUESTION / RÉPONSE ENREGISTRÉE
function questionView(ctx) {
  setBg('bg1');
  const q = ctx.g.current;
  const qKey = ctx.g.meta.qKey;
  const timer = timerEl();
  const status = h('div', { class: 'answer-status' });
  const progress = h('p', { class: 'progress' });
  const canAnswer = !!ctx.me;
  let sending = false;
  let expired = false;
  let autoSent = false;

  const myAnswer = () => ctx.g.answers?.[qKey]?.[ctx.uid];

  const send = async (payload) => {
    if (sending || myAnswer() || expired) return;
    sending = true;
    navigator.vibrate?.(30);
    try {
      await submitAnswer(db, ctx.code, qKey, payload);
    } catch (e) {
      console.warn(e);
      toast('⏰ Trop tard, la réponse n’a pas été prise en compte');
    } finally { sending = false; render(); }
    render();
  };

  let answersEl;
  let inputs = [];
  if (q.type === 'free') {
    inputs = Array.from({ length: q.count }, (_, i) => h('input', {
      class: 'input free-input', type: 'text', maxlength: '40', placeholder: `Réponse ${i + 1}`,
      autocomplete: 'off', enterkeyhint: i < q.count - 1 ? 'next' : 'done',
      onkeydown: (e) => { if (e.key === 'Enter') { e.preventDefault(); (inputs[i + 1] || e.target).focus(); } },
    }));
    const submit = h('button', { class: 'btn btn-pink', type: 'button', onclick: () => send({ items: inputs.map((x) => x.value.trim()) }) }, 'Valider mes réponses');
    answersEl = canAnswer
      ? h('div', { class: 'free-box panel' }, inputs.map((inp, i) => h('div', { class: 'free-row' }, h('span', { class: 'free-num' }, i + 1), inp)), submit)
      : h('div', { class: 'free-box panel center-text' }, h('p', { class: 'big-text' }, `✍️ Les joueurs écrivent ${q.count} réponses…`));
  } else {
    answersEl = h('div', { class: 'answers' }, q.choices.map((c, i) => answerButton(i, c, canAnswer ? () => send({ choice: i }) : null)));
    if (!canAnswer) answersEl.classList.add('readonly');
  }

  const close = ctx.isHost ? h('button', { class: 'btn btn-small btn-violet', onclick: () => ctx.engine.close() }, '⏭ Clore la question') : null;

  const el = h('div', { class: `screen game q-${q.type}` },
    header(ctx), timer.el, questionCard(q), answersEl, status, progress,
    hostBar(ctx, close));

  function render() {
    const a = myAnswer();
    const done = !!a;
    if (q.type === 'qcm') {
      [...answersEl.children].forEach((b, i) => {
        b.disabled = !canAnswer || done || expired;
        b.classList.toggle('selected', done && a.choice === i);
        b.classList.toggle('dim', (done && a.choice !== i) || (expired && !done && canAnswer));
      });
    } else if (canAnswer) {
      inputs.forEach((x, i) => {
        x.disabled = done || expired;
        if (done && a.items) x.value = a.items[i] || '';
      });
      answersEl.querySelector('.btn').disabled = done || expired;
    }
    if (!canAnswer) status.replaceChildren();
    else if (done) status.replaceChildren(h('div', { class: 'sticker sticker-green pop' }, '✓ Réponse enregistrée'));
    else if (expired) status.replaceChildren(h('div', { class: 'sticker sticker-red pop' }, '⏰ Temps écoulé'));
    else status.replaceChildren();
  }

  const stopClock = useClock(ctx, (remaining, dur) => {
    timer.set(remaining, dur);
    if (remaining <= 0 && !expired) {
      expired = true;
      // Questions libres : on envoie automatiquement ce qui a été tapé.
      if (q.type === 'free' && canAnswer && !myAnswer() && !autoSent && inputs.some((x) => x.value.trim())) {
        autoSent = true; expired = false;
        send({ items: inputs.map((x) => x.value.trim()) }).then(() => { expired = true; render(); });
      }
      render();
    }
  });

  return {
    el,
    update(g) {
      const ans = g.answers?.[qKey] || {};
      const n = Object.keys(g.players || {}).length;
      progress.textContent = n ? `${Object.keys(ans).length} / ${n} ont répondu` : '';
      render();
    },
    destroy: stopClock,
  };
}

// ============================================================ CORRECTION « CITE-MOI » (hôte)
function gradingView(ctx) {
  setBg('bg1');
  const q = ctx.g.current;
  const qKey = ctx.g.meta.qKey;
  const el = h('div', { class: 'screen game' }, header(ctx), questionCard(q));
  if (!ctx.isHost) {
    const mine = ctx.g.answers?.[qKey]?.[ctx.uid];
    el.append(h('div', { class: 'sticker sticker-violet tilt-r' }, '🧐 L’hôte corrige les réponses…'),
      mine ? h('div', { class: 'panel' }, h('p', { class: 'label' }, 'Tes réponses :'), h('ul', { class: 'my-items' }, (mine.items || []).filter(Boolean).map((t) => h('li', {}, t))))
        : h('p', { class: 'waiting' }, 'Pas de réponse cette fois-ci ⏰'));
    return { el };
  }
  // Hôte : pré-correction automatique puis validation manuelle.
  const grades = {};
  const cards = [];
  let accepted = [];
  const list = h('div', { class: 'grading' }, h('p', { class: 'muted' }, 'Chargement…'));
  const possible = h('details', { class: 'panel possible', open: true });
  ctx.engine.question(ctx.g.meta.qIndex).then((full) => {
    accepted = full.accepted;
    possible.replaceChildren(
      h('summary', {}, `💡 Réponses possibles (${accepted.length})`),
      h('ul', { class: 'possible-list' }, accepted.map((a) => {
        const [main, ...alts] = a.split('|');
        return h('li', {}, h('b', {}, main), alts.length ? h('span', { class: 'muted' }, ` (${alts.join(', ')})`) : null);
      })));
    const ans = ctx.g.answers?.[qKey] || {};
    const players = rankPlayers(ctx.g.players, ctx.g.scores).sort((a, b) => a.name.localeCompare(b.name));
    list.replaceChildren(...players.map((p) => {
      const items = (ans[p.uid]?.items || []).filter(Boolean);
      const auto = autoGrade(items, accepted);
      const score = h('b', { class: 'grade-score' });
      const boxes = items.map((t, i) => h('input', { type: 'checkbox', checked: auto[i] >= 0 }));
      const recount = () => {
        grades[p.uid] = Math.min(q.count, boxes.filter((b) => b.checked).length);
        score.textContent = `${grades[p.uid]} / ${q.count}`;
      };
      boxes.forEach((b) => b.addEventListener('change', recount));
      recount();
      const card = h('div', { class: 'panel grade-card' },
        h('div', { class: 'grade-head' }, avatarEl(p.avatar), h('span', { class: 'grade-name' }, p.name), score),
        items.length
          ? h('div', { class: 'grade-items' }, items.map((t, i) => h('label', { class: 'grade-item' }, boxes[i], h('span', {}, t))))
          : h('p', { class: 'muted small' }, 'Pas de réponse'));
      cards.push(card);
      return card;
    }));
  });
  el.append(
    h('div', { class: 'sticker sticker-violet tilt-r' }, '✍️ À toi de corriger !'),
    h('p', { class: 'small center-text' }, 'Les bonnes réponses ont été pré-cochées : vérifie et ajuste. La liste ci-dessous t’aide à trancher.'),
    possible,
    list,
    hostBar(ctx, h('button', { class: 'btn btn-pink big', onclick: () => ctx.engine.submitGrades(grades) }, '✅ Valider la correction')));
  return { el };
}

// ============================================================ ÉCRAN 7 — RÉSULTAT DE LA QUESTION
function revealView(ctx) {
  setBg('bg1');
  const g = ctx.g;
  const r = g.reveal || {};
  const q = g.current;
  const mine = r.results?.[ctx.uid];
  const el = h('div', { class: 'screen game' }, header(ctx));

  if (r.type === 'free') {
    el.append(h('div', { class: 'sticker sticker-yellow tilt-l' }, 'Correction'),
      h('div', { class: 'paper' }, img('paper-ornament', 'paper-ornament'),
        h('p', { class: 'q-text small-q' }, r.text),
        h('p', { class: 'examples' }, 'Il fallait citer par exemple : ', h('b', {}, (r.examples || []).join(', '))),
        img('underline', 'underline')));
  } else {
    const counts = [0, 0, 0];
    Object.values(r.results || {}).forEach((x) => { if (x.answered) counts[x.choice] = (counts[x.choice] || 0) + 1; });
    el.append(h('div', { class: 'sticker sticker-yellow tilt-l pop' }, 'Bonne réponse'),
      h('div', { class: 'paper' }, img('paper-ornament', 'paper-ornament'),
        h('p', { class: 'q-text small-q' }, r.text),
        h('p', { class: 'reveal-answer' }, r.correctText, r.fun ? ` ${r.fun}` : ''),
        r.explain ? h('p', { class: 'explain' }, r.explain) : null,
        img('underline', 'underline')),
      h('div', { class: 'answers readonly' }, (q?.choices || []).map((c, i) => {
        const b = answerButton(i, c, null);
        b.disabled = true;
        b.classList.toggle('correct', i === r.correct);
        b.classList.toggle('dim', i !== r.correct && !(mine && mine.choice === i));
        b.classList.toggle('wrong', !!mine && mine.choice === i && i !== r.correct);
        b.querySelector('.answer-badge').textContent = i === r.correct ? '✓' : (mine && mine.choice === i ? '✗' : '');
        if (counts[i]) b.append(h('span', { class: 'answer-count' }, `${counts[i]} 👤`));
        return b;
      })));
  }

  if (mine) {
    const line = !mine.answered ? randomLine('none') : mine.correct ? randomLine('right') : randomLine('wrong');
    const title = !mine.answered ? '⏰ Pas de réponse'
      : r.type === 'free' ? `${mine.valid} / ${r.count} bonne${mine.valid > 1 ? 's' : ''} réponse${mine.valid > 1 ? 's' : ''}`
        : mine.correct ? '🎉 Bien joué !' : '😬 Raté !';
    el.append(h('div', { class: `result-card panel ${mine.correct ? 'ok' : 'ko'}` },
      h('div', { class: 'result-title' }, title),
      h('div', { class: 'result-points' }, `+${fmt(mine.points)} pts`),
      h('p', { class: 'result-line' }, line)));
  }
  el.append(h('p', { class: 'stat' }, statMessage(r.stats || {})));

  const isLast = g.meta.qIndex + 1 >= g.meta.total;
  if (ctx.isHost) el.append(hostBar(ctx, h('button', { class: 'btn btn-pink big', onclick: () => ctx.engine.next() }, isLast ? '🏁 Résultats finaux' : '▶ Question suivante')));
  else el.append(h('p', { class: 'waiting' }, isLast ? 'Résultats finaux dans un instant' : 'Question suivante dans un instant', h('span', { class: 'dots' })));
  return { el };
}

// ============================================================ ÉCRAN 8 — CLASSEMENT
function leaderboardView(ctx) {
  setBg('bg2');
  const g = ctx.g;
  const ranked = rankPlayers(g.players, g.scores);
  const isLast = g.meta.qIndex + 1 >= g.meta.total;
  const arrow = (p) => {
    const d = (p.prevRank || p.position) - p.position;
    return d > 0 ? h('span', { class: 'move up' }, `↑ +${d}`) : d < 0 ? h('span', { class: 'move down' }, `↓ ${d}`) : h('span', { class: 'move' }, '=');
  };
  const me = ranked.find((p) => p.uid === ctx.uid);
  const el = h('div', { class: 'screen game' }, header(ctx),
    h('div', { class: 'sticker sticker-pink tilt-r pop' }, '🏆 Classement'),
    me ? h('div', { class: 'my-rank panel' },
      avatarEl(me.avatar),
      h('div', { class: 'grow' }, h('div', { class: 'my-name' }, me.name), h('div', {}, `${medal(me.position)} ${me.position === 1 ? '1re' : me.position + 'e'} place`)),
      h('div', { class: 'right' }, h('div', { class: 'my-total' }, `${fmt(me.total)} pts`), arrow(me))) : null,
    h('ol', { class: 'board' }, ranked.map((p, i) => h('li', {
      class: 'board-row pop' + (p.uid === ctx.uid ? ' me' : '') + (p.position <= 3 ? ` podium-${p.position}` : ''),
      style: { animationDelay: `${Math.min(i, 10) * 50}ms` },
    },
    h('span', { class: 'pos' }, medal(p.position)), avatarEl(p.avatar, 'small'),
    h('span', { class: 'grow name' }, p.name),
    p.last ? h('span', { class: 'gain' }, `+${fmt(p.last)}`) : null,
    arrow(p),
    h('b', { class: 'total' }, fmt(p.total))))),
    hostBar(ctx, h('button', { class: 'btn btn-pink big', onclick: () => ctx.engine.next() }, isLast ? '🏁 Résultats finaux' : '▶ Question suivante')),
    !ctx.isHost ? h('p', { class: 'waiting' }, isLast ? 'Résultats finaux dans un instant' : 'Question suivante dans un instant', h('span', { class: 'dots' })) : null);
  return { el };
}

// ============================================================ ÉCRAN 10 — FIN DE PARTIE
function finalView(ctx) {
  setBg('bg2');
  const g = ctx.g;
  const ranked = rankPlayers(g.players, g.scores);
  const winner = ranked[0];
  const me = ranked.find((p) => p.uid === ctx.uid);
  const winners = ranked.filter((p) => p.position === 1);
  const confetti = h('div', { class: 'confetti', 'aria-hidden': 'true' },
    Array.from({ length: 18 }, (_, i) => h('span', { style: { left: `${(i * 37) % 100}%`, animationDelay: `${(i % 6) * 0.4}s`, animationDuration: `${3 + (i % 4)}s` } }, ['⭐', '💿', '📼', '✨', '🎉', '💖'][i % 6])));
  localStorage.removeItem('q90-last');
  const el = h('div', { class: 'screen game final' }, confetti,
    img('logo', 'logo-mid'),
    h('div', { class: 'sticker sticker-yellow tilt-l pop' }, '🏆 Fin du quiz'),
    winner ? h('div', { class: 'winner panel pop' },
      h('div', { class: 'label' }, winners.length > 1 ? 'Grands gagnants ex æquo' : 'Grand gagnant'),
      h('div', { class: 'winner-name' }, '🥇 ', winners.map((w) => w.name).join(' & ')),
      h('div', { class: 'winner-points' }, `${fmt(winner.total)} points`)) : h('p', {}, 'Aucun joueur 😢'),
    h('ol', { class: 'board' }, ranked.slice(winners.length).map((p) => h('li', { class: 'board-row' + (p.uid === ctx.uid ? ' me' : '') },
      h('span', { class: 'pos' }, medal(p.position)), avatarEl(p.avatar, 'small'), h('span', { class: 'grow name' }, p.name), h('b', { class: 'total' }, fmt(p.total))))),
    me ? h('div', { class: 'sticker sticker-violet' }, finalLine(me.position, ranked.length)) : null,
    !ctx.tv ? h('div', { class: 'stack' }, h('button', { class: 'btn btn-pink big', onclick: () => go('#/') }, 'Allez, encore une partie !')) : null);
  return { el };
}

const VIEWS = {
  lobby: lobbyView,
  question: questionView,
  grading: gradingView,
  reveal: revealView,
  leaderboard: leaderboardView,
  finished: finalView,
};

boot();
