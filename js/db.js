// ============================================================
//  Couche d'accès aux données.
//  Deux implémentations avec la même interface :
//   - Firebase Realtime Database (mode réel, multi-téléphones)
//   - Local (mode démo : localStorage + BroadcastChannel, un seul navigateur)
// ============================================================

const FIREBASE_VERSION = '10.14.1';
const FB = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/`;

/** Sentinelle « horodatage serveur ». */
export const TS = { '.sv': 'timestamp' };

export async function createDb(config) {
  if (!config) return createLocalDb();
  return createFirebaseDb(config);
}

// ------------------------------------------------------------
//  Firebase
// ------------------------------------------------------------
async function createFirebaseDb(config) {
  const [{ initializeApp }, A, D] = await Promise.all([
    import(FB + 'firebase-app.js'),
    import(FB + 'firebase-auth.js'),
    import(FB + 'firebase-database.js'),
  ]);
  const { emulators, ...firebaseConfig } = config;
  const app = initializeApp(firebaseConfig);
  const auth = A.getAuth(app);
  // Développement uniquement : emulators: { auth: 'http://127.0.0.1:9099', database: ['127.0.0.1', 9000] }
  if (emulators?.auth) A.connectAuthEmulator(auth, emulators.auth, { disableWarnings: true });
  if (auth.authStateReady) await auth.authStateReady();
  const user = auth.currentUser || (await A.signInAnonymously(auth)).user;
  const db = D.getDatabase(app);
  if (emulators?.database) D.connectDatabaseEmulator(db, ...emulators.database);
  const r = (p) => D.ref(db, p);

  let offset = 0;
  D.onValue(r('.info/serverTimeOffset'), (s) => { offset = s.val() || 0; });

  let connected = false;
  const connListeners = new Set();
  D.onValue(r('.info/connected'), (s) => {
    connected = !!s.val();
    connListeners.forEach((cb) => cb(connected));
  });

  return {
    mode: 'firebase',
    uid: user.uid,
    now: () => Date.now() + offset,
    get: async (p) => (await D.get(r(p))).val(),
    set: (p, v) => D.set(r(p), v),
    update: (p, obj) => D.update(r(p), obj),
    remove: (p) => D.remove(r(p)),
    on(p, cb) {
      return D.onValue(r(p), (s) => cb(s.val()), (err) => console.error('[db]', p, err));
    },
    /** Crée la valeur seulement si le chemin est vide. Renvoie true si créée. */
    async claim(p, v) {
      try {
        const res = await D.runTransaction(r(p), (cur) => (cur === null ? v : undefined), { applyLocally: false });
        return res.committed;
      } catch (e) {
        return false;
      }
    },
    /** Maintient `path` à `onlineValue` tant que l'on est connecté. */
    presence(p, onlineValue, offlineValue) {
      const apply = (isOn) => {
        if (!isOn) return;
        D.onDisconnect(r(p)).set(offlineValue).then(() => D.set(r(p), onlineValue)).catch(() => {});
      };
      connListeners.add(apply);
      if (connected) apply(true);
      return () => {
        connListeners.delete(apply);
        D.onDisconnect(r(p)).cancel().catch(() => {});
      };
    },
    onConnection(cb) {
      connListeners.add(cb);
      cb(connected);
      return () => connListeners.delete(cb);
    },
  };
}

// ------------------------------------------------------------
//  Local (démo)
// ------------------------------------------------------------
function createLocalDb() {
  const KEY = 'q90-demo-db';
  const parts = (p) => p.split('/').filter(Boolean);
  const load = () => {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
  };
  const save = (t) => localStorage.setItem(KEY, JSON.stringify(t));

  // Chaque onglet = un joueur différent.
  let uid = sessionStorage.getItem('q90-demo-uid');
  if (!uid) {
    uid = 'demo-' + Math.random().toString(36).slice(2, 10);
    sessionStorage.setItem('q90-demo-uid', uid);
  }

  const getAt = (t, p) => parts(p).reduce((n, k) => (n == null ? undefined : n[k]), t);
  const clean = (v) => {
    if (v && typeof v === 'object') {
      if (v['.sv'] === 'timestamp') return Date.now();
      const out = Array.isArray(v) ? [] : {};
      for (const [k, x] of Object.entries(v)) {
        const c = clean(x);
        if (c !== null && c !== undefined) out[k] = c;
      }
      return out;
    }
    return v;
  };
  const setAt = (t, p, v) => {
    const ks = parts(p);
    let n = t;
    for (let i = 0; i < ks.length - 1; i++) {
      if (n[ks[i]] == null || typeof n[ks[i]] !== 'object') n[ks[i]] = {};
      n = n[ks[i]];
    }
    const last = ks[ks.length - 1];
    const c = clean(v);
    if (c === null || c === undefined) delete n[last];
    else n[last] = c;
  };

  const listeners = new Set();
  const channel = 'BroadcastChannel' in window ? new BroadcastChannel('q90-demo') : null;
  const notify = () => {
    const t = load();
    for (const l of listeners) {
      const v = getAt(t, l.path) ?? null;
      const s = JSON.stringify(v);
      if (s !== l.last) { l.last = s; l.cb(v === null ? null : JSON.parse(s)); }
    }
  };
  if (channel) channel.onmessage = notify;
  window.addEventListener('storage', (e) => { if (e.key === KEY) notify(); });
  const write = (fn) => {
    const t = load();
    fn(t);
    save(t);
    notify();
    channel && channel.postMessage(1);
    return Promise.resolve();
  };

  return {
    mode: 'local',
    uid,
    now: () => Date.now(),
    get: async (p) => getAt(load(), p) ?? null,
    set: (p, v) => write((t) => setAt(t, p, v)),
    update: (p, obj) => write((t) => {
      for (const [k, v] of Object.entries(obj)) setAt(t, p + '/' + k, v);
    }),
    remove: (p) => write((t) => setAt(t, p, null)),
    on(p, cb) {
      const l = { path: p, cb, last: undefined };
      listeners.add(l);
      queueMicrotask(notify);
      return () => listeners.delete(l);
    },
    async claim(p, v) {
      if (getAt(load(), p) != null) return false;
      await write((t) => setAt(t, p, v));
      return true;
    },
    presence(p, onlineValue, offlineValue) {
      write((t) => setAt(t, p, onlineValue));
      const off = () => write((t) => setAt(t, p, offlineValue));
      window.addEventListener('pagehide', off);
      return () => window.removeEventListener('pagehide', off);
    },
    onConnection(cb) { cb(true); return () => {}; },
  };
}
