# SportSee

Application React de dashboard sportif, développée dans le cadre du parcours OpenClassrooms.

L'objectif est de reproduire fidèlement une maquette HTML/CSS existante sous forme d'application React fonctionnelle, avec authentification JWT et données dynamiques récupérées via une API locale.

---

## Stack technique

| Technologie | Rôle |
|---|---|
| React 18 | Interface utilisateur |
| React Router 6 | Navigation et routes protégées |
| Context API | État global (auth, données utilisateur) |
| Fetch API | Appels HTTP vers l'API locale |
| Vite | Outil de build et serveur de développement |
| CSS existant | Styles repris de la maquette HTML/CSS |

API locale : `http://localhost:8000`

---

## Prérequis

- [Node.js](https://nodejs.org/) (v18 ou supérieur recommandé)
- npm
- API SportSee lancée en local sur le port `8000`

---

## Installation

```bash
npm install
npm run dev
```

L'application sera accessible sur `http://localhost:5173` (port par défaut de Vite).

---

## Lancement de l'API locale

L'API doit être démarrée **avant** le frontend. Elle doit écouter sur :

```
http://localhost:8000
```

### Endpoints utilisés

| Méthode | Endpoint | Description |
|---|---|---|
| `POST` | `/api/login` | Authentification |
| `GET` | `/api/user-info` | Informations de profil et statistiques globales |
| `GET` | `/api/user-activity?startWeek=<date>&endWeek=<date>` | Sessions d'activité sur une période |

> **Important :** ne pas utiliser `/login` (sans `/api/`), ni `/api/profile-image`. L'image de profil est fournie directement via le champ `profile.profilePicture` dans la réponse de `/api/user-info`.

Les dates envoyées à `/api/user-activity` doivent être au format `YYYY-MM-DD`.

---

## Identifiants de test

```
sophiemartin / password123
emmaleroy   / password789
marcdubois  / password456
```

---

## Données API

### `POST /api/login`

Corps de la requête :

```json
{
  "username": "sophiemartin",
  "password": "password123"
}
```

Réponse :

```json
{
  "token": "jwt-token",
  "userId": "user123"
}
```

### `GET /api/user-info`

Réponse :

```json
{
  "profile": {
    "firstName": "Sophie",
    "lastName": "Martin",
    "createdAt": "2025-01-01",
    "age": 32,
    "weight": 60,
    "height": 165,
    "profilePicture": "http://localhost:8000/images/sophie.jpg"
  },
  "statistics": {
    "totalDistance": "2250.2",
    "totalSessions": 348,
    "totalDuration": 14625
  }
}
```

Champs utilisés dans l'application :

- `profile.firstName` / `profile.lastName` → nom complet
- `profile.createdAt` → date d'inscription (`memberSince`)
- `profile.age` / `profile.weight` / `profile.height` → données physiques
- `profile.profilePicture` → URL de la photo de profil
- `statistics.totalDistance` → distance totale (km)
- `statistics.totalSessions` → nombre total de sessions
- `statistics.totalDuration` → durée totale (minutes)

### `GET /api/user-activity`

Réponse (tableau de sessions) :

```json
[
  {
    "date": "2025-01-04",
    "distance": 5.8,
    "duration": 38,
    "heartRate": {
      "min": 140,
      "max": 178,
      "average": 163
    },
    "caloriesBurned": 422
  }
]
```

Champs utilisés :

- `date` → date de la session
- `distance` → distance en km
- `duration` → durée en minutes
- `heartRate.min` / `heartRate.max` / `heartRate.average` → fréquence cardiaque
- `caloriesBurned` → calories brûlées

---

## Données statiques conservées pour la maquette

Certaines informations visibles dans la maquette ne sont pas exposées par l'API locale. Elles sont donc conservées en valeurs statiques dans la page Profile afin de préserver le rendu attendu de la maquette.

Champs concernés :

- **Genre** (`Femme`)
- **Calories brûlées** (`25 000 kcal`)
- **Nombre de jours de repos** (`9 jours`)

Ces valeurs sont définies dans `src/pages/ProfilePage.jsx` via la constante `profileFallbackStats` et n'ont pas vocation à être récupérées depuis l'API dans l'état actuel du backend.

---

## Architecture du projet

```
sportsee-html-structure/
├── assets/
│   ├── icons/          # Icônes SVG
│   └── images/         # Images (fallback profil, etc.)
├── src/
│   ├── components/
│   │   ├── Header/     # Header avec navigation
│   │   ├── Footer/     # Footer
│   │   └── ProtectedRoute/  # HOC de protection des routes
│   ├── context/
│   │   ├── AuthContext.jsx   # Authentification JWT (signIn, signOut)
│   │   └── UserContext.jsx   # Données utilisateur globales (profil + stats)
│   ├── hooks/
│   │   └── useUserActivity.js  # Récupération et normalisation des sessions d'activité
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── NotFoundPage.jsx
│   ├── services/
│   │   └── api.js      # Fonctions fetch vers l'API (login, getUserInfo, getUserActivity)
│   ├── styles/         # Fichiers CSS
│   ├── App.jsx         # Routeur principal
│   └── main.jsx        # Point d'entrée React
├── CLAUDE.md
└── package.json
```

---

## Fonctionnalités

- **Connexion** : formulaire `username` / `password`, appel `POST /api/login`, stockage du token JWT dans `localStorage`
- **Déconnexion** : suppression du token via `signOut()` dans `AuthContext`
- **Routes protégées** : redirection automatique vers `/login` si aucun token n'est présent
- **Dashboard** : affichage du nom, de la date d'inscription, de la distance totale, des statistiques hebdomadaires d'activité (sessions, durée, distance, fréquence cardiaque moyenne)
- **Profil** : affichage du nom, de la date d'inscription, de l'image de profil, des données physiques et des statistiques globales
- **Image de profil** : chargée depuis `profile.profilePicture` ; image locale `profile-clara.jpg` utilisée en fallback en cas d'erreur de chargement
- **États de chargement et d'erreur** : gérés dans `UserContext` et affichés dans `ProfilePage`

---

## Points de vigilance

- Le backend doit être lancé **avant** le frontend.
- Le token JWT est stocké dans `localStorage` sous la clé `token`.
- Les routes `/dashboard` et `/profile` redirigent vers `/login` si aucun token n'est présent.
- Les dates envoyées à `/api/user-activity` sont au format `YYYY-MM-DD`.
- Ne pas appeler `/api/profile-image` : ce endpoint n'est pas utilisé.
- Certaines données de profil (genre, calories, jours de repos) sont statiques et ne proviennent pas de l'API.

---

## Tests manuels

- [ ] Lancer l'API sur `http://localhost:8000`
- [ ] Lancer le frontend avec `npm run dev`
- [ ] Se connecter avec `sophiemartin / password123`
- [ ] Vérifier que le Dashboard affiche le nom, la distance totale et les statistiques hebdomadaires
- [ ] Vérifier que la page Profile affiche les données de profil dynamiques
- [ ] Vérifier que l'image de profil est bien chargée depuis `profile.profilePicture`
- [ ] Vérifier qu'aucune requête vers `/api/profile-image` n'est émise (onglet Réseau des DevTools)
- [ ] Vérifier que les données statiques de maquette (genre, calories, jours de repos) sont visibles sur la page Profile
- [ ] Vérifier que la déconnexion redirige vers `/login`
- [ ] Vérifier qu'un accès direct à `/dashboard` sans token redirige vers `/login`
