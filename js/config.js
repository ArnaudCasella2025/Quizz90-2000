// ============================================================
//  CONFIGURATION — Quizz 90's-2000's
// ============================================================

// 1) Base de données partagée (Firebase Realtime Database).
//    Collez ici la configuration de VOTRE projet Firebase
//    (Console Firebase → Paramètres du projet → Vos applications → Web).
//    Tant que la valeur est `null`, l'application tourne en « mode démo » :
//    les données restent dans ce navigateur (pratique pour tester avec
//    plusieurs onglets, mais impossible de jouer à plusieurs téléphones).
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAR9HFK52hB3q6K3Fkwj9dOrPvCW-OXaJU",
  authDomain: "quizz90-293a5.firebaseapp.com",
  databaseURL: "https://quizz90-293a5-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "quizz90-293a5",
  storageBucket: "quizz90-293a5.firebasestorage.app",
  messagingSenderId: "35820140797",
  appId: "1:35820140797:web:99fe01ae14f9d75f3fa694",
};
/* Exemple :
export const FIREBASE_CONFIG = {
  apiKey: "AIza...",
  authDomain: "mon-quiz.firebaseapp.com",
  databaseURL: "https://mon-quiz-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mon-quiz",
  appId: "1:123:web:abc",
};
*/

// 2) Règles du jeu (modifiables).
export const GAME = {
  maxPlayers: 20,
  questionCounts: [10, 20, 30],
  defaultQuestionCount: 20,
  durations: [10, 15, 20, 30, 45, 60],

  // Durée par défaut d'une question si elle n'en précise pas (selon difficulté 1/2/3).
  defaultDurationByDifficulty: { 1: 15, 2: 20, 3: 20 },
  defaultFreeDuration: 45,

  // Score QCM : base pour une bonne réponse.
  basePoints: 100,
  // Bonus de rapidité (si activé) : `max` points si l'on répond dans les
  // premiers `fullRatio` du temps, puis décroissance linéaire jusqu'à `min`.
  speedBonus: { max: 100, min: 50, fullRatio: 0.1 },
  // Questions « Cite-moi X » : points par bonne réponse validée par l'hôte.
  pointsPerItem: 50,

  // Délai de grâce (ms) côté serveur pour absorber la latence réseau.
  graceMs: 1500,

  // Répartition indicative des catégories (poids relatifs, modifiables).
  categoryWeights: {
    series: 22, musique: 18, cinema: 25, jeux: 9, pubs: 9, tech: 9, culture: 8,
  },
  // Proportion maximale de questions « Cite-moi » dans une partie.
  maxFreeRatio: 0.15,
};

export const CATEGORIES = {
  series: { label: 'Séries & TV', emoji: '📺' },
  musique: { label: 'Musique', emoji: '🎵' },
  cinema: { label: 'Cinéma', emoji: '🎬' },
  jeux: { label: 'Jeux vidéo', emoji: '🎮' },
  pubs: { label: 'Publicités', emoji: '📢' },
  tech: { label: 'Technologie & Internet', emoji: '💻' },
  culture: { label: 'Culture pop', emoji: '🧠' },
};

export const AVATARS = ['📼', '💿', '📺', '🎮', '📱', '⭐', '💖', '😎', '🕹️', '📷', '🛹', '🍭'];
