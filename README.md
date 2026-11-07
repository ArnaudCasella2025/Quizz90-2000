# Quizz 90's-2000's 📼💿🎮

Quiz multijoueur de culture pop des années 90-2000 : une personne crée une partie et chacun joue sur son téléphone, sans rien installer.

- **Front** : HTML/CSS/JS pur (modules ES), sans étape de build. Il est hébergé sur **GitHub Pages**.
- **Base partagée et temps réel** : **Firebase Realtime Database** (offre gratuite « Spark »), avec une **authentification anonyme**, donc aucun compte à créer pour les joueurs.

## Fonctionnalités (MVP)

| Écran | Contenu |
|---|---|
| Accueil | Logo, « Créer une partie », « Rejoindre une partie », reprise de la dernière partie, accès au mode TV |
| Créer | Pseudo et avatar, « je joue aussi » ou « j'anime seulement », 10/20/30 questions, chrono (auto ou 10 à 60 s), bonus de rapidité, questions « Cite-moi » |
| Rejoindre | Code à 4 caractères (ou QR code / lien direct `#/join/CODE`), pseudo, avatar |
| Lobby | Code, QR code, bouton de partage, joueurs avec avatar, « Lancer le quiz » pour l'hôte et « En attente du lancement… » pour les autres |
| Question | Catégorie, difficulté, numéro, chrono synchronisé (accéléré à 10 s, alerte à 5 s, verrouillage à 0), réponses A/B/C ou champs libres |
| Réponse | « ✓ Réponse enregistrée » (non modifiable) ou « ⏰ Temps écoulé » |
| Correction | Pour les questions « Cite-moi », l'hôte coche les bonnes réponses, qui sont pré-cochées automatiquement |
| Résultat | Bonne réponse, nombre de joueurs par réponse, points gagnés, phrase humoristique, statistique automatique, top 3 |
| Classement | Score total, position, évolution (↑/↓), points de la dernière question |
| Fin | Grand gagnant (ex æquo gérés), classement final, phrase selon le rang, « Allez, encore une partie ! » |
| Mode TV | `#/tv/CODE` : un grand écran affiche la question, le chrono, les résultats et le classement, pendant que les joueurs répondent sur leur téléphone |

**Fiabilité et anti-triche** (voir `database.rules.json`) :
- Les réponses sont horodatées **par le serveur**. Une réponse est refusée après la fin du chrono (avec 1,5 s de tolérance réseau), une fois la question close, ou si elle a déjà été envoyée.
- Seul l'hôte peut écrire les scores et faire avancer la partie. Un joueur ne peut modifier que son pseudo, son avatar et son statut de connexion.
- Les bonnes réponses sont stockées dans `keys/{code}`, que seul l'hôte peut lire. Elles ne sont publiées qu'au moment de la révélation.
- **Reconnexion** : l'identité anonyme est conservée par le navigateur. En rouvrant le lien (ou via « Reprendre la partie »), le joueur retrouve son pseudo, son score et la question en cours.

> Le déroulement (passage aux questions suivantes, calcul des scores) est piloté par l'appareil de l'hôte, et la base de données reste la source de vérité. Si l'hôte se déconnecte, la partie se met en pause et reprend dès qu'il revient. Les autres joueurs ne perdent rien.

## 🚀 Mise en ligne (≈ 10 minutes)

### 1. Créer la base Firebase (gratuit)
1. Aller sur <https://console.firebase.google.com> et cliquer sur **Ajouter un projet** (Google Analytics n'est pas utile).
2. **Build → Authentication → Commencer → Sign-in method** : activer **Anonyme**.
3. **Build → Realtime Database → Créer une base de données** (région Europe conseillée), puis démarrer en **mode verrouillé**.
4. Dans l'onglet **Règles** de la Realtime Database, coller le contenu de [`database.rules.json`](database.rules.json) puis cliquer sur **Publier**.
5. **Paramètres du projet (⚙️) → Vos applications → `</>` (Web)** : enregistrer l'application, puis copier l'objet `firebaseConfig`. Vérifier qu'il contient bien `databaseURL` ; si ce n'est pas le cas, la recopier depuis la page Realtime Database.

### 2. Brancher l'application
Dans [`js/config.js`](js/config.js), remplacer `export const FIREBASE_CONFIG = null;` par la configuration copiée :

```js
export const FIREBASE_CONFIG = {
  apiKey: "AIza...",
  authDomain: "mon-quiz.firebaseapp.com",
  databaseURL: "https://mon-quiz-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mon-quiz",
  appId: "1:123:web:abc",
};
```

> Cette configuration n'est pas un secret : elle est faite pour être publique. Ce sont les règles de sécurité qui protègent les données.

### 3. Publier sur GitHub Pages
**Settings → Pages → Build and deployment → Deploy from a branch**, choisir la branche (par ex. `main`) et le dossier `/ (root)`.
L'URL sera du type `https://<utilisateur>.github.io/Quizz90-2000/`.

Si l'authentification refuse le domaine, ajouter `<utilisateur>.github.io` dans **Authentication → Settings → Domaines autorisés**.

### Mode démo (sans Firebase)
Tant que `FIREBASE_CONFIG` vaut `null`, l'application fonctionne en **mode démo** : les données restent dans le navigateur. Il suffit d'ouvrir plusieurs onglets pour simuler plusieurs joueurs. C'est pratique pour tester, mais ce mode ne permet pas de jouer sur plusieurs téléphones.

En local :

```bash
python3 -m http.server 8000
```

Ouvrir ensuite <http://localhost:8000>.

## ✏️ Personnaliser

- **Questions** : [`js/questions.js`](js/questions.js) contient environ 100 questions réparties en 7 catégories et 3 niveaux. Pour un QCM, la bonne réponse se met en 1er (l'ordre est mélangé en jeu). Les questions « Cite-moi » (`type: 'free'`) ont une liste `accepted` qui sert à la pré-correction.
- **Règles de score, durées, catégories, avatars** : [`js/config.js`](js/config.js) (`basePoints`, `speedBonus`, `pointsPerItem`, `categoryWeights`, `maxPlayers`…).
- **Graphismes** : `assets/img/`, issus de la charte graphique et convertis en WebP.

## 📁 Structure

```
index.html              point d'entrée
css/style.css           charte graphique, mobile-first, mode TV
js/app.js               routage et écrans
js/game.js              logique : création, connexion, moteur de l'hôte, scores
js/db.js                accès aux données (Firebase ou démo locale)
js/questions.js         banque de questions
js/config.js            configuration Firebase et règles du jeu
js/ui.js                utilitaires d'interface
database.rules.json     règles de sécurité Firebase
vendor/qrcode.js        génération des QR codes (MIT, Kazuhiko Arase)
```

## Pistes V2
Interface d'administration des questions, sons, pause, transfert du rôle d'hôte, nettoyage automatique des anciennes parties, questions avec image, blind test.
